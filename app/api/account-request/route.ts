// app/api/account-request/route.ts
import { NextResponse } from "next/server"
import { supabase, validateGameNick } from "@/lib/supabase"
import bcrypt from "bcryptjs"

// Helper to get client IP
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return "unknown"
}

// POST - Create account request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, gameNick, password, role = "user", city = "CGB-N" } = body
    const clientIP = getClientIP(request)

    console.log("[Account Request API] New account request:", username, "IP:", clientIP)
    console.log("[Account Request API] Headers:", {
      forwarded: request.headers.get("x-forwarded-for"),
      realIP: request.headers.get("x-real-ip"),
    })

    if (!username || !gameNick || !password) {
      return NextResponse.json({ error: "Все поля обязательны для заполнения" }, { status: 400 })
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({ error: "Имя пользователя должно быть от 3 до 50 символов" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 })
    }

    const nickValidation = validateGameNick(gameNick)
    if (!nickValidation.valid) {
      return NextResponse.json({ error: nickValidation.error }, { status: 400 })
    }

    // Валидация роли
    if (!["user", "cc", "ld"].includes(role)) {
      return NextResponse.json({ error: "Недопустимая роль" }, { status: 400 })
    }

    // Валидация города
    if (!["CGB-N", "CGB-P", "OKB-M"].includes(city)) {
      return NextResponse.json({ error: "Недопустимый город" }, { status: 400 })
    }

    console.log("[Account Request API] Checking for existing requests from IP:", clientIP)
    
    const { data: existingIPRequests, error: ipCheckError } = await supabase
      .from("users")
      .select("id, username, game_nick, status, created_at, ip_address")
      .eq("ip_address", clientIP)
      .in("status", ["request", "active", "inactive"])
      .order("created_at", { ascending: false })
      .limit(1)

    if (ipCheckError) {
      console.error("[Account Request API] IP check error:", ipCheckError)
    }

    console.log("[Account Request API] Found existing requests:", existingIPRequests?.length || 0)

    if (existingIPRequests && existingIPRequests.length > 0) {
      const existingIPRequest = existingIPRequests[0]
      console.log("[Account Request API] Blocking duplicate request:", existingIPRequest)
      
      if (existingIPRequest.status === "request") {
        return NextResponse.json({ 
          error: `Вы уже отправили запрос на создание аккаунта (${existingIPRequest.game_nick}). Дождитесь одобрения администратора.` 
        }, { status: 400 })
      }
      if (existingIPRequest.status === "active") {
        return NextResponse.json({ 
          error: `С вашего IP уже создан активный аккаунт (${existingIPRequest.game_nick}). Если это не вы, обратитесь к администратору.` 
        }, { status: 400 })
      }
      if (existingIPRequest.status === "inactive") {
        return NextResponse.json({ 
          error: `Ваш аккаунт (${existingIPRequest.game_nick}) был деактивирован. Обратитесь к администратору для восстановления доступа. Создание нового аккаунта невозможно.` 
        }, { status: 403 })
      }
    }

    // Проверка уникальности среди активных и запрошенных пользователей
    const { data: existingUsername } = await supabase
      .from("users")
      .select("id, status")
      .eq("username", username)
      .in("status", ["active", "request", "inactive"])
      .single()

    if (existingUsername) {
      if (existingUsername.status === "request") {
        return NextResponse.json({ error: "Запрос с таким логином уже существует и ожидает одобрения" }, { status: 400 })
      }
      if (existingUsername.status === "inactive") {
        return NextResponse.json({ error: "Аккаунт с таким логином деактивирован. Обратитесь к администратору для восстановления." }, { status: 403 })
      }
      return NextResponse.json({ error: "Имя пользователя уже существует" }, { status: 400 })
    }

    const { data: existingGameNick } = await supabase
      .from("users")
      .select("id, status")
      .eq("game_nick", gameNick)
      .in("status", ["active", "request", "inactive"])
      .single()

    if (existingGameNick) {
      if (existingGameNick.status === "request") {
        return NextResponse.json({ error: "Запрос с таким игровым ником уже существует и ожидает одобрения" }, { status: 400 })
      }
      if (existingGameNick.status === "inactive") {
        return NextResponse.json({ error: "Аккаунт с таким игровым ником деактивирован. Обратитесь к администратору для восстановления." }, { status: 403 })
      }
      return NextResponse.json({ error: "Игровой ник уже занят" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newRequest, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          game_nick: gameNick,
          password: hashedPassword,
          role,
          city,
          status: "request",
          ip_address: clientIP,
        },
      ])
      .select("id, username, game_nick, role, city, status, created_at")
      .single()

    if (error) {
      console.error("[Account Request API] Supabase error:", error)
      return NextResponse.json(
        { error: "Не удалось создать запрос на аккаунт", details: error.message },
        { status: 500 }
      )
    }

    console.log("[Account Request API] Account request created successfully:", username)

    // Логируем создание запроса
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: newRequest.id,
          game_nick: gameNick,
          action: `Создан запрос на аккаунт: ${gameNick}`,
          action_type: "create",
          target_type: "user",
          target_id: newRequest.id,
          target_name: gameNick,
          details: `Запрос на создание аккаунта с логином "${username}"`,
          new_state: {
            id: newRequest.id,
            username,
            game_nick: gameNick,
            role,
            city,
            status: "request",
          },
          metadata: {
            username,
            game_nick: gameNick,
            role,
            city,
            request_type: "account_creation",
          },
        },
      ])
    } catch (logError) {
      console.error("[Account Request API] Failed to log action:", logError)
    }

    return NextResponse.json({
      message: "Запрос на создание аккаунта отправлен. Ожидайте одобрения администратора.",
      requestId: newRequest.id
    }, { status: 201 })
  } catch (error) {
    console.error("[Account Request API] Error creating account request:", error)
    return NextResponse.json({ error: "Ошибка при создании запроса на аккаунт" }, { status: 500 })
  }
}
