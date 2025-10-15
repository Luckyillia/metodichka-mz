// app/api/users/route.ts
import { NextResponse } from "next/server"
import { supabase, validateGameNick } from "@/lib/supabase"
import bcrypt from "bcryptjs"

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")

  if (!userId || !role || !username || !gameNick) {
    console.log('[Users API] Missing user headers:', { userId, role, username, gameNick })
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "user",
    username: username,
    game_nick: gameNick,
  }
}

// GET - Fetch users (admin видит только активных, root видит всех)
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    console.log("[Users API] Fetching users, requested by:", currentUser.username, "role:", currentUser.role)

    let query = supabase
        .from("users")
        .select("id, username, game_nick, role, active, created_at")
        .order("created_at", { ascending: false })

    // Admin видит только активных пользователей
    if (currentUser.role === "admin") {
      query = query.eq("active", true)
      console.log("[Users API] Admin filter: active users only")
    }
    // Root видит всех пользователей

    const { data: users, error } = await query

    if (error) {
      console.error("[Users API] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    console.log("[Users API] Fetched users, count:", users?.length || 0)
    return NextResponse.json(users || [])
  } catch (error) {
    console.error("[Users API] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { username, gameNick, password, role } = body

    console.log("[Users API] Creating user:", username, "by:", currentUser.username)

    if (!username || !gameNick || !password || !role) {
      return NextResponse.json({ error: "Все поля обязательны для заполнения" }, { status: 400 })
    }

    if (currentUser.role === "admin" && (role === "admin" || role === "root")) {
      return NextResponse.json(
          { error: "Администраторы могут создавать только пользователей с ролями 'user', 'cc' и 'ld'" },
          { status: 403 }
      )
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

    // Проверка только среди активных пользователей
    const { data: existingUsername } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .eq("active", true)
        .single()

    if (existingUsername) {
      return NextResponse.json({ error: "Имя пользователя уже существует" }, { status: 400 })
    }

    const { data: existingGameNick } = await supabase
        .from("users")
        .select("id")
        .eq("game_nick", gameNick)
        .eq("active", true)
        .single()

    if (existingGameNick) {
      return NextResponse.json({ error: "Игровой ник уже занят" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error } = await supabase
        .from("users")
        .insert([
          {
            username,
            game_nick: gameNick,
            password: hashedPassword,
            role,
            active: true,
          },
        ])
        .select("id, username, game_nick, role, active, created_at")
        .single()

    if (error) {
      console.error("[Users API] Supabase error:", error)
      return NextResponse.json(
          { error: "Не удалось создать пользователя", details: error.message },
          { status: 500 }
      )
    }

    console.log("[Users API] User created successfully:", username)

    // Логируем создание с сохранением состояния
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Создан новый пользователь: ${gameNick}`,
          action_type: "create",
          target_type: "user",
          target_id: newUser.id,
          target_name: gameNick,
          details: `Создан пользователь с логином "${username}" и ролью "${role}"`,
          new_state: {
            id: newUser.id,
            username,
            game_nick: gameNick,
            role,
            active: true,
          },
          metadata: {
            username,
            game_nick: gameNick,
            role,
            created_by: currentUser.game_nick,
          },
        },
      ])
    } catch (logError) {
      console.error("[Users API] Failed to log action:", logError)
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("[Users API] Error creating user:", error)
    return NextResponse.json({ error: "Ошибка при создании пользователя" }, { status: 500 })
  }
}

// PUT - Update user
export async function PUT(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, username, gameNick, password } = body

    console.log("[Users API] Updating user:", userId, "by:", currentUser.username)

    if (!userId || !username || !gameNick) {
      return NextResponse.json({ error: "ID, имя пользователя и игровой ник обязательны" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("role, username, game_nick, active")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (existingUser.role === "root" && currentUser.id !== userId) {
      return NextResponse.json({ error: "Нельзя редактировать root пользователя" }, { status: 403 })
    }

    // Администратор может редактировать свой профиль, но не других администраторов
    if (currentUser.role === "admin" && existingUser.role === "admin" && currentUser.id !== userId) {
      return NextResponse.json(
          { error: "Администраторы не могут редактировать других администраторов" },
          { status: 403 }
      )
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({ error: "Имя пользователя должно быть от 3 до 50 символов" }, { status: 400 })
    }

    const nickValidation = validateGameNick(gameNick)
    if (!nickValidation.valid) {
      return NextResponse.json({ error: nickValidation.error }, { status: 400 })
    }

    // Проверка уникальности среди активных
    if (username !== existingUser.username) {
      const { data: existingUsername } = await supabase
          .from("users")
          .select("id")
          .eq("username", username)
          .eq("active", true)
          .neq("id", userId)
          .single()

      if (existingUsername) {
        return NextResponse.json({ error: "Имя пользователя уже существует" }, { status: 400 })
      }
    }

    if (gameNick !== existingUser.game_nick) {
      const { data: existingGameNick } = await supabase
          .from("users")
          .select("id")
          .eq("game_nick", gameNick)
          .eq("active", true)
          .neq("id", userId)
          .single()

      if (existingGameNick) {
        return NextResponse.json({ error: "Игровой ник уже занят" }, { status: 400 })
      }
    }

    const updateData: any = {
      username,
      game_nick: gameNick,
    }

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select("id, username, game_nick, role, active, created_at")
        .single()

    if (updateError) {
      console.error("[Users API] Supabase error:", updateError)
      return NextResponse.json({ error: "Не удалось обновить пользователя" }, { status: 500 })
    }

    console.log("[Users API] User updated successfully")

    // Логируем с сохранением состояний
    try {
      const changes = []
      if (username !== existingUser.username) changes.push("username")
      if (gameNick !== existingUser.game_nick) changes.push("game_nick")
      if (password && password.trim() !== "") changes.push("password")

      const changeDetails = changes.map((field) => {
        if (field === "username") return `логин изменен с "${existingUser.username}" на "${username}"`
        if (field === "game_nick") return `игровой ник изменен с "${existingUser.game_nick}" на "${gameNick}"`
        if (field === "password") return "пароль изменен"
        return field
      }).join(", ")

      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Обновлена информация пользователя: ${updatedUser.game_nick}`,
          action_type: "update",
          target_type: "user",
          target_id: userId,
          target_name: updatedUser.game_nick,
          details: `Изменено: ${changeDetails}`,
          previous_state: {
            username: existingUser.username,
            game_nick: existingUser.game_nick,
          },
          new_state: {
            username: updatedUser.username,
            game_nick: updatedUser.game_nick,
          },
          metadata: {
            changes,
            password_changed: changes.includes("password"),
            updated_by: currentUser.game_nick,
          },
        },
      ])
    } catch (logError) {
      console.error("[Users API] Failed to log user update:", logError)
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[Users API] Error updating user:", error)
    return NextResponse.json({ error: "Ошибка при обновлении пользователя" }, { status: 500 })
  }
}

// PATCH - Update user role or restore user
export async function PATCH(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role, action } = body

    // Обработка восстановления пользователя
    if (action === "restore") {
      console.log("[Users API] Restoring user:", userId, "by:", currentUser.username)

      if (!userId) {
        return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
      }

      const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id, username, game_nick, role, active")
          .eq("id", userId)
          .single()

      if (fetchError || !existingUser) {
        return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
      }

      if (existingUser.active) {
        return NextResponse.json({ error: "Пользователь уже активен" }, { status: 400 })
      }

      const { data: restoredUser, error: restoreError } = await supabase
          .from("users")
          .update({ active: true })
          .eq("id", userId)
          .select("id, username, game_nick, role, active, created_at")
          .single()

      if (restoreError) {
        console.error("[Users API] Restore error:", restoreError)
        return NextResponse.json({ error: "Не удалось восстановить пользователя" }, { status: 500 })
      }

      // Логируем восстановление
      try {
        await supabase.from("action_logs").insert([
          {
            user_id: currentUser.id,
            game_nick: currentUser.game_nick,
            action: `Восстановлен пользователь: ${restoredUser.game_nick}`,
            action_type: "restore",
            target_type: "user",
            target_id: userId,
            target_name: restoredUser.game_nick,
            details: `Пользователь с логином "${restoredUser.username}" восстановлен`,
            previous_state: { active: false },
            new_state: { active: true },
            metadata: {
              restored_by: currentUser.game_nick,
              username: restoredUser.username,
            },
          },
        ])
      } catch (logError) {
        console.error("[Users API] Failed to log restore:", logError)
      }

      return NextResponse.json(restoredUser)
    }

    // Обработка изменения роли
    console.log("[Users API] Updating user role:", userId, "to", role, "by:", currentUser.username)

    if (!userId || !role) {
      return NextResponse.json({ error: "ID пользователя и роль обязательны" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("role, username, game_nick, active")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя изменить роль root пользователя" }, { status: 403 })
    }

    // Нельзя менять свою собственную роль
    if (currentUser.id === userId) {
      return NextResponse.json(
          { error: "Нельзя изменить свою собственную роль" },
          { status: 403 }
      )
    }

    if (currentUser.role === "admin") {
      if (existingUser.role === "admin") {
        return NextResponse.json(
            { error: "Администраторы не могут изменять роль других администраторов" },
            { status: 403 }
        )
      }

      if (role === "admin" || role === "root") {
        return NextResponse.json(
            { error: "Администраторы могут назначать только роли 'user', 'cc' и 'ld'" },
            { status: 403 }
        )
      }
    }

    const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ role })
        .eq("id", userId)
        .select("id, username, game_nick, role, active, created_at")
        .single()

    if (updateError) {
      console.error("[Users API] Supabase error:", updateError)
      return NextResponse.json({ error: "Не удалось обновить роль" }, { status: 500 })
    }

    console.log("[Users API] User role updated successfully")

    // Логируем изменение роли
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Изменена роль пользователя: ${updatedUser.game_nick}`,
          action_type: "role_change",
          target_type: "user",
          target_id: userId,
          target_name: updatedUser.game_nick,
          details: `Роль изменена с "${existingUser.role}" на "${role}"`,
          previous_state: { role: existingUser.role },
          new_state: { role },
          metadata: {
            changed_by: currentUser.game_nick,
            username: updatedUser.username,
          },
        },
      ])
    } catch (logError) {
      console.error("[Users API] Failed to log role change:", logError)
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[Users API] Error in PATCH:", error)
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 })
  }
}

// DELETE - Soft delete user (деактивация)
export async function DELETE(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    console.log("[Users API] Deactivating user:", userId, "by:", currentUser.username)

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, role, username, game_nick, active")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя деактивировать root пользователя" }, { status: 403 })
    }

    // Нельзя деактивировать самого себя
    if (currentUser.id === userId) {
      return NextResponse.json(
          { error: "Нельзя деактивировать самого себя" },
          { status: 403 }
      )
    }

    if (currentUser.role === "admin" && existingUser.role === "admin") {
      return NextResponse.json(
          { error: "Администраторы не могут деактивировать других администраторов" },
          { status: 403 }
      )
    }

    if (!existingUser.active) {
      return NextResponse.json({ error: "Пользователь уже деактивирован" }, { status: 400 })
    }

    // Soft delete - устанавливаем active = false
    const { error: deactivateError } = await supabase
        .from("users")
        .update({ active: false })
        .eq("id", userId)

    if (deactivateError) {
      console.error("[Users API] Deactivate error:", deactivateError)
      return NextResponse.json({ error: "Не удалось деактивировать пользователя" }, { status: 500 })
    }

    console.log("[Users API] User deactivated successfully")

    // Логируем деактивацию с сохранением состояния
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Деактивирован пользователь: ${existingUser.game_nick}`,
          action_type: "deactivate",
          target_type: "user",
          target_id: userId,
          target_name: existingUser.game_nick,
          details: `Деактивирован пользователь с логином "${existingUser.username}" и ролью "${existingUser.role}"`,
          previous_state: {
            active: true,
            username: existingUser.username,
            game_nick: existingUser.game_nick,
            role: existingUser.role,
          },
          new_state: {
            active: false,
            username: existingUser.username,
            game_nick: existingUser.game_nick,
            role: existingUser.role,
          },
          metadata: {
            deactivated_by: currentUser.game_nick,
          },
        },
      ])
    } catch (logError) {
      console.error("[Users API] Failed to log deactivation:", logError)
    }

    return NextResponse.json({ message: "Пользователь деактивирован", userId })
  } catch (error) {
    console.error("[Users API] Error deactivating user:", error)
    return NextResponse.json({ error: "Ошибка при деактивации пользователя" }, { status: 500 })
  }
}