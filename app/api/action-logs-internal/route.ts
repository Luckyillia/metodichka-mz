import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Внутренний эндпоинт для логирования из middleware
// Не требует авторизации через middleware
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { user_id, game_nick, action, action_type, target_type, target_id, target_name, details, metadata, ip_address, user_agent } = body

        const logEntry = {
            user_id,
            game_nick,
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

        const { error } = await supabase
            .from("action_logs")
            .insert([logEntry])

        if (error) {
            console.error("[Action Logs Internal API] Supabase error:", error)
            return NextResponse.json(
                { error: "Не удалось создать запись в логе" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.error("[Action Logs Internal API] Error creating log:", error)
        return NextResponse.json({ error: "Ошибка при создании записи в логе" }, { status: 500 })
    }
}