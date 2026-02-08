"use client"

import React, { useState, useEffect, useCallback } from "react"
import { AuthService } from "@/lib/auth/auth-service"
import type { ActionLog } from "@/lib/auth/types"
import {
    Clock,
    User,
    FileText,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Undo2,
    Loader2,
    RotateCcw,
    AlertCircle, X, CheckCircle
} from "lucide-react"
import {useAuth} from "@/lib/auth/auth-context";

export default function ActionLogSection() {
    const { user } = useAuth()
    const [logs, setLogs] = useState<ActionLog[]>([])
    const [filteredLogs, setFilteredLogs] = useState<ActionLog[]>([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedActionType, setSelectedActionType] = useState<string>("all")
    const [selectedTargetType, setSelectedTargetType] = useState<string>("all")
    const [selectedLog, setSelectedLog] = useState<ActionLog | null>(null)
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        title: string
        message: string
        type?: 'danger' | 'info' | 'warning'
        onConfirm: () => void
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

    const logsPerPage = 5

    const loadLogs = useCallback(async () => {
        setIsLoading(true)
        try {
            const filters: any = {}
            if (selectedActionType !== "all") filters.action_type = selectedActionType
            if (selectedTargetType !== "all") filters.target_type = selectedTargetType

            const { logs: fetchedLogs, total: totalCount } = await AuthService.getActionLogs(
                logsPerPage,
                (currentPage - 1) * logsPerPage,
                filters
            )

            setLogs(fetchedLogs)
            setFilteredLogs(fetchedLogs)
            setTotal(totalCount)
        } catch (error) {
            console.error("Failed to load logs:", error)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, selectedActionType, selectedTargetType])

    useEffect(() => {
        loadLogs()
    }, [loadLogs])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date)
    }

    const canUndo = (log: ActionLog) => {
        // Root может отменять действия всех пользователей
        if (user?.role === "root") {
            if (log.undone) return false
            // Исключаем действия входа/выхода, которые отменять не имеет смысла
            return ["deactivate", "restore", "role_change", "update", "create", "delete"].includes(log.action_type)
        }
        // Обычные пользователи могут отменять только свои действия
        if (log.user_id !== user?.id) return false
        if (log.undone) return false
        return ["deactivate", "restore", "role_change", "update"].includes(log.action_type)
    }

    const getActionTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            create: "bg-green-600",
            update: "bg-blue-600",
            delete: "bg-red-600",
            role_change: "bg-purple-600",
            login: "bg-teal-600",
            logout: "bg-gray-600",
            other: "bg-slate-600",
            restore: "bg-emerald-600",
            deactivate: "bg-orange-600",
        }
        return colors[type] || "bg-gray-600"
    }

    const getActionTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            create: "Создание",
            update: "Обновление",
            delete: "Удаление",
            role_change: "Смена роли",
            login: "Вход",
            logout: "Выход",
            other: "Другое",
            restore: "Восстановление",
            deactivate: "Деактивация",
        }
        return labels[type] || type
    }

    const getTargetTypeLabel = (type?: string) => {
        if (!type) return "—"
        const labels: Record<string, string> = {
            user: "Пользователь",
            system: "Система",
            report: "Отчет",
            other: "Другое",
        }
        return labels[type] || type
    }

    const totalPages = Math.ceil(total / logsPerPage)

    const handleUndoAction = async (logId: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Отмена действия',
            message: 'Вы уверены, что хотите отменить это действие?',
            type: 'warning',
            onConfirm: async () => {
                setConfirmModal({ ...confirmModal, isOpen: false })
                setError("")
                setSuccess("")

                try {
                    const result = await AuthService.undoAction(logId)
                    setSuccess(result.message)
                    loadLogs()
                } catch (err: any) {
                    setError(err.message || "Не удалось отменить действие")
                }
            }
        })
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const DetailModal = ({ log, onClose }: { log: ActionLog; onClose: () => void }) => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-popover rounded-lg border-2 border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-colors custom-scrollbar">
                <div className="sticky top-0 bg-popover border-b-2 border-border p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-popover-foreground">Детали записи</h3>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Пользователь</p>
                            <p className="text-foreground font-medium">{log.game_nick}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Дата и время</p>
                            <p className="text-foreground">{formatDate(log.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Тип действия</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getActionTypeColor(log.action_type)}`}>
                {getActionTypeLabel(log.action_type)}
              </span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Целевой объект</p>
                            <p className="text-foreground">{getTargetTypeLabel(log.target_type)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Действие</p>
                        <p className="text-foreground">{log.action}</p>
                    </div>

                    {log.target_name && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Целевое имя</p>
                            <p className="text-foreground">{log.target_name}</p>
                        </div>
                    )}

                    {log.details && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Подробности</p>
                            <p className="text-muted-foreground text-sm">{log.details}</p>
                        </div>
                    )}

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Метаданные</p>
                            <div className="bg-muted/50 rounded p-4 border-2 border-border">
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
                            </div>
                        </div>
                    )}

                    {(log.ip_address && user?.role === "root") && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">IP адрес</p>
                            <p className="text-foreground font-mono text-sm">{log.ip_address}</p>
                        </div>
                    )}

                    {(log.user_agent && user?.role === "root") && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">User Agent</p>
                            <p className="text-muted-foreground text-xs break-all">{log.user_agent}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">ID записи</p>
                            <p className="text-muted-foreground font-mono text-xs break-all">{log.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">ID пользователя</p>
                            <p className="text-muted-foreground font-mono text-xs break-all">{log.user_id}</p>
                        </div>
                    </div>

                    {log.target_id && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">ID целевого объекта</p>
                            <p className="text-muted-foreground font-mono text-xs break-all">{log.target_id}</p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-popover border-t-2 border-border p-6">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg text-destructive transition-colors">
                    <AlertCircle className="w-5 h-5 flex-shrink-0"/>
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto hover:opacity-70 transition-opacity">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
            )}

            {success && (
                <div
                    className="flex items-center gap-2 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg text-green-600 dark:text-green-400 transition-colors">
                    <CheckCircle className="w-5 h-5 flex-shrink-0"/>
                    <span>{success}</span>
                    <button onClick={() => setSuccess("")} className="ml-auto hover:opacity-70 transition-opacity">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
            )}
            <div className="bg-card/50 rounded-lg p-6 border-2 border-border transition-colors">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Фильтры
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Тип действия
                        </label>
                        <select
                            value={selectedActionType}
                            onChange={(e) => {
                                setSelectedActionType(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        >
                            <option value="all">Все типы</option>
                            <option value="create">Создание</option>
                            <option value="update">Обновление</option>
                            <option value="delete">Удаление</option>
                            <option value="role_change">Смена роли</option>
                            <option value="login">Вход</option>
                            <option value="logout">Выход</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Целевой объект
                        </label>
                        <select
                            value={selectedTargetType}
                            onChange={(e) => {
                                setSelectedTargetType(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        >
                            <option value="all">Все объекты</option>
                            <option value="user">Пользователь</option>
                            <option value="system">Система</option>
                            <option value="report">Отчет</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-card/50 rounded-lg border-2 border-border overflow-hidden transition-colors">
                <div className="p-6 border-b-2 border-border">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Журнал действий ({total} записей)
                    </h2>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Загрузка логов...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Записи не найдены</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Дата и время
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Пользователь
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Тип
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Действие
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Цель
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Детали
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(log.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-foreground">{log.game_nick}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getActionTypeColor(log.action_type)}`}>
                                              {getActionTypeLabel(log.action_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-foreground">{log.action}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-muted-foreground">{log.target_name || getTargetTypeLabel(log.target_type)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="flex items-center gap-1 text-sm text-primary hover:opacity-70 transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Показать
                                            </button>
                                            {canUndo(log) && (
                                                <button
                                                    onClick={() => handleUndoAction(log.id)}
                                                    className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:opacity-70 transition-all"
                                                    title="Отменить действие"
                                                >
                                                    <RotateCcw className="w-4 h-4"/>
                                                    Отменить
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t-2 border-border flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Страница {currentPage} из {totalPages} (показано {filteredLogs.length} из {total})
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Назад
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                    >
                                        Вперед
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedLog && <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}

            {/* Модальное окно подтверждения */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-popover rounded-xl shadow-2xl max-w-md w-full border-2 border-border animate-in fade-in zoom-in duration-200 transition-colors">
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`p-3 rounded-full ${
                                    confirmModal.type === 'danger' ? 'bg-destructive/20' :
                                        confirmModal.type === 'info' ? 'bg-primary/20' : 'bg-yellow-500/20'
                                }`}>
                                    <AlertCircle className={`w-6 h-6 ${
                                        confirmModal.type === 'danger' ? 'text-destructive' :
                                            confirmModal.type === 'info' ? 'text-primary' : 'text-yellow-600 dark:text-yellow-400'
                                    }`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-popover-foreground mb-2">
                                        {confirmModal.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {confirmModal.message}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                                    className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all font-medium"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-medium ${
                                        confirmModal.type === 'danger' 
                                            ? 'bg-destructive hover:opacity-90 text-destructive-foreground' :
                                            confirmModal.type === 'info'
                                                ? 'bg-primary hover:opacity-90 text-primary-foreground'
                                                : 'bg-yellow-600 dark:bg-yellow-500 hover:opacity-90 text-white'
                                    }`}
                                >
                                    Отменить действие
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}