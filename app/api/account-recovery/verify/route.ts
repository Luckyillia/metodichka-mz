import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"
import { AUTH_SIGNING_KEY } from "@/lib/auth/constants"
import { createRecoveryToken } from "@/lib/auth/recovery-token"

function safeString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const username = safeString(body?.username)
    const password = safeString(body?.password)

    if (!username || !password) {
      return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 })
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, password, status, game_nick")
      .eq("username", username)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    if (user.status !== "inactive") {
      return NextResponse.json({ error: "Аккаунт не деактивирован" }, { status: 400 })
    }

    if (!AUTH_SIGNING_KEY) {
      return NextResponse.json({ error: "Сервер не настроен" }, { status: 500 })
    }

    const recoveryToken = createRecoveryToken(user.id, user.username)
    return NextResponse.json({ recoveryToken, gameNick: user.game_nick })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Ошибка проверки" }, { status: 500 })
  }
}