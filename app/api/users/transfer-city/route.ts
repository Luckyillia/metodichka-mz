import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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
    role: role as "root" | "admin" | "ld" | "cc" | "instructor" | "user",
    username: username,
    game_nick: gameNick,
    city: (city || 'CGB-N') as "CGB-N" | "CGB-P" | "OKB-M",
  }
}

// POST - Перемещение игрока в другой город (НЕОБРАТИМОЕ действие для LD)
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, newCity } = body

    console.log("[Transfer City API] Transferring user:", userId, "to city:", newCity, "by:", currentUser.username)

    if (!userId || !newCity) {
      return NextResponse.json({ error: "ID пользователя и новый город обязательны" }, { status: 400 })
    }

    // Валидация города
    const validCities = ['CGB-N', 'CGB-P', 'OKB-M']
    if (!validCities.includes(newCity)) {
      return NextResponse.json({ error: "Некорректный город" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("role, username, game_nick, status, city")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Нельзя перемещать root
    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя переместить root пользователя" }, { status: 403 })
    }

    // Проверка прав доступа
    if (currentUser.role === "ld") {
      // Лидер может перемещать только user и cc из СВОЕГО города
      if (existingUser.city !== currentUser.city) {
        return NextResponse.json({ 
          error: "Лидер может перемещать только игроков из своего города" 
        }, { status: 403 })
      }
      
      if (existingUser.role !== "user" && existingUser.role !== "cc") {
        return NextResponse.json({ 
          error: "Лидер может перемещать только игроков с ролями User и CC" 
        }, { status: 403 })
      }

      // Проверка, что это не тот же город
      if (existingUser.city === newCity) {
        return NextResponse.json({ 
          error: "Игрок уже находится в этом городе" 
        }, { status: 400 })
      }
    } else if (currentUser.role === "admin") {
      // Admin может перемещать user, cc, ld
      if (existingUser.role === "admin" || existingUser.role === "root") {
        return NextResponse.json({ 
          error: "Администратор не может перемещать администраторов и root" 
        }, { status: 403 })
      }
    }
    // Root может перемещать всех (кроме root)

    // Выполняем перемещение
    const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ city: newCity })
        .eq("id", userId)
        .select("id, username, game_nick, role, status, city, created_at")
        .single()

    if (updateError) {
      console.error("[Transfer City API] Update error:", updateError)
      return NextResponse.json({ error: "Не удалось переместить игрока" }, { status: 500 })
    }

    console.log("[Transfer City API] User transferred successfully")

    // Логируем перемещение
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Перемещен игрок в другой город: ${updatedUser.game_nick}`,
          action_type: "update",
          target_type: "user",
          target_id: userId,
          target_name: updatedUser.game_nick,
          details: `Игрок перемещен из "${existingUser.city}" в "${newCity}"${currentUser.role === "ld" ? " (НЕОБРАТИМОЕ действие)" : ""}`,
          previous_state: { city: existingUser.city },
          new_state: { city: newCity },
          metadata: {
            transferred_by: currentUser.game_nick,
            transferred_by_role: currentUser.role,
            username: updatedUser.username,
            irreversible: currentUser.role === "ld",
          },
        },
      ])
    } catch (logError) {
      console.error("[Transfer City API] Failed to log transfer:", logError)
    }

    return NextResponse.json({
      message: `Игрок ${updatedUser.game_nick} успешно перемещен в ${newCity}${currentUser.role === "ld" ? ". Это действие необратимо." : ""}`,
      user: updatedUser
    })
  } catch (error) {
    console.error("[Transfer City API] Error:", error)
    return NextResponse.json({ error: "Ошибка при перемещении игрока" }, { status: 500 })
  }
}