import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import CryptoJS from "crypto-js"
import { supabase } from "@/lib/supabase"
import { AUTH_SIGNING_KEY } from "@/lib/auth/constants"

const TOKEN_TTL_MS = 10 * 60 * 1000

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

    const ts = Date.now()
    const payload = `${user.id}:${user.username}:${ts}`
    const sig = CryptoJS.HmacSHA256(payload, AUTH_SIGNING_KEY).toString()

    const tokenObj = { userId: user.id, username: user.username, ts, sig }
    const token = Buffer.from(JSON.stringify(tokenObj)).toString("base64")

    return NextResponse.json({ recoveryToken: token, gameNick: user.game_nick })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Ошибка проверки" }, { status: 500 })
  }
}

export function validateRecoveryToken(token: string) {
  if (!AUTH_SIGNING_KEY) throw new Error("AUTH_SIGNING_KEY не задан")

  let parsed: any
  try {
    parsed = JSON.parse(Buffer.from(token, "base64").toString("utf8"))
  } catch {
    throw new Error("Неверный recoveryToken")
  }

  const userId = safeString(parsed?.userId)
  const username = safeString(parsed?.username)
  const ts = typeof parsed?.ts === "number" ? parsed.ts : NaN
  const sig = safeString(parsed?.sig)

  if (!userId || !username || !Number.isFinite(ts) || !sig) {
    throw new Error("Неверный recoveryToken")
  }

  if (Date.now() - ts > TOKEN_TTL_MS) {
    throw new Error("Сессия подтверждения истекла, подтвердите логин и пароль заново")
  }

  const payload = `${userId}:${username}:${ts}`
  const expected = CryptoJS.HmacSHA256(payload, AUTH_SIGNING_KEY).toString()
  if (expected !== sig) {
    throw new Error("Неверный recoveryToken")
  }

  return { userId, username }
}
