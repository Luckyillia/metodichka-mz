// lib/auth/constants.ts
// ВАЖНО: Этот ключ должен быть одинаковым на клиенте и сервере
// В продакшене замените на секретный ключ из переменной окружения
export const AUTH_SIGNING_KEY = process.env.AUTH_SIGNING_KEY
export const AUTH_STORAGE_KEY = "mod_auth_encrypted"
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds