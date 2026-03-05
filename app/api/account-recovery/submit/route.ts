import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { validateRecoveryToken } from "../verify/route"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = typeof body?.recoveryToken === "string" ? body.recoveryToken : ""
    const docUrl = typeof body?.docUrl === "string" ? body.docUrl : ""
    const docPublicId = typeof body?.docPublicId === "string" ? body.docPublicId : ""
    
    // Optional edits
    const gameNick = typeof body?.gameNick === "string" ? body.gameNick.trim() : ""
    const city = typeof body?.city === "string" ? body.city : ""
    const role = typeof body?.role === "string" ? body.role : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!token) {
      return NextResponse.json({ error: "recoveryToken обязателен" }, { status: 400 })
    }

    if (!docUrl || !docPublicId) {
      return NextResponse.json({ error: "Документ восстановления обязателен" }, { status: 400 })
    }

    let userId: string
    let username: string
    try {
      const validated = validateRecoveryToken(token)
      userId = validated.userId
      username = validated.username
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || "Неверный или просроченный токен" }, { status: 401 })
    }

    // Verify user still exists and is inactive
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, username, status, game_nick, city")
      .eq("id", userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (user.status !== "inactive") {
      return NextResponse.json({ error: "Аккаунт не деактивирован" }, { status: 400 })
    }

    // Build update data
    const updateData: any = {
      status: "request",
      id_photo_url: docUrl,
    }

    if (gameNick && gameNick !== user.game_nick) {
      // Validate game nick format
      const regex = /^[A-Za-z]+_[A-Za-z]+$/
      if (!regex.test(gameNick)) {
        return NextResponse.json({ error: "Неверный формат игрового ника (Имя_Фамилия)" }, { status: 400 })
      }
      updateData.game_nick = gameNick
    }

    if (city && ["CGB-N", "CGB-P", "OKB-M"].includes(city)) {
      updateData.city = city
    }

    if (role && ["user", "cc", "ld"].includes(role)) {
      updateData.role = role
    }

    if (password && password.length >= 6) {
      const bcrypt = (await import("bcryptjs")).default
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select("id, username, game_nick, status, city")
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Не удалось отправить запрос на восстановление" }, { status: 500 })
    }

    // Log the recovery request
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: userId,
          game_nick: updated.game_nick,
          action: `Запрос на восстановление аккаунта: ${updated.game_nick}`,
          action_type: "restore",
          target_type: "user",
          target_id: userId,
          target_name: updated.game_nick,
          details: `Пользователь самостоятельно запросил восстановление деактивированного аккаунта`,
          previous_state: { status: "inactive" },
          new_state: { status: "request", id_photo_url: docUrl },
          metadata: {
            request_type: "account_recovery",
            doc_url: docUrl,
            doc_public_id: docPublicId,
            changes: Object.keys(updateData).filter(k => k !== "status" && k !== "id_photo_url"),
          },
        },
      ])
    } catch (logError) {
      console.error("[Recovery Submit] Failed to log:", logError)
    }

    return NextResponse.json({ message: "Запрос на восстановление отправлен на модерацию", user: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Ошибка при отправке запроса" }, { status: 500 })
  }
}
