import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import CryptoJS from "crypto-js"
import { ENCRYPTION_KEY, SESSION_DURATION } from "@/lib/auth/constants"

export const runtime = "nodejs"

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")

  if (!userId || !role || !username || !gameNick) {
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "user",
    username,
    game_nick: gameNick,
  }
}

function verifyAuthToken(token: string): null | {
  id: string
  role: "root" | "admin" | "ld" | "cc" | "user"
  username: string
  game_nick: string
} {
  try {
    const decodedStr = Buffer.from(token, "base64").toString()
    const decoded = JSON.parse(decodedStr)

    const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
    if (Date.now() - loginTimestamp > SESSION_DURATION) {
      return null
    }

    const signatureData = `${decoded.id}:${decoded.username}:${decoded.role}:${decoded.game_nick}`
    const expectedSignature = CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()
    if (decoded.signature !== expectedSignature) {
      return null
    }

    return {
      id: decoded.id,
      role: decoded.role,
      username: decoded.username,
      game_nick: decoded.game_nick,
    }
  } catch {
    return null
  }
}

function getUserFromRequest(request: Request) {
  // First, try headers injected by middleware
  const fromHeaders = getUserFromHeaders(request)
  if (fromHeaders) return fromHeaders

  // Fallback to Authorization bearer token parsing
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null
  const token = authHeader.substring(7)
  return verifyAuthToken(token)
}

export async function GET() {
  try {
    const { data: rows, error: rowErr } = await supabase
      .from("promotion_system_items")
      .select(
        "id, category, section_key, section_title, section_subtitle, section_color, section_sort, task_sort, task, max, points"
      )
      .order("section_sort", { ascending: true })
      .order("task_sort", { ascending: true })
      .order("id", { ascending: true })

    if (rowErr) {
      console.error("[Promotion API] GET rows error:", rowErr)
      return NextResponse.json({ error: "Ошибка получения данных" }, { status: 500 })
    }

    type SectionOut = {
      id: string
      subtitle: string
      color: string
      tasks: Array<{ id: number; task: string; max: string; points: string }>
    }

    const promotionsByKey = new Map<string, SectionOut & { name: string; section_sort: number }>()
    const reprimandsByKey = new Map<string, SectionOut & { title: string; section_sort: number }>()

    for (const r of rows || []) {
      const taskItem = { id: Number(r.id), task: r.task, max: r.max, points: r.points }
      if (r.category === "promotion") {
        const existing = promotionsByKey.get(r.section_key)
        if (!existing) {
          promotionsByKey.set(r.section_key, {
            id: r.section_key,
            name: r.section_title,
            subtitle: r.section_subtitle,
            color: r.section_color || "bg-slate-600",
            tasks: [taskItem],
            section_sort: r.section_sort ?? 0,
          })
        } else {
          existing.tasks.push(taskItem)
        }
      } else {
        const existing = reprimandsByKey.get(r.section_key)
        if (!existing) {
          reprimandsByKey.set(r.section_key, {
            id: r.section_key,
            title: r.section_title,
            subtitle: r.section_subtitle,
            color: r.section_color || "bg-slate-600",
            tasks: [taskItem],
            section_sort: r.section_sort ?? 0,
          })
        } else {
          existing.tasks.push(taskItem)
        }
      }
    }

    const promotions = Array.from(promotionsByKey.values())
      .sort((a, b) => a.section_sort - b.section_sort)
      .map(({ section_sort, ...rest }) => rest)
    const reprimands = Array.from(reprimandsByKey.values())
      .sort((a, b) => a.section_sort - b.section_sort)
      .map(({ section_sort, ...rest }) => rest)

    return NextResponse.json({ promotions, reprimands })
  } catch (error) {
    console.error("[Promotion API] GET exception:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Только администрация
    if (!["root", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
    }

    const body = await request.json()
    const action = body?.action as
      | "update_task"
      | "add_task"
      | "delete_task"

    if (!action) {
      return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 })
    }

    if (action === "update_task") {
      const { sectionKey, taskId, field, value } = body as {
        sectionKey: string
        taskId: number
        field: "task" | "max" | "points"
        value: string
      }

      if (!sectionKey || !taskId || !["task", "max", "points"].includes(field) || !value?.toString().trim()) {
        return NextResponse.json({ error: "Некорректные данные" }, { status: 400 })
      }

      // Получаем старое значение
      const { data: oldRow } = await supabase
        .from("promotion_system_items")
        .select("id, section_key, task, max, points")
        .eq("id", taskId)
        .single()

      const updatePayload: any = { [field]: value.toString().trim(), updated_at: new Date().toISOString(), updated_by: user.game_nick }
      const { data: updated, error: updErr } = await supabase
        .from("promotion_system_items")
        .update(updatePayload)
        .eq("id", taskId)
        .eq("section_key", sectionKey)
        .select()
        .single()

      if (updErr || !updated) {
        console.error("[Promotion API] Update task error:", updErr)
        return NextResponse.json({ error: "Ошибка обновления задания" }, { status: 500 })
      }

      // Логируем изменение
      supabase
        .from("action_logs")
        .insert({
          user_id: user.id,
          game_nick: user.game_nick,
          action: `Обновлено задание #${taskId} в разделе ${sectionKey}`,
          action_type: "update",
          target_type: "other",
          target_id: String(taskId),
          target_name: updated.task,
          details: oldRow ? `${field}: ${oldRow[field]} → ${updated[field]}` : `Установлено ${field}: ${updated[field]}`,
          metadata: { sectionKey, taskId, field, value },
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
          user_agent: request.headers.get("user-agent"),
        })
        .then(({ error }) => error && console.error("[Promotion API] Log error:", error))

      return NextResponse.json(updated)
    }

    if (action === "add_task") {
      const { sectionKey, task, max, points } = body as {
        sectionKey: string
        task: string
        max: string
        points: string
      }

      if (!sectionKey || !task?.toString().trim()) {
        return NextResponse.json({ error: "Некорректные данные" }, { status: 400 })
      }

      // Определяем следующий порядок
      const { data: existing, error: cntErr } = await supabase
        .from("promotion_system_items")
        .select("task_sort")
        .eq("section_key", sectionKey)
        .order("task_sort", { ascending: false })
        .limit(1)

      if (cntErr) {
        console.error("[Promotion API] Count tasks error:", cntErr)
      }

      const nextOrder = existing && existing.length > 0 ? (existing[0].task_sort || 0) + 1 : 1

      const { data: sectionRow, error: sectionErr } = await supabase
        .from("promotion_system_items")
        .select("category, section_key, section_title, section_subtitle, section_color, section_sort")
        .eq("section_key", sectionKey)
        .order("section_sort", { ascending: true })
        .limit(1)
        .single()

      if (sectionErr || !sectionRow) {
        return NextResponse.json({ error: "Раздел не найден" }, { status: 404 })
      }

      const insertPayload = {
        category: sectionRow.category,
        section_key: sectionKey,
        section_title: sectionRow.section_title,
        section_subtitle: sectionRow.section_subtitle,
        section_color: sectionRow.section_color,
        section_sort: sectionRow.section_sort,
        task: task.toString().trim(),
        max: (max ?? "1").toString().trim(),
        points: (points ?? "1").toString().trim(),
        task_sort: nextOrder,
        updated_at: new Date().toISOString(),
        updated_by: user.game_nick,
      }

      const { data: inserted, error: insErr } = await supabase
        .from("promotion_system_items")
        .insert(insertPayload)
        .select()
        .single()

      if (insErr || !inserted) {
        console.error("[Promotion API] Insert task error:", insErr)
        return NextResponse.json({ error: "Ошибка добавления задания" }, { status: 500 })
      }

      supabase
        .from("action_logs")
        .insert({
          user_id: user.id,
          game_nick: user.game_nick,
          action: `Добавлено задание в раздел ${sectionKey}`,
          action_type: "create",
          target_type: "other",
          target_id: String(inserted.id),
          target_name: inserted.task,
          details: `Добавлено задание: ${inserted.task}`,
          metadata: { sectionKey },
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
          user_agent: request.headers.get("user-agent"),
        })
        .then(({ error }) => error && console.error("[Promotion API] Log error:", error))

      return NextResponse.json(inserted, { status: 201 })
    }

    if (action === "delete_task") {
      const { taskId } = body as { taskId: number }
      if (!taskId) {
        return NextResponse.json({ error: "Некорректные данные" }, { status: 400 })
      }

      const { data: existing, error: oldErr } = await supabase
        .from("promotion_system_items")
        .select("id, section_key, task")
        .eq("id", taskId)
        .single()

      if (oldErr || !existing) {
        return NextResponse.json({ error: "Задание не найдено" }, { status: 404 })
      }

      const { error: delErr } = await supabase
        .from("promotion_system_items")
        .delete()
        .eq("id", taskId)

      if (delErr) {
        console.error("[Promotion API] Delete task error:", delErr)
        return NextResponse.json({ error: "Ошибка удаления задания" }, { status: 500 })
      }

      supabase
        .from("action_logs")
        .insert({
          user_id: user.id,
          game_nick: user.game_nick,
          action: `Удалено задание #${taskId}`,
          action_type: "delete",
          target_type: "other",
          target_id: String(taskId),
          target_name: existing.task,
          details: `Удалено задание из раздела ${existing.section_key}`,
          ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
          user_agent: request.headers.get("user-agent"),
        })
        .then(({ error }) => error && console.error("[Promotion API] Log error:", error))

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 })
  } catch (error) {
    console.error("[Promotion API] POST exception:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

