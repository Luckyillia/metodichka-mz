import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Вспомогательная функция для получения данных пользователя из заголовков middleware
function getUserFromHeaders(request: Request) {
    const userId = request.headers.get("x-user-id")
    const role = request.headers.get("x-user-role")
    const username = request.headers.get("x-user-username")
    const gameNick = request.headers.get("x-user-game-nick")

    if (!userId || !role || !username || !gameNick) {
        console.log('[Action Logs API] Missing user headers:', { userId, role, username, gameNick })
        return null
    }

    return {
        id: userId,
        role: role as "root" | "admin" | "ld" | "cc" | "user",
        username: username,
        game_nick: gameNick,
    }
}

// GET - Получить логи действий
export async function GET(request: Request) {
    try {
        console.log("[Action Logs API] GET request received")

        const currentUser = getUserFromHeaders(request)
        if (!currentUser) {
            console.log("[Action Logs API] No user found in headers")
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        console.log("[Action Logs API] User found:", currentUser.game_nick, "Role:", currentUser.role)

        // Только admin, root и ld могут просматривать логи
        if (currentUser.role !== "admin" && currentUser.role !== "root" && currentUser.role !== "ld") {
            console.log("[Action Logs API] Insufficient permissions")
            return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "100")
        const offset = parseInt(searchParams.get("offset") || "0")
        const actionType = searchParams.get("action_type")
        const targetType = searchParams.get("target_type")
        const userId = searchParams.get("user_id")

        console.log("[Action Logs API] Fetching logs with params:", {
            limit,
            offset,
            actionType,
            targetType,
            userId,
        })

        let query = supabase
            .from("action_logs")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1)

        // Применяем фильтры
        if (actionType) {
            query = query.eq("action_type", actionType)
        }
        if (targetType) {
            query = query.eq("target_type", targetType)
        }
        if (userId) {
            query = query.eq("user_id", userId)
        }

        const { data: logs, error, count } = await query

        if (error) {
            console.error("[Action Logs API] Supabase error:", error)
            return NextResponse.json({ error: "Не удалось получить логи" }, { status: 500 })
        }

        console.log("[Action Logs API] Fetched logs successfully, count:", logs?.length || 0, "total:", count)
        return NextResponse.json({ logs: logs || [], total: count || 0 })
    } catch (error) {
        console.error("[Action Logs API] Error fetching logs:", error)
        return NextResponse.json({ error: "Ошибка при получении логов" }, { status: 500 })
    }
}

// POST - Создать запись в логах
export async function POST(request: Request) {
    try {
        const currentUser = getUserFromHeaders(request)

        if (!currentUser) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        const body = await request.json()
        const { action, action_type, target_type, target_id, target_name, details, metadata } = body

        console.log("[Action Logs API] Creating log entry by:", currentUser.game_nick)

        if (!action || !action_type) {
            return NextResponse.json(
                { error: "Поля action и action_type обязательны" },
                { status: 400 }
            )
        }

        // Получаем IP и User-Agent из заголовков
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        const logEntry = {
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
        }

        const { data: newLog, error } = await supabase
            .from("action_logs")
            .insert([logEntry])
            .select()
            .single()

        if (error) {
            console.error("[Action Logs API] Supabase error:", error)
            return NextResponse.json(
                { error: "Не удалось создать запись в логе" },
                { status: 500 }
            )
        }

        console.log("[Action Logs API] Log entry created successfully")
        return NextResponse.json(newLog, { status: 201 })
    } catch (error) {
        console.error("[Action Logs API] Error creating log:", error)
        return NextResponse.json({ error: "Ошибка при создании записи в логе" }, { status: 500 })
    }
}