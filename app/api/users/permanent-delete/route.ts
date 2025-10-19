// app/api/users/permanent-delete/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")

  if (!userId || !role || !username || !gameNick) {
    console.log('[Permanent Delete API] Missing user headers:', { userId, role, username, gameNick })
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "user",
    username: username,
    game_nick: gameNick,
  }
}

// DELETE - Permanently delete user (hard delete)
export async function DELETE(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Только root может окончательно удалять пользователей
    if (currentUser.role !== "root") {
      return NextResponse.json(
        { error: "Только root может окончательно удалять пользователей" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    console.log("[Permanent Delete API] Permanently deleting user:", userId, "by:", currentUser.username)

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, role, username, game_nick, status")
      .eq("id", userId)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя удалить root пользователя" }, { status: 403 })
    }

    // Нельзя удалить самого себя
    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: "Нельзя удалить самого себя" },
        { status: 403 }
      )
    }

    // Проверяем, что пользователь деактивирован или это запрос
    if (existingUser.status !== "inactive" && existingUser.status !== "request") {
      return NextResponse.json(
        { error: "Можно удалить только деактивированных пользователей или запросы. Сначала деактивируйте пользователя." },
        { status: 400 }
      )
    }

    // Hard delete - удаляем запись из БД
    const { error: deleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId)

    if (deleteError) {
      console.error("[Permanent Delete API] Delete error:", deleteError)
      return NextResponse.json({ error: "Не удалось удалить пользователя" }, { status: 500 })
    }

    console.log("[Permanent Delete API] User permanently deleted successfully")

    // Логируем окончательное удаление
    try {
      await supabaseAdmin.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Окончательно удален пользователь: ${existingUser.game_nick}`,
          action_type: "delete",
          target_type: "user",
          target_id: userId,
          target_name: existingUser.game_nick,
          details: `Окончательно удален пользователь с логином "${existingUser.username}" и ролью "${existingUser.role}"`,
          previous_state: {
            status: existingUser.status,
            username: existingUser.username,
            game_nick: existingUser.game_nick,
            role: existingUser.role,
          },
          metadata: {
            deleted_by: currentUser.game_nick,
            permanent_delete: true,
          },
        },
      ])
    } catch (logError) {
      console.error("[Permanent Delete API] Failed to log deletion:", logError)
    }

    return NextResponse.json({ 
      message: "Пользователь окончательно удален", 
      userId,
      deletedUser: {
        username: existingUser.username,
        game_nick: existingUser.game_nick,
      }
    })
  } catch (error) {
    console.error("[Permanent Delete API] Error permanently deleting user:", error)
    return NextResponse.json({ error: "Ошибка при удалении пользователя" }, { status: 500 })
  }
}
