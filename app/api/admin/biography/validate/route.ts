import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { validateBiographyWithGroq } from "@/lib/biography/groq"
import type { GroqBiographyModel } from "@/lib/biography/prompt"
import { normalizeBiographyTo13Sections } from "@/lib/biography/normalize"

const MIN_CHARS = 100
const MAX_CHARS = 10000
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10

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
    role: role as "root" | "admin" | "ld" | "cc" | "instructor" | "user",
    username,
    game_nick: gameNick,
  }
}

function isAllowedRole(role: string) {
  // В проекте уже используются роли root/admin/ld. В ТЗ: root/administrator.
  // Принимаем admin как administrator, чтобы не ломать текущую RBAC.
  return role === "root" || role === "admin"
}

async function rateLimitValidateBiography(userId: string) {
  const now = new Date()
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS).toISOString()

  const { count, error } = await supabase
    .from("action_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action_type", "biography_validate")
    .gte("created_at", windowStart)

  if (error) {
    const msg = (error as any)?.message || ""
    const hint = msg.toLowerCase()

    // Если нет доступа к action_logs (RLS) — не блокируем работу.
    if (hint.includes("permission") || hint.includes("rls")) {
      return { allowed: true as const }
    }

    throw new Error("Не удалось проверить лимит запросов")
  }

  const effective = typeof count === "number" ? count : 0
  if (effective >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false as const }
  }

  return { allowed: true as const }
}

export async function POST(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    if (!isAllowedRole(currentUser.role)) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
    }

    const limit = await rateLimitValidateBiography(currentUser.id)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Слишком много проверок. Попробуйте позже." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const biographyText = String(body?.biographyText || "")
    const debug = Boolean(body?.debug)
    const apiKeyFromBody = typeof body?.apiKey === "string" ? body.apiKey : null
    const requestedModel = String(body?.model || "llama-3.3-70b-versatile")
    const allowedModels: GroqBiographyModel[] = ["llama-3.3-70b-versatile", "openai/gpt-oss-120b"]

    if (!allowedModels.includes(requestedModel as GroqBiographyModel)) {
      return NextResponse.json(
        { error: "Неподдерживаемая модель", model: requestedModel },
        { status: 400 }
      )
    }

    const model = requestedModel as GroqBiographyModel

    let apiKey: string | undefined = undefined
    if (apiKeyFromBody && apiKeyFromBody.trim().length) {
      const trimmed = apiKeyFromBody.trim()
      if (trimmed.length > 200) {
        return NextResponse.json({ error: "API ключ слишком длинный" }, { status: 400 })
      }
      // Basic shape check (do not enforce too hard)
      if (!/^gsk_[A-Za-z0-9_\-]{10,}$/.test(trimmed)) {
        return NextResponse.json({ error: "Неверный формат API ключа" }, { status: 400 })
      }
      apiKey = trimmed
    }

    if (biographyText.trim().length < MIN_CHARS) {
      return NextResponse.json(
        { error: `Минимум ${MIN_CHARS} символов` },
        { status: 400 }
      )
    }

    if (biographyText.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `Максимум ${MAX_CHARS} символов` },
        { status: 400 }
      )
    }

    const currentDateISO = new Date().toISOString()

    const normalized = normalizeBiographyTo13Sections(biographyText)

    let result
    try {
      result = await validateBiographyWithGroq({
        biographyText: normalized.normalizedText,
        currentDateISO,
        model,
        apiKey,
      })
    } catch (e: any) {
      const message =
        e?.error?.message ||
        e?.message ||
        "Ошибка Groq API"

      const code = e?.error?.code || e?.code
      const type = e?.error?.type || e?.type

      // Groq invalid_request_error (например, decommissioned model) — это 400
      if (type === "invalid_request_error" || code === "model_decommissioned") {
        return NextResponse.json(
          { error: message, code, type },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: message, code, type },
        { status: 502 }
      )
    }

    try {
      const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
      const user_agent = request.headers.get("user-agent")

      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: "Проверка RP биографии (AI)",
          action_type: "biography_validate",
          target_type: "system",
          details: `score=${result?.score}; valid=${result?.valid}`,
          metadata: {
            model,
            score: result?.score,
            valid: result?.valid,
            birthdate: result?.birthdate,
            structure: result?.structure,
            perspective: result?.perspective,
          },
          ip_address,
          user_agent,
        },
      ])
    } catch {
      // ignore
    }

    // Merge deterministic structure info derived from normalization
    result.structure = {
      ...result.structure,
      totalSections: 13,
      allSectionsPresent: normalized.missingSections.length === 0 && normalized.emptySections.length === 0,
      missingSections: normalized.missingSections,
      emptySections: normalized.emptySections,
      status: normalized.missingSections.length > 0 || normalized.emptySections.length > 0 ? "error" : "success",
    }

    if (debug) {
      ;(result as any).debug = {
        model,
        normalizedText: normalized.normalizedText,
        normalization: {
          missingSections: normalized.missingSections,
          emptySections: normalized.emptySections,
        },
      }
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при проверке биографии" },
      { status: 500 }
    )
  }
}
