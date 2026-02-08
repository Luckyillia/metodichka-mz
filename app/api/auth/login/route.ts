import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import CryptoJS from "crypto-js"
import { AUTH_SIGNING_KEY } from "@/lib/auth/constants"

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
        .maybeSingle()

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

      // ОБЩЕЕ СООБЩЕНИЕ - не раскрываем, существует ли аккаунт
      return NextResponse.json(
          { error: "Неверное имя пользователя или пароль" },
          { status: 401 }
      )
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log("[Login API] Password validation result:", isPasswordValid, "for user:", username)

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

      // ОБЩЕЕ СООБЩЕНИЕ - не раскрываем, что пользователь существует
      return NextResponse.json(
          { error: "Неверное имя пользователя или пароль" },
          { status: 401 }
      )
    }

    // ПАРОЛЬ ВЕРНЫЙ - теперь проверяем статус и показываем конкретные сообщения
    
    // Проверка: аккаунт деактивирован
    if (user.status === "inactive") {
      console.log("[Login API] Account is deactivated:", username)

      // Логируем попытку входа в деактивированный аккаунт
      try {
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        await supabase.from("action_logs").insert([
          {
            user_id: user.id,
            game_nick: user.game_nick,
            action: `Попытка входа в деактивированный аккаунт`,
            action_type: "login",
            target_type: "system",
            details: `Пользователь "${username}" пытался войти с правильным паролем, но аккаунт деактивирован`,
            metadata: {
              username,
              reason: "account_deactivated",
              password_correct: true,
            },
            ip_address,
            user_agent,
          },
        ])
      } catch (logError) {
        console.error("[Login API] Failed to log deactivated login attempt:", logError)
      }

      // КОНКРЕТНОЕ СООБЩЕНИЕ - пользователь подтвердил владение аккаунтом
      return NextResponse.json(
          { 
            error: "Ваш аккаунт деактивирован. Обратитесь к администратору для восстановления доступа.",
            errorType: "deactivated" // Для фронтенда, чтобы показать дополнительную информацию
          },
          { status: 403 }
      )
    }

    // Проверка: запрос на аккаунт не одобрен
    if (user.status === "request") {
      console.log("[Login API] Account request pending:", username)

      // Логируем попытку входа в незавершенный запрос
      try {
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        await supabase.from("action_logs").insert([
          {
            user_id: user.id,
            game_nick: user.game_nick,
            action: `Попытка входа в незавершенный запрос`,
            action_type: "login",
            target_type: "system",
            details: `Пользователь "${username}" пытался войти с правильным паролем, но запрос еще не одобрен`,
            metadata: {
              username,
              reason: "account_request_pending",
              password_correct: true,
            },
            ip_address,
            user_agent,
          },
        ])
      } catch (logError) {
        console.error("[Login API] Failed to log request login attempt:", logError)
      }

      // КОНКРЕТНОЕ СООБЩЕНИЕ - пользователь подтвердил владение аккаунтом
      return NextResponse.json(
          { 
            error: "Ваш запрос на создание аккаунта еще не одобрен. Дождитесь подтверждения администратора.",
            errorType: "pending" // Для фронтенда
          },
          { status: 403 }
      )
    }

    // ВСЁ ХОРОШО - разрешаем вход
    const { password: _, ...safeUser } = user
    console.log("[Login API] Login successful for user:", safeUser.username)

    if (!AUTH_SIGNING_KEY) {
      console.error("[Login API] AUTH_SIGNING_KEY is not set")
      return NextResponse.json(
        { error: "Сервер не настроен: отсутствует AUTH_SIGNING_KEY" },
        { status: 500 }
      )
    }

    const loginTimestamp = Date.now()
    const signatureData = `${safeUser.id}:${safeUser.username}:${safeUser.role}:${safeUser.game_nick}`
    const signature = CryptoJS.HmacSHA256(signatureData, AUTH_SIGNING_KEY).toString()

    const tokenData = {
      ...safeUser,
      loginTimestamp,
      timestamp: loginTimestamp,
      signature,
    }

    const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")

    // Логируем успешный вход для admin, root и ld
    if (user.role === "admin" || user.role === "root" || user.role === "ld") {
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
        console.error("[Login API] Failed to log action:", logError)
      }
    }

    return NextResponse.json({ user: safeUser, token })
  } catch (error) {
    console.error("[Login API] Error:", error)
    return NextResponse.json(
        { error: "Ошибка при входе в систему" },
        { status: 500 }
    )
  }
}