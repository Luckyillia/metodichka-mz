import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Указываем runtime для Edge или Node
export const runtime = 'nodejs'

// Получение пользователя из заголовков middleware
function getUserFromHeaders(request: Request) {
    const userId = request.headers.get("x-user-id")
    const role = request.headers.get("x-user-role")
    const username = request.headers.get("x-user-username")
    const gameNick = request.headers.get("x-user-game-nick")

    if (!userId || !role || !username || !gameNick) {
        return null
    }

    return { id: userId, role, username, game_nick: gameNick }
}

// GET - Публичное получение данных о парковке
export async function GET() {
    try {
        const { data: spaces, error } = await supabase
            .from("parking_spaces")
            .select("*")
            .order("place", { ascending: true })

        if (error) {
            console.error("[Parking API] GET error:", error)
            return NextResponse.json(
                { error: "Ошибка получения данных" },
                { status: 500 }
            )
        }

        return NextResponse.json({ spaces: spaces || [] }, { status: 200 })
    } catch (error) {
        console.error("[Parking API] GET exception:", error)
        return NextResponse.json(
            { error: "Внутренняя ошибка сервера" },
            { status: 500 }
        )
    }
}

// Общая функция для обновления парковочного места
async function updateParkingSpaceHandler(request: Request) {
    try {
        // Проверяем авторизацию
        const user = getUserFromHeaders(request)
        if (!user) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        // Проверяем права (только root, admin, ld, cc)
        const allowedRoles = ["root", "admin", "ld", "cc"]
        if (!allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { error: "Недостаточно прав" },
                { status: 403 }
            )
        }

        // Парсим тело запроса
        const body = await request.json()
        const { place, person, car, license } = body

        // Валидация
        if (
            typeof place !== "number" ||
            place < 1 ||
            place > 36 ||
            !person?.trim() ||
            !car?.trim() ||
            !license?.trim()
        ) {
            return NextResponse.json(
                { error: "Некорректные данные" },
                { status: 400 }
            )
        }

        // Получаем старые данные для логирования
        const { data: oldData } = await supabase
            .from("parking_spaces")
            .select("person, car, license")
            .eq("place", place)
            .single()

        // Обновляем данные
        const { data: updated, error: updateError } = await supabase
            .from("parking_spaces")
            .update({
                person: person.trim(),
                car: car.trim(),
                license: license.trim(),
                updated_by: user.game_nick,
                updated_at: new Date().toISOString(),
            })
            .eq("place", place)
            .select()
            .single()

        if (updateError || !updated) {
            console.error("[Parking API] Update error:", updateError)
            return NextResponse.json(
                { error: "Ошибка обновления" },
                { status: 500 }
            )
        }

        // Логирование (без await чтобы не блокировать ответ)
        supabase
            .from("action_logs")
            .insert({
                user_id: user.id,
                game_nick: user.game_nick,
                action: `Обновлено парковочное место №${place}`,
                action_type: "update",
                target_type: "other",
                target_id: null,
                target_name: `Место №${place}`,
                details: oldData
                    ? `${oldData.person} → ${person}`
                    : `Установлено: ${person}`,
                metadata: {
                    place,
                    old: oldData || null,
                    new: { person, car, license },
                },
                ip_address:
                    request.headers.get("x-forwarded-for") ||
                    request.headers.get("x-real-ip"),
                user_agent: request.headers.get("user-agent"),
            })
            .then(({ error: logError }) => {
                if (logError) console.error("[Parking API] Log error:", logError)
            })

        return NextResponse.json(updated, { status: 200 })
    } catch (error) {
        console.error("[Parking API] Update exception:", error)
        return NextResponse.json(
            { error: "Внутренняя ошибка сервера" },
            { status: 500 }
        )
    }
}

// PUT - Обновление парковочного места (требует авторизации)
export async function PUT(request: Request) {
    console.log("[Parking API] PUT request received")
    return updateParkingSpaceHandler(request)
}

// PATCH - Обновление парковочного места (альтернативный метод)
export async function PATCH(request: Request) {
    console.log("[Parking API] PATCH request received")
    return updateParkingSpaceHandler(request)
}

// POST - Обновление парковочного места (альтернативный метод для совместимости)
export async function POST(request: Request) {
    console.log("[Parking API] POST request received")
    return updateParkingSpaceHandler(request)
}