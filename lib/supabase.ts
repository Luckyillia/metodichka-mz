// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.MZ_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.MZ_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Обновлённый тип User с игровым ником
export type User = {
    id: string
    username: string
    game_nick: string  // Игровой ник вместо email
    password: string
    role: 'root' | 'admin' | 'cc' | 'user'
    created_at: string
}

// Функция для валидации формата игрового ника
export function validateGameNick(nick: string): { valid: boolean; error?: string } {
    // Проверка формата: Name_Surname (буквы, одно подчёркивание)
    const gameNickRegex = /^[A-Za-z]+_[A-Za-z]+$/

    if (!nick || nick.trim() === '') {
        return { valid: false, error: 'Игровой ник обязателен' }
    }

    if (!gameNickRegex.test(nick)) {
        return {
            valid: false,
            error: 'Неверный формат. Используйте формат: Имя_Фамилия (только английские буквы)'
        }
    }

    if (nick.length < 5 || nick.length > 50) {
        return { valid: false, error: 'Ник должен быть от 5 до 50 символов' }
    }

    return { valid: true }
}