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

    console.log("[Account Request API] Checking for existing accounts...")
    
    // ============================================
    // ПРОВЕРКА СУЩЕСТВУЮЩИХ АККАУНТОВ ПО IP
    // ============================================
    const { data: existingIPAccounts, error: ipCheckError } = await supabase
      .from("users")
      .select("id, username, game_nick, status, created_at, ip_address, password")
      .eq("ip_address", clientIP)
      .in("status", ["request", "active", "inactive"])
      .order("created_at", { ascending: false })

    if (ipCheckError) {
      console.error("[Account Request API] IP check error:", ipCheckError)
    }

    console.log("[Account Request API] Found accounts from this IP:", existingIPAccounts?.length || 0)

    if (existingIPAccounts && existingIPAccounts.length > 0) {
      const existingAccount = existingIPAccounts[0]
      
      // Проверяем пароль для деактивированных аккаунтов
      if (existingAccount.status === "inactive") {
        const isPasswordCorrect = await bcrypt.compare(password, existingAccount.password)
        const isUsernameMatch = existingAccount.username === username
        const isGameNickMatch = existingAccount.game_nick === gameNick
        
        // ВСЕ ДАННЫЕ ВЕРНЫ (логин, ник, пароль)
        if (isUsernameMatch && isGameNickMatch && isPasswordCorrect) {
          console.log("[Account Request API] All credentials match deactivated account")
          return NextResponse.json({ 
            error: `Ваш аккаунт "${existingAccount.game_nick}" был деактивирован. Обратитесь к администратору для восстановления доступа.`,
            errorType: "deactivated"
          }, { status: 403 })
        }
        
        // ТОЛЬКО ЛОГИН И ПАРОЛЬ ВЕРНЫ (ник другой)
        if (isUsernameMatch && isPasswordCorrect && !isGameNickMatch) {
          console.log("[Account Request API] Username and password match, but game nick is different")
          return NextResponse.json({ 
            error: `Аккаунт с логином "${username}" был деактивирован. Невозможно создать новый аккаунт с этим логином.`,
            errorType: "deactivated"
          }, { status: 403 })
        }
        
        // ТОЛЬКО НИК И ПАРОЛЬ ВЕРНЫ (логин другой)
        if (isGameNickMatch && isPasswordCorrect && !isUsernameMatch) {
          console.log("[Account Request API] Game nick and password match, but username is different")
          return NextResponse.json({ 
            error: `Аккаунт с игровым ником "${gameNick}" был деактивирован. Невозможно создать новый аккаунт с этим ником.`,
            errorType: "deactivated"
          }, { status: 403 })
        }
        
        // ТОЛЬКО ПАРОЛЬ ВЕРЕН (логин и ник другие)
        if (isPasswordCorrect && !isUsernameMatch && !isGameNickMatch) {
          console.log("[Account Request API] Only password matches deactivated account")
          return NextResponse.json({ 
            error: `С вашего IP уже был создан аккаунт, который был деактивирован. Обратитесь к администратору.`,
            errorType: "deactivated"
          }, { status: 403 })
        }
        
        // НИ ЛОГИН, НИ НИК, НИ ПАРОЛЬ НЕ СОВПАДАЮТ
        if (!isUsernameMatch && !isGameNickMatch && !isPasswordCorrect) {
          console.log("[Account Request API] No credentials match, but IP has deactivated account")
          return NextResponse.json({ 
            error: `С вашего IP ранее был создан аккаунт, который был деактивирован. Создание нового аккаунта невозможно. Обратитесь к администратору.`,
            errorType: "deactivated"
          }, { status: 403 })
        }
        
        // ТОЛЬКО ЛОГИН ИЛИ ТОЛЬКО НИК СОВПАДАЮТ (без правильного пароля)
        if ((isUsernameMatch || isGameNickMatch) && !isPasswordCorrect) {
          console.log("[Account Request API] Username or game nick matches, but password is incorrect")
          if (isUsernameMatch) {
            return NextResponse.json({ 
              error: `Логин "${username}" уже использовался ранее и аккаунт был деактивирован. Выберите другой логин.`,
              errorType: "duplicate"
            }, { status: 400 })
          } else {
            return NextResponse.json({ 
              error: `Игровой ник "${gameNick}" уже использовался ранее и аккаунт был деактивирован. Выберите другой ник.`,
              errorType: "duplicate"
            }, { status: 400 })
          }
        }
      }
      
      // АКТИВНЫЙ АККАУНТ
      if (existingAccount.status === "active") {
        console.log("[Account Request API] IP already has active account")
        return NextResponse.json({ 
          error: `С вашего IP уже создан активный аккаунт (${existingAccount.game_nick}). Если это не вы, обратитесь к администратору.`,
          errorType: "duplicate"
        }, { status: 400 })
      }
      
      // ОЖИДАЮЩИЙ ЗАПРОС
      if (existingAccount.status === "request") {
        console.log("[Account Request API] IP already has pending request")
        return NextResponse.json({ 
          error: `Вы уже отправили запрос на создание аккаунта (${existingAccount.game_nick}). Дождитесь одобрения администратора.`,
          errorType: "duplicate"
        }, { status: 400 })
      }
    }

    // ============================================
    // ПРОВЕРКА УНИКАЛЬНОСТИ ЛОГИНА
    // ============================================
    const { data: existingUsername } = await supabase
      .from("users")
      .select("id, status, game_nick")
      .eq("username", username)
      .in("status", ["active", "request", "inactive"])
      .single()

    if (existingUsername) {
      if (existingUsername.status === "request") {
        return NextResponse.json({ 
          error: `Запрос с логином "${username}" уже существует и ожидает одобрения.`,
          errorType: "duplicate"
        }, { status: 400 })
      }
      if (existingUsername.status === "inactive") {
        return NextResponse.json({ 
          error: `Логин "${username}" был использован в деактивированном аккаунте. Выберите другой логин.`,
          errorType: "duplicate"
        }, { status: 400 })
      }
      return NextResponse.json({ 
        error: `Логин "${username}" уже занят. Выберите другой логин.`,
        errorType: "duplicate"
      }, { status: 400 })
    }

    // ============================================
    // ПРОВЕРКА УНИКАЛЬНОСТИ ИГРОВОГО НИКА
    // ============================================
    const { data: existingGameNick } = await supabase
      .from("users")
      .select("id, status, username")
      .eq("game_nick", gameNick)
      .in("status", ["active", "request", "inactive"])
      .single()

    if (existingGameNick) {
      if (existingGameNick.status === "request") {
        return NextResponse.json({ 
          error: `Запрос с игровым ником "${gameNick}" уже существует и ожидает одобрения.`,
          errorType: "duplicate"
        }, { status: 400 })
      }
      if (existingGameNick.status === "inactive") {
        return NextResponse.json({ 
          error: `Игровой ник "${gameNick}" был использован в деактивированном аккаунте. Выберите другой ник.`,
          errorType: "duplicate"
        }, { status: 400 })
      }
      return NextResponse.json({ 
        error: `Игровой ник "${gameNick}" уже занят. Выберите другой ник.`,
        errorType: "duplicate"
      }, { status: 400 })
    }

    // ============================================
    // СОЗДАНИЕ НОВОГО ЗАПРОСА
    // ============================================
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