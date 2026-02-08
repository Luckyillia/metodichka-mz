// app/api/users/undo/route.ts
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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
        role: role as "root" | "admin" | "cc" | "user",
        username: username,
        game_nick: gameNick,
    }
}

// POST - Отменить последнее действие пользователя
export async function POST(request: Request) {
    try {
        const currentUser = getUserFromHeaders(request)

        if (!currentUser) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        const body = await request.json()
        const { logId } = body

        console.log("[Undo API] Undo request from:", currentUser.game_nick, "for log:", logId)

        if (!logId) {
            return NextResponse.json({ error: "ID лога обязателен" }, { status: 400 })
        }

        // Получаем запись из лога
        const { data: logEntry, error: logFetchError } = await supabase
            .from("action_logs")
            .select("*")
            .eq("id", logId)
            .single()
        if (logFetchError || !logEntry) {
            console.error("[Undo API] Log entry not found:", logId)
            return NextResponse.json({ error: "Запись в логге не найдена" }, { status: 404 })
        }

        // Проверка: root может отменять действия всех пользователей, остальные - только свои
        if (currentUser.role !== "root" && logEntry.user_id !== currentUser.id) {
            console.log("[Undo API] Permission denied: user trying to undo another user's action")
            return NextResponse.json(
                { error: "Вы можете отменять только свои действия" },
                { status: 403 }
            )
        }

        // Проверка: действие уже отменено
        if (logEntry.undone) {
            return NextResponse.json(
                { error: "Это действие уже было отменено" },
                { status: 400 }
            )
        }

        // Проверка: можно отменять только определенные типы действий
        const undoableActions = ["deactivate", "restore", "role_change", "update"]
        if (!undoableActions.includes(logEntry.action_type)) {
            return NextResponse.json(
                { error: "Этот тип действия не может быть отменен (вход/выход отменять не имеет смысла)" },
                { status: 400 }
            )
        }

        // Получаем целевого пользователя
        const { data: targetUser, error: targetFetchError } = await supabase
            .from("users")
            .select("*")
            .eq("id", logEntry.target_id)
            .single()

        if (targetFetchError || !targetUser) {
            return NextResponse.json({ error: "Целевой пользователь не найден" }, { status: 404 })
        }

        // Выполняем откат в зависимости от типа действия
        let rollbackResult = null
        let rollbackDetails = ""

        switch (logEntry.action_type) {
            case "deactivate":
                // Откатываем деактивацию -> восстанавливаем пользователя
                const { data: reactivated, error: reactivateError } = await supabase
                    .from("users")
                    .update({ active: true })
                    .eq("id", targetUser.id)
                    .select("id, username, game_nick, role, active, created_at")
                    .single()

                if (reactivateError) {
                    console.error("[Undo API] Reactivate error:", reactivateError)
                    return NextResponse.json({ error: "Не удалось восстановить пользователя" }, { status: 500 })
                }

                rollbackResult = reactivated
                rollbackDetails = `Отменена деактивация: пользователь ${targetUser.game_nick} восстановлен`
                break

            case "restore":
                // Откатываем восстановление -> деактивируем пользователя
                const { data: deactivated, error: deactivateError } = await supabase
                    .from("users")
                    .update({ active: false })
                    .eq("id", targetUser.id)
                    .select("id, username, game_nick, role, active, created_at")
                    .single()

                if (deactivateError) {
                    console.error("[Undo API] Deactivate error:", deactivateError)
                    return NextResponse.json({ error: "Не удалось деактивировать пользователя" }, { status: 500 })
                }

                rollbackResult = deactivated
                rollbackDetails = `Отменено восстановление: пользователь ${targetUser.game_nick} деактивирован`
                break

            case "role_change":
                // Откатываем изменение роли
                const previousRole = logEntry.previous_state?.role
                if (!previousRole) {
                    return NextResponse.json(
                        { error: "Невозможно откатить: предыдущая роль не сохранена" },
                        { status: 400 }
                    )
                }

                const { data: roleReverted, error: roleRevertError } = await supabase
                    .from("users")
                    .update({ role: previousRole })
                    .eq("id", targetUser.id)
                    .select("id, username, game_nick, role, active, created_at")
                    .single()

                if (roleRevertError) {
                    console.error("[Undo API] Role revert error:", roleRevertError)
                    return NextResponse.json({ error: "Не удалось откатить роль" }, { status: 500 })
                }

                rollbackResult = roleReverted
                rollbackDetails = `Отменено изменение роли: пользователь ${targetUser.game_nick} вернулся к роли "${previousRole}"`
                break

            case "update":
                // Откатываем обновление пользователя
                if (logEntry.metadata?.password_changed) {
                    return NextResponse.json(
                        { error: "Невозможно отменить: изменения пароля не могут быть отменены по соображениям безопасности пользователей" },
                        { status: 400 }
                    )
                }

                let previousState: { username?: string; game_nick?: string } = {}
                if (typeof logEntry.previous_state === 'string') {
                    try {
                        previousState = JSON.parse(logEntry.previous_state)
                    } catch (parseError) {
                        console.error("[Undo API] Failed to parse previous_state:", parseError)
                        return NextResponse.json(
                            { error: "Невозможно откатить: ошибка в данных предыдущего состояния" },
                            { status: 400 }
                        )
                    }
                } else if (logEntry.previous_state) {
                    previousState = logEntry.previous_state
                }

                const changes = logEntry.metadata?.changes || []
                if (changes.length === 0) {
                    return NextResponse.json(
                        { error: "Невозможно откатить: изменения не сохранены" },
                        { status: 400 }
                    )
                }

                const updateData: Partial<typeof targetUser> = {}

                changes.forEach((change: string) => {
                    if (change === "username" && previousState.username) {
                        updateData.username = previousState.username
                    } else if (change === "game_nick" && previousState.game_nick) {
                        updateData.game_nick = previousState.game_nick
                    }
                })

                if (Object.keys(updateData).length === 0) {
                    return NextResponse.json(
                        { error: "Невозможно откатить: отсутствуют предыдущие значения для изменений" },
                        { status: 400 }
                    )
                }

                const { data: revertedUser, error: revertError } = await supabase
                    .from("users")
                    .update(updateData)
                    .eq("id", targetUser.id)
                    .select("id, username, game_nick, role, active, created_at")
                    .single()

                if (revertError) {
                    console.error("[Undo API] Update revert error:", revertError)
                    return NextResponse.json({ error: "Не удалось откатить обновление" }, { status: 500 })
                }

                rollbackResult = revertedUser
                rollbackDetails = `Отменено обновление: для пользователя ${targetUser.game_nick} восстановлены предыдущие значения`
                break

            default:
                return NextResponse.json({ error: "Неподдерживаемый тип действия" }, { status: 400 })
        }

        // Обновляем запись в логе - помечаем как отмененную
        const { error: updateLogError } = await supabase
            .from("action_logs")
            .update({
                undone: true,
                undone_at: new Date().toISOString(),
                undone_by_user_id: currentUser.id,
                undone_by_game_nick: currentUser.game_nick,
            })
            .eq("id", logId)

        if (updateLogError) {
            console.error("[Undo API] Failed to mark log as undone:", updateLogError)
            // Не останавливаем выполнение, так как откат уже произошел
        }

        // Создаем новую запись в логе об отмене
        try {
            await supabase.from("action_logs").insert([
                {
                    user_id: currentUser.id,
                    game_nick: currentUser.game_nick,
                    action: `Отменено действие: ${logEntry.action}`,
                    action_type: "other",
                    target_type: "user",
                    target_id: targetUser.id,
                    target_name: targetUser.game_nick,
                    details: rollbackDetails,
                    metadata: {
                        original_log_id: logId,
                        original_action: logEntry.action_type,
                        undone_by: currentUser.game_nick,
                    },
                },
            ])
        } catch (logError) {
            console.error("[Undo API] Failed to log undo action:", logError)
        }

        console.log("[Undo API] Action undone successfully")

        return NextResponse.json({
            success: true,
            message: rollbackDetails,
            restoredUser: rollbackResult,
        })
    } catch (error) {
        console.error("[Undo API] Error:", error)
        return NextResponse.json({ error: "Ошибка при отмене действия" }, { status: 500 })
    }
}