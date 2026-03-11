import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import type { ActionLog } from "@/lib/auth/types"
import type { ActionLogFilters, ActionLogStats, ConfirmModalState } from "../types"
import { WEEK_DAYS, isCriticalAction, getActionTypeLabel, getActionTypeColor } from "../utils"

const LOGS_PER_PAGE = 10
const STATS_BATCH = 1000

const DEFAULT_FILTERS: ActionLogFilters = {
  actionType: "all",
  targetType: "all",
  searchQuery: "",
  dateFrom: "",
  dateTo: "",
  performedBy: "all",
}

const DEFAULT_STATS: ActionLogStats = {
  total: 0,
  activeUsers: 0,
  criticalActions: 0,
  todayActions: 0,
  topActions: [],
  mostActiveUsers: [],
  weeklyActivity: [],
}

export const useActionLog = () => {
  const { user } = useAuth()

  const [logs, setLogs] = useState<ActionLog[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<ActionLogFilters>(DEFAULT_FILTERS)
  const [stats, setStats] = useState<ActionLogStats>(DEFAULT_STATS)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  })

  // ── Debounce для searchQuery и performedBy ────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeSearch, setActiveSearch] = useState("")
  const [activePerformedBy, setActivePerformedBy] = useState("all")

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setActiveSearch(filters.searchQuery)
      setActivePerformedBy(filters.performedBy)
      setCurrentPage(1)
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filters.searchQuery, filters.performedBy])

  // ── loadLogs: все параметры передаются явно, нет closure-багов ───────────
  const loadLogs = useCallback(async (
    page: number,
    actionType: string,
    targetType: string,
    dateFrom: string,
    dateTo: string,
    search: string,
    performedBy: string,
  ) => {
    setIsLoading(true)
    try {
      const apiFilters: Record<string, string> = {}
      if (actionType !== "all")  apiFilters.action_type  = actionType
      if (targetType !== "all")  apiFilters.target_type  = targetType
      if (search)                apiFilters.search       = search
      if (performedBy !== "all") apiFilters.performed_by = performedBy
      if (dateFrom)              apiFilters.date_from    = dateFrom
      if (dateTo)                apiFilters.date_to      = dateTo

      const { logs: fetched, total: count } = await AuthService.getActionLogs(
        LOGS_PER_PAGE,
        (page - 1) * LOGS_PER_PAGE,
        apiFilters
      )
      setLogs(fetched)
      setTotal(count)
    } catch (err) {
      console.error("Failed to load logs:", err)
      setError("Не удалось загрузить журнал действий")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Запуск при изменении любого фильтра или страницы
  useEffect(() => {
    loadLogs(
      currentPage,
      filters.actionType,
      filters.targetType,
      filters.dateFrom,
      filters.dateTo,
      activeSearch,
      activePerformedBy,
    )
  }, [
    currentPage,
    filters.actionType,
    filters.targetType,
    filters.dateFrom,
    filters.dateTo,
    activeSearch,
    activePerformedBy,
    loadLogs,
  ])

  // ── loadStats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    setIsStatsLoading(true)
    try {
      const { logs: firstBatch, total: realTotal } = await AuthService.getActionLogs(STATS_BATCH, 0, {})
      let allLogs = [...firstBatch]

      if (realTotal > STATS_BATCH) {
        const extraCount = Math.ceil((realTotal - STATS_BATCH) / STATS_BATCH)
        const extraBatches = await Promise.all(
          Array.from({ length: extraCount }, (_, i) =>
            AuthService.getActionLogs(STATS_BATCH, STATS_BATCH * (i + 1), {}).then((r) => r.logs)
          )
        )
        extraBatches.forEach((batch) => allLogs.push(...batch))
      }

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const todayCount    = allLogs.filter((l) => new Date(l.created_at) >= todayStart).length
      const criticalCount = allLogs.filter((l) => isCriticalAction(l.action_type)).length
      const uniqueUsers   = new Set(allLogs.map((l) => l.user_id)).size

      // Топ действий
      const actionCounts: Record<string, number> = {}
      allLogs.forEach((l) => {
        actionCounts[l.action_type] = (actionCounts[l.action_type] || 0) + 1
      })
      const topActions = Object.entries(actionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count]) => ({
          label: getActionTypeLabel(type),
          count,
          color: getActionTypeColor(type),
          icon: type,
        }))

      // Самые активные пользователи
      const userCounts: Record<string, { name: string; count: number }> = {}
      allLogs.forEach((l) => {
        if (!userCounts[l.user_id]) userCounts[l.user_id] = { name: l.game_nick, count: 0 }
        userCounts[l.user_id].count++
      })
      const mostActiveUsers = Object.values(userCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Активность за 7 дней
      const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        d.setHours(0, 0, 0, 0)
        const next = new Date(d)
        next.setDate(next.getDate() + 1)
        const count = allLogs.filter((l) => {
          const t = new Date(l.created_at)
          return t >= d && t < next
        }).length
        return { day: WEEK_DAYS[d.getDay()], count }
      })

      setStats({ total: realTotal, activeUsers: uniqueUsers, criticalActions: criticalCount, todayActions: todayCount, topActions, mostActiveUsers, weeklyActivity })
    } catch (err) {
      console.error("Failed to load stats:", err)
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  // ── Обновить всё вручную ──────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    loadLogs(currentPage, filters.actionType, filters.targetType, filters.dateFrom, filters.dateTo, activeSearch, activePerformedBy)
    loadStats()
  }, [loadLogs, loadStats, currentPage, filters, activeSearch, activePerformedBy])

  // ── canUndo ───────────────────────────────────────────────────────────────
  const canUndo = useCallback((log: ActionLog): boolean => {
    if (log.undone) return false
    if (user?.role === "root") {
      return ["deactivate", "restore", "role_change", "update", "create", "delete"].includes(log.action_type)
    }
    if (log.user_id !== user?.id) return false
    return ["deactivate", "restore", "role_change", "update"].includes(log.action_type)
  }, [user])

  // ── Confirm modal ─────────────────────────────────────────────────────────
  const showConfirm = useCallback((config: Omit<ConfirmModalState, "isOpen">) => {
    setConfirmModal({ ...config, isOpen: true })
  }, [])

  const hideConfirm = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }))
  }, [])

  // ── Undo ──────────────────────────────────────────────────────────────────
  const handleUndoAction = useCallback((logId: string) => {
    showConfirm({
      title: "Отмена действия",
      message: "Вы уверены, что хотите отменить это действие?",
      type: "warning",
      confirmText: "Отменить действие",
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")
        try {
          const result = await AuthService.undoAction(logId)
          setSuccess(result.message)
          loadLogs(currentPage, filters.actionType, filters.targetType, filters.dateFrom, filters.dateTo, activeSearch, activePerformedBy)
          loadStats()
        } catch (err: any) {
          setError(err.message || "Не удалось отменить действие")
        }
      },
    })
  }, [showConfirm, hideConfirm, loadLogs, loadStats, currentPage, filters, activeSearch, activePerformedBy])

  // ── Фильтры ───────────────────────────────────────────────────────────────
  const updateFilter = useCallback(<K extends keyof ActionLogFilters>(key: K, value: ActionLogFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    if (key !== "searchQuery" && key !== "performedBy") {
      setCurrentPage(1)
    }
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setActiveSearch("")
    setActivePerformedBy("all")
    setCurrentPage(1)
  }, [])

  // ── Пагинация ─────────────────────────────────────────────────────────────
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / LOGS_PER_PAGE)), [total])

  const pageNumbers = useCallback((): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "...")[] = [1]
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
    return pages
  }, [totalPages, currentPage])

  const handlePreviousPage = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), [])
  const handleNextPage     = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages])
  const handleGoToPage     = useCallback((page: number) => setCurrentPage(Math.max(1, Math.min(totalPages, page))), [totalPages])

  // ── Активные фильтры ──────────────────────────────────────────────────────
  const hasActiveFilters = useMemo(() =>
    filters.actionType !== "all" ||
    filters.targetType !== "all" ||
    filters.searchQuery !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.performedBy !== "all",
  [filters])

  return {
    logs,
    total,
    isLoading,
    isStatsLoading,
    error,
    success,
    currentPage,
    totalPages,
    filters,
    stats,
    confirmModal,
    currentUser: user,
    logsPerPage: LOGS_PER_PAGE,
    hasActiveFilters,
    setError,
    setSuccess,
    handleRefresh,
    handleUndoAction,
    canUndo,
    updateFilter,
    resetFilters,
    handlePreviousPage,
    handleNextPage,
    handleGoToPage,
    pageNumbers,
    showConfirm,
    hideConfirm,
  }
}