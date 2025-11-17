import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import type { User as UserType, ActionLog } from "@/lib/auth/types"
import type { UserFormData, EditUserData, ConfirmModalState, UserTab } from "../types"

export const useUserManagement = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<UserTab>('active')
  const [recentActions, setRecentActions] = useState<ActionLog[]>([])
  const [loadingActions, setLoadingActions] = useState(false)

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

  // Form data
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
  }, [fetchUsers, fetchRecentActions])

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

  return {
    // State
    users,
    loading,
    error,
    success,
    activeTab,
    currentUser,
    recentActions,
    loadingActions,

    // Modal states
    showCreateModal,
    showEditModal,
    showRoleModal,
    showCityModal,
    confirmModal,

    // Form data
    formData,
    editUser,
    changingRoleUser,
    changingCityUser,

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

    // Actions
    fetchUsers,
    fetchRecentActions,
    handleCreateUser,
    handleEditUser,
    handleChangeRole,
    handleChangeCity,
    showConfirm,
    hideConfirm,
  }
}