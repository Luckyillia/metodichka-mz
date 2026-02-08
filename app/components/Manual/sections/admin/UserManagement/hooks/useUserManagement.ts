// app/components/Manual/sections/admin/UserManagement/hooks/useUserManagement.ts (обновлённый)
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import type { User as UserType, ActionLog } from "@/lib/auth/types"
import type { UserFormData, EditUserData, ConfirmModalState, UserTab } from "../types"

export const useUserManagement = () => {

  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserType[]>([])

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<UserTab>('active')

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    gameNick: "",
    password: "",
    role: "user",
    city: "CGB-N",
  })

  const [editUser, setEditUser] = useState<EditUserData>({
    id: "",
    username: "",
    gameNick: "",
    password: "",
    role: "user",
  })

  const [loadingModeration, setLoadingModeration] = useState(false)

  const [recentActions, setRecentActions] = useState<ActionLog[]>([])
  const [loadingActions, setLoadingActions] = useState(false)
  
  // Состояния фильтров
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterCity, setFilterCity] = useState<string>("all")
  const [filterOrder, setFilterOrder] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  })

  const clearSelection = useCallback(() => {
    setSelectedUserIds(new Set())
  }, [])

  const fetchModeration = useCallback(async () => {
    // Post-moderation: moderation list is derived from `users` fetched by fetchUsers.
    // Keep this hook for future extension (e.g. server-side pagination).
    setLoadingModeration(false)
  }, [])

  const toggleUser = useCallback((userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }, [])

  const toggleAll = useCallback((checked: boolean, userIds: string[]) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        userIds.forEach((id) => next.add(id))
      } else {
        userIds.forEach((id) => next.delete(id))
      }
      return next
    })
  }, [])

  const [changingRoleUser, setChangingRoleUser] = useState<UserType | null>(null)
  const [changingCityUser, setChangingCityUser] = useState<UserType | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const fetchedUsers = await AuthService.getUsers()
      setUsers(fetchedUsers)
      setError("")
    } catch (err) {
      setError("Не удалось загрузить пользователей")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecentActions = useCallback(async () => {
    try {
      setLoadingActions(true)
      const { logs } = await AuthService.getActionLogs(10, 0, {
        target_type: "user",
      })
      setRecentActions(logs)
    } catch (err) {
      console.error("Failed to fetch recent actions:", err)
    } finally {
      setLoadingActions(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchRecentActions()
    fetchModeration()
  }, [fetchUsers, fetchRecentActions, fetchModeration])

  useEffect(() => {
    // refresh moderation queue when switching to moderation tab
    if (activeTab === "moderation") {
      fetchModeration()
    }
  }, [activeTab, fetchModeration])

  const handleCreateUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await AuthService.createUser(
        formData.username,
        formData.gameNick,
        formData.password,
        formData.role,
        formData.city
      )

      setSuccess(`Пользователь ${formData.gameNick} успешно создан`)
      setShowCreateModal(false)
      setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось создать пользователя")
    }
  }, [formData, fetchUsers, fetchRecentActions])

  const handleEditUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await AuthService.updateUser(
        editUser.id,
        editUser.username,
        editUser.gameNick,
        editUser.password || undefined
      )

      setShowEditModal(false)
      setEditUser({ id: "", username: "", gameNick: "", password: "", role: "user" })
      setSuccess("Пользователь успешно обновлен")
      fetchUsers()
    } catch (error) {
      setError("Ошибка при обновлении пользователя")
    } finally {
      setLoading(false)
    }
  }, [editUser, fetchUsers])

  const handleChangeRole = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!changingRoleUser) return

    setError("")
    setSuccess("")

    try {
      await AuthService.updateUserRole(changingRoleUser.id, formData.role)

      setSuccess(`Роль пользователя ${changingRoleUser.game_nick} изменена на ${formData.role}`)
      setShowRoleModal(false)
      setChangingRoleUser(null)
      setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось изменить роль")
    }
  }, [changingRoleUser, formData.role, fetchUsers, fetchRecentActions])

  const handleChangeCity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!changingCityUser) return

    setError("")
    setSuccess("")

    try {
      await AuthService.updateUserCity(changingCityUser.id, formData.city)

      setSuccess(`Город пользователя ${changingCityUser.game_nick} изменен`)
      setShowCityModal(false)
      setChangingCityUser(null)
      setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось изменить город")
    }
  }, [changingCityUser, formData.city, fetchUsers, fetchRecentActions])

  const showConfirm = useCallback((config: Omit<ConfirmModalState, 'isOpen'>) => {
    setConfirmModal({ ...config, isOpen: true })
  }, [])

  const hideConfirm = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const bulkResetAvatars = useCallback(async () => {
    if (!currentUser || currentUser.role !== "root") return

    const ids = Array.from(selectedUserIds)
    if (ids.length === 0) return

    showConfirm({
      title: "Сбросить аватары",
      message: `Вы уверены, что хотите сбросить аватары пользователей: ${ids.length}?`,
      type: "info",
      confirmText: "Сбросить",
      cancelText: "Отмена",
      onCancel: hideConfirm,
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await Promise.all(
            ids.map(async (id) => {
              const res = await AuthService.fetchWithAuth(`/api/users/reset-avatar?id=${id}`, {
                method: "POST",
              })
              if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Не удалось сбросить аватар: ${id}`)
              }
            })
          )

          setSuccess(`Сброшено аватары пользователей: ${ids.length}`)
          clearSelection()
          fetchUsers()
          fetchRecentActions()
        } catch (e: any) {
          setError(e?.message || "Не удалось сбросить аватары")
        }
      },
    })
  }, [currentUser, selectedUserIds, showConfirm, hideConfirm, clearSelection, fetchUsers, fetchRecentActions])

  const bulkApproveRequests = useCallback(async () => {
    if (!currentUser || currentUser.role !== "root") return

    const ids = Array.from(selectedUserIds)
    if (ids.length === 0) return

    showConfirm({
      title: "Одобрить запросы",
      message: `Вы уверены, что хотите одобрить запросы пользователей: ${ids.length}?`,
      type: "info",
      confirmText: "Одобрить",
      cancelText: "Отмена",
      onCancel: hideConfirm,
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await Promise.all(
            ids.map(async (id) => {
              const res = await AuthService.fetchWithAuth(`/api/users/approve-request?id=${id}`, {
                method: "POST",
              })
              if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Не удалось одобрить: ${id}`)
              }
            })
          )

          setSuccess(`Одобрено запросов: ${ids.length}`)
          clearSelection()
          fetchUsers()
          fetchRecentActions()
        } catch (e: any) {
          setError(e?.message || "Не удалось одобрить запросы")
        }
      },
    })
  }, [currentUser, selectedUserIds, showConfirm, hideConfirm, clearSelection, fetchUsers, fetchRecentActions])

  const bulkRestoreInactive = useCallback(async () => {
    if (!currentUser || currentUser.role !== "root") return

    const ids = Array.from(selectedUserIds)
    if (ids.length === 0) return

    showConfirm({
      title: "Восстановить пользователей",
      message: `Вы уверены, что хотите восстановить пользователей: ${ids.length}?`,
      type: "info",
      confirmText: "Восстановить",
      cancelText: "Отмена",
      onCancel: hideConfirm,
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await Promise.all(
            ids.map(async (id) => {
              const res = await AuthService.fetchWithAuth("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, action: "restore" }),
              })
              if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Не удалось восстановить: ${id}`)
              }
            })
          )

          setSuccess(`Восстановлено пользователей: ${ids.length}`)
          clearSelection()
          fetchUsers()
          fetchRecentActions()
        } catch (e: any) {
          setError(e?.message || "Не удалось восстановить пользователей")
        }
      },
    })
  }, [currentUser, selectedUserIds, showConfirm, hideConfirm, clearSelection, fetchUsers, fetchRecentActions])

  const bulkPermanentDelete = useCallback(async () => {
    if (!currentUser || currentUser.role !== "root") return

    const ids = Array.from(selectedUserIds)
    if (ids.length === 0) return

    showConfirm({
      title: "Удалить окончательно",
      message: `ВНИМАНИЕ! Вы собираетесь окончательно удалить пользователей: ${ids.length}. Действие необратимо. Продолжить?`,
      type: "danger",
      confirmText: "Удалить",
      cancelText: "Отмена",
      onCancel: hideConfirm,
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await Promise.all(
            ids.map(async (id) => {
              const res = await AuthService.fetchWithAuth(`/api/users/permanent-delete?id=${id}`, {
                method: "DELETE",
              })
              if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Не удалось удалить: ${id}`)
              }
            })
          )

          setSuccess(`Удалено пользователей: ${ids.length}`)
          clearSelection()
          fetchUsers()
          fetchRecentActions()
        } catch (e: any) {
          setError(e?.message || "Не удалось удалить пользователей")
        }
      },
    })
  }, [currentUser, selectedUserIds, showConfirm, hideConfirm, clearSelection, fetchUsers, fetchRecentActions])

  const bulkDeactivateActive = useCallback(async () => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "root" && currentUser.role !== "ld")) return

    const ids = Array.from(selectedUserIds)
    if (ids.length === 0) return

    showConfirm({
      title: "Деактивация пользователей",
      message: `Вы уверены, что хотите деактивировать пользователей: ${ids.length}?`,
      type: "danger",
      confirmText: "Деактивировать",
      cancelText: "Отмена",
      onCancel: hideConfirm,
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await Promise.all(
            ids.map(async (id) => {
              const res = await AuthService.fetchWithAuth(`/api/users?id=${id}`, { method: "DELETE" })
              if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || `Не удалось деактивировать: ${id}`)
              }
            })
          )

          setSuccess(`Деактивировано пользователей: ${ids.length}`)
          clearSelection()
          fetchUsers()
          fetchRecentActions()
        } catch (e: any) {
          setError(e?.message || "Не удалось деактивировать пользователей")
        }
      },
    })
  }, [currentUser, selectedUserIds, showConfirm, hideConfirm, clearSelection, fetchUsers, fetchRecentActions])

  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferringUser, setTransferringUser] = useState<UserType | null>(null)
  const [transferNewCity, setTransferNewCity] = useState<string>("")

  const handleTransferCity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transferringUser || !transferNewCity) return

    setError("")
    setSuccess("")

    try {
      await AuthService.transferUserCity(transferringUser.id, transferNewCity)

      const action = currentUser?.role === "ld" ? " (необратимо)" : ""
      setSuccess(`Игрок ${transferringUser.game_nick} успешно перемещен в ${transferNewCity}${action}`)
      setShowTransferModal(false)
      setTransferringUser(null)
      setTransferNewCity("")
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось переместить игрока")
    }
  }, [transferringUser, transferNewCity, currentUser, fetchUsers, fetchRecentActions])

  return {
    // State
    users,
    selectedUserIds,
    loading,
    error,
    success,
    activeTab,
    currentUser,

    loadingModeration,

    recentActions,
    loadingActions,
    filterRole,
    filterCity,
    filterOrder,
    sortOrder,

    // Modal states
    showCreateModal,
    showEditModal,
    showRoleModal,
    showCityModal,
    confirmModal,
    showTransferModal,

    // Form data
    formData,
    editUser,
    changingRoleUser,
    changingCityUser,
    transferringUser,
    transferNewCity,

    // Setters
    setError,
    setSuccess,
    setActiveTab,
    setShowCreateModal,
    setShowEditModal,
    setShowRoleModal,
    setShowCityModal,
    setFormData,
    setEditUser,
    setChangingRoleUser,
    setChangingCityUser,
    setFilterRole,
    setFilterCity,
    setFilterOrder,
    setSortOrder,

    // Actions
    fetchUsers,
    fetchRecentActions,
    fetchModeration,

    handleCreateUser,
    handleEditUser,
    handleChangeRole,
    handleChangeCity,
    showConfirm,
    hideConfirm,

    toggleUser,
    toggleAll,
    clearSelection,
    bulkResetAvatars,
    bulkApproveRequests,
    bulkRestoreInactive,
    bulkPermanentDelete,
    bulkDeactivateActive,

    setShowTransferModal,
    setTransferringUser,
    setTransferNewCity,
    handleTransferCity
  }
}