import CryptoJS from "crypto-js"
import { AUTH_SIGNING_KEY } from "@/lib/auth/constants"

export const RECOVERY_TOKEN_TTL_MS = 10 * 60 * 1000

function safeString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export function createRecoveryToken(userId: string, username: string) {
  if (!AUTH_SIGNING_KEY) throw new Error("AUTH_SIGNING_KEY не задан")

  const ts = Date.now()
  const payload = `${userId}:${username}:${ts}`
  const sig = CryptoJS.HmacSHA256(payload, AUTH_SIGNING_KEY).toString()

  return Buffer.from(JSON.stringify({ userId, username, ts, sig })).toString("base64")
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

  if (Date.now() - ts > RECOVERY_TOKEN_TTL_MS) {
    throw new Error("Сессия подтверждения истекла, подтвердите логин и пароль заново")
  }

  const expected = CryptoJS.HmacSHA256(`${userId}:${username}:${ts}`, AUTH_SIGNING_KEY).toString()
  if (expected !== sig) {
    throw new Error("Неверный recoveryToken")
  }

  return { userId, username }
}