import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { cloudinary } from "@/lib/cloudinary"

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")

  if (!userId || !role || !username || !gameNick) {
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "user",
    username,
    game_nick: gameNick,
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = getUserFromHeaders(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    if (currentUser.role !== "root" && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
    }

    // Await the params promise
    const { id: targetUserId } = await params

    const { data: targetUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, username, game_nick, avatar_public_id")
      .eq("id", targetUserId)
      .single()

    if (fetchError || !targetUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (targetUser.avatar_public_id) {
      await cloudinary.uploader.destroy(targetUser.avatar_public_id, { resource_type: "image" })
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        avatar_url: null,
        avatar_public_id: null,
        avatar_uploaded_at: null,
      })
      .eq("id", targetUserId)
      .select("id, username, game_nick, role, status, city, created_at, avatar_url, avatar_public_id, avatar_uploaded_at")
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Не удалось сбросить аватар" }, { status: 500 })
    }

    try {
      const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
      const user_agent = request.headers.get("user-agent")

      await supabaseAdmin.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Сброшен аватар пользователя: ${targetUser.game_nick}`,
          action_type: "update",
          target_type: "user",
          target_id: targetUserId,
          target_name: targetUser.game_nick,
          details: `Админ сбросил аватар пользователя ${targetUser.username}`,
          metadata: {
            action: "avatar_reset",
            previous_public_id: targetUser.avatar_public_id,
          },
          ip_address,
          user_agent,
        },
      ])
    } catch {
      // ignore
    }

    return NextResponse.json({ user: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при сбросе аватара" },
      { status: 500 }
    )
  }
}