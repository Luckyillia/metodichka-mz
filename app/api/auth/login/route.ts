import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log("[Login API] Login attempt for username:", username)

    // Валидация
    if (!username || !password) {
      return NextResponse.json(
          { error: "Имя пользователя и пароль обязательны" },
          { status: 400 }
      )
    }

    // Ищем пользователя в Supabase
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if (fetchError || !user) {
      console.log("[Login API] User not found:", username)

      // Логируем неудачную попытку входа (пользователь не найден)
      try {
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        await supabase.from("action_logs").insert([
          {
            user_id: null,
            game_nick: "Unknown",
            action: `Неудачная попытка входа: пользователь "${username}" не найден`,
            action_type: "login",
            target_type: "system",
            details: `Попытка входа с несуществующим именем пользователя`,
            metadata: {
              username,
              reason: "user_not_found",
            },
            ip_address,
            user_agent,
          },
        ])
      } catch (logError) {
        console.error("[Login API] Failed to log failed attempt:", logError)
      }

      return NextResponse.json(
          { error: "Неверное имя пользователя или пароль" },
          { status: 401 }
      )
    }

    // Проверяем пароль с помощью bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("[Login API] Invalid password for user:", username)

      // Логируем неудачную попытку входа (неверный пароль)
      try {
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        await supabase.from("action_logs").insert([
          {
            user_id: user.id,
            game_nick: user.game_nick,
            action: `Неудачная попытка входа: неверный пароль`,
            action_type: "login",
            target_type: "system",
            details: `Введен неверный пароль для пользователя "${username}"`,
            metadata: {
              username,
              reason: "invalid_password",
            },
            ip_address,
            user_agent,
          },
        ])
      } catch (logError) {
        console.error("[Login API] Failed to log failed attempt:", logError)
      }

      return NextResponse.json(
          { error: "Неверное имя пользователя или пароль" },
          { status: 401 }
      )
    }

    // Возвращаем пользователя БЕЗ пароля
    const { password: _, ...safeUser } = user
    console.log("[v0] Login API: Login successful for user:", safeUser.username)

    // Логируем вход для admin и root
    if (user.role === "admin" || user.role === "root") {
      try {
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        await supabase.from("action_logs").insert([
          {
            user_id: user.id,
            game_nick: user.game_nick,
            action: "Вход в систему",
            action_type: "login",
            target_type: "system",
            ip_address,
            user_agent,
          },
        ])
      } catch (logError) {
        console.error("[v0] Login API: Failed to log action:", logError)
      }
    }

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("[Login API] Error:", error)
    return NextResponse.json(
        { error: "Ошибка при входе в систему" },
        { status: 500 }
    )
  }
}