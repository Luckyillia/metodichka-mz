import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function getUserFromHeaders(request: Request) {
    const userId   = request.headers.get("x-user-id")
    const role     = request.headers.get("x-user-role")
    const username = request.headers.get("x-user-username")
    const gameNick = request.headers.get("x-user-game-nick")

    if (!userId || !role || !username || !gameNick) {
        console.log("[Action Logs API] Missing user headers:", { userId, role, username, gameNick })
        return null
    }

    return {
        id: userId,
        role: role as "root" | "admin" | "ld" | "cc" | "instructor" | "user",
        username,
        game_nick: gameNick,
    }
}

// GET — Получить логи действий
export async function GET(request: Request) {
    try {
        const currentUser = getUserFromHeaders(request)
        if (!currentUser) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        if (!["admin", "root", "ld"].includes(currentUser.role)) {
            return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)

        const limit      = Math.min(parseInt(searchParams.get("limit")  || "100"), 2000)
        const offset     = Math.max(parseInt(searchParams.get("offset") || "0"), 0)
        const actionType = searchParams.get("action_type")
        const targetType = searchParams.get("target_type")
        const userId     = searchParams.get("user_id")
        // ── НОВЫЕ ФИЛЬТРЫ ──────────────────────────────────────────────────
        const search      = searchParams.get("search")?.trim().toLowerCase()
        const performedBy = searchParams.get("performed_by")?.trim().toLowerCase()
        const dateFrom    = searchParams.get("date_from")   // формат YYYY-MM-DD
        const dateTo      = searchParams.get("date_to")     // формат YYYY-MM-DD

        let query = supabase
            .from("action_logs")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })

        // ── Серверные фильтры (выполняются в Supabase) ──────────────────────
        if (actionType) query = query.eq("action_type", actionType)
        if (targetType) query = query.eq("target_type", targetType)
        if (userId)     query = query.eq("user_id", userId)

        // Фильтр по нику: ilike = регистронезависимый LIKE в Supabase
        if (performedBy) {
            query = query.ilike("game_nick", `%${performedBy}%`)
        }

        // Фильтр по дате
        if (dateFrom) {
            query = query.gte("created_at", `${dateFrom}T00:00:00.000Z`)
        }
        if (dateTo) {
            query = query.lte("created_at", `${dateTo}T23:59:59.999Z`)
        }

        // Поиск по тексту действия (ilike по полю action)
        if (search) {
            // Ищем одновременно в action и game_nick через or
            query = query.or(`action.ilike.%${search}%,game_nick.ilike.%${search}%`)
        }

        // Пагинация — после всех фильтров
        query = query.range(offset, offset + limit - 1)

        const { data: logs, error, count } = await query

        if (error) {
            console.error("[Action Logs API] Supabase error:", error)
            return NextResponse.json({ error: "Не удалось получить логи" }, { status: 500 })
        }

        return NextResponse.json({ logs: logs || [], total: count || 0 })
    } catch (error) {
        console.error("[Action Logs API] Error fetching logs:", error)
        return NextResponse.json({ error: "Ошибка при получении логов" }, { status: 500 })
    }
}

// POST — Создать запись в логах
export async function POST(request: Request) {
    try {
        const currentUser = getUserFromHeaders(request)
        if (!currentUser) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        const body = await request.json()
        const { action, action_type, target_type, target_id, target_name, details, metadata } = body

        if (!action || !action_type) {
            return NextResponse.json(
                { error: "Поля action и action_type обязательны" },
                { status: 400 }
            )
        }

        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        const { data: newLog, error } = await supabase
            .from("action_logs")
            .insert([{
                user_id: currentUser.id,
                game_nick: currentUser.game_nick,
                action,
                action_type,
                target_type,
                target_id,
                target_name,
                details,
                metadata,
                ip_address,
                user_agent,
            }])
            .select()
            .single()

        if (error) {
            console.error("[Action Logs API] Supabase error:", error)
            return NextResponse.json({ error: "Не удалось создать запись в логе" }, { status: 500 })
        }

        return NextResponse.json(newLog, { status: 201 })
    } catch (error) {
        console.error("[Action Logs API] Error creating log:", error)
        return NextResponse.json({ error: "Ошибка при создании записи в логе" }, { status: 500 })
    }
}