import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")
  const city = request.headers.get("x-user-city")

  if (!userId || !role || !username || !gameNick) {
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "user",
    username,
    game_nick: gameNick,
    city: (city || "CGB-N") as "CGB-N" | "CGB-P" | "OKB-M",
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const {
      username,
      gameNick,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = body as {
      username?: string
      gameNick?: string
      currentPassword?: string
      newPassword?: string
      confirmNewPassword?: string
    }

    if (!currentPassword) {
      return NextResponse.json({ error: "Текущий пароль обязателен" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, username, game_nick, password")
      .eq("id", currentUser.id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    const passwordOk = await bcrypt.compare(currentPassword, existingUser.password)
    if (!passwordOk) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 403 })
    }

    const updateData: any = {}

    if (typeof username === "string" && username.trim() !== "") {
      if (username.length < 3 || username.length > 50) {
        return NextResponse.json({ error: "Логин должен быть от 3 до 50 символов" }, { status: 400 })
      }
      updateData.username = username
    }

    if (typeof gameNick === "string" && gameNick.trim() !== "") {
      if (gameNick.length < 5 || gameNick.length > 50) {
        return NextResponse.json({ error: "Ник должен быть от 5 до 50 символов" }, { status: 400 })
      }
      updateData.game_nick = gameNick
    }

    if (newPassword || confirmNewPassword) {
      if (!newPassword || !confirmNewPassword) {
        return NextResponse.json({ error: "Новый пароль и подтверждение обязательны" }, { status: 400 })
      }

      if (newPassword !== confirmNewPassword) {
        return NextResponse.json({ error: "Новые пароли не совпадают" }, { status: 400 })
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 })
    }

    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", currentUser.id)
      .select("id, username, game_nick, role, status, city, created_at, avatar_url, avatar_public_id, avatar_uploaded_at, avatar_moderation_status")
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Не удалось обновить профиль" }, { status: 500 })
    }

    return NextResponse.json({ user: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при обновлении профиля" },
      { status: 500 }
    )
  }
}
