// app/components/Manual/sections/admin/UserManagementSection.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import type { User as UserType, ActionLog } from "@/lib/auth/types"
import {
  UserPlus,
  Edit,
  Trash2,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Loader2,
  RotateCcw,
  Eye,
  EyeOff,
  UserCog,
  Users,
  User,
  Star,
  Gamepad
} from "lucide-react"

export default function UserManagementSection() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'inactive' | 'requests'>('active')
  const [changingRoleUser, setChangingRoleUser] = useState<UserType | null>(null)
  const [changingCityUser, setChangingCityUser] = useState<UserType | null>(null)
  const [recentActions, setRecentActions] = useState<ActionLog[]>([])
  const [loadingActions, setLoadingActions] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    type?: 'danger' | 'warning' | 'info'
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'warning' })

  const [formData, setFormData] = useState({
    username: "",
    gameNick: "",
    password: "",
    role: "user",
    city: "CGB-N" as "CGB-N" | "CGB-P" | "OKB-M",
  })

  const [editUser, setEditUser] = useState({
    id: "",
    username: "",
    gameNick: "",
    password: "",
    role: "" as "root" | "admin" | "ld" |"cc" | "user",
  })

  useEffect(() => {
    fetchUsers()
    fetchRecentActions()
  }, [])

  const validateGameNick = (nick: string): string | null => {
    const gameNickRegex = /^[A-Za-z]+_[A-Za-z]+$/

    if (!nick.trim()) {
      return "Игровой ник обязателен"
    }

    if (!gameNickRegex.test(nick)) {
      return "Используйте формат: Имя_Фамилия (только английские буквы)"
    }

    if (nick.length < 5 || nick.length > 50) {
      return "Ник должен быть от 5 до 50 символов"
    }

    return null
  }

  const fetchUsers = async () => {
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
  }

  const fetchRecentActions = async () => {
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
  }

  const handleCreateUser = async (e: React.FormEvent) => {
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
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editUser.username || !editUser.gameNick) {
      setError("Имя пользователя и игровой ник обязательны")
      return
    }

    const nickError = validateGameNick(editUser.gameNick)
    if (nickError) {
      setError(nickError)
      return
    }

    if (editUser.password && editUser.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    setLoading(true)

    try {
      await AuthService.updateUser(editUser.id, editUser.username, editUser.gameNick, (editUser.password || undefined))

      setShowEditModal(false)
      setEditUser({ id: "", username: "", gameNick: "", password: "", role: "user" })
      setSuccess("Пользователь успешно обновлен")
      fetchUsers()
    } catch (error) {
      setError("Ошибка при обновлении пользователя")
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (e: React.FormEvent) => {
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
  }

  const handleDeactivateUser = async (userId: string, gameNick: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Деактивация пользователя',
      message: `Вы уверены, что хотите деактивировать пользователя ${gameNick}?`,
      type: 'danger',
      confirmText: 'Деактивировать',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        setError("")
        setSuccess("")

        try {
          await AuthService.deactivateUser(userId)
          setSuccess(`Пользователь ${gameNick} деактивирован`)
          fetchUsers()
          fetchRecentActions()
        } catch (err: any) {
          setError(err.message || "Не удалось деактивировать пользователя")
        }
      }
    })
  }

  const handleRestoreUser = async (userId: string, gameNick: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Восстановление пользователя',
      message: `Вы уверены, что хотите восстановить пользователя ${gameNick}?`,
      type: 'info',
      confirmText: 'Восстановить',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        setError("")
        setSuccess("")

        try {
          await AuthService.restoreUser(userId)
          setSuccess(`Пользователь ${gameNick} восстановлен`)
          fetchUsers()
          fetchRecentActions()
        } catch (err: any) {
          setError(err.message || "Не удалось восстановить пользователя")
        }
      }
    })
  }

  const handlePermanentDelete = async (userId: string, gameNick: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Окончательное удаление пользователя',
      message: `ВНИМАНИЕ! Вы собираетесь ОКОНЧАТЕЛЬНО удалить пользователя ${gameNick}. Это действие НЕОБРАТИМО! Все данные пользователя будут удалены из базы данных. Продолжить?`,
      type: 'danger',
      confirmText: 'Удалить окончательно',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        setError("")
        setSuccess("")

        try {
          await AuthService.permanentDeleteUser(userId)
          setSuccess(`Пользователь ${gameNick} окончательно удален`)
          fetchUsers()
          fetchRecentActions()
        } catch (err: any) {
          setError(err.message || "Не удалось удалить пользователя")
        }
      }
    })
  }

  const handleApproveRequest = async (userId: string, gameNick: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Одобрение запроса на аккаунт',
      message: `Вы уверены, что хотите одобрить запрос на создание аккаунта для ${gameNick}?`,
      type: 'info',
      confirmText: 'Одобрить',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        setError("")
        setSuccess("")

        try {
          await AuthService.approveAccountRequest(userId)
          setSuccess(`Запрос на аккаунт для ${gameNick} одобрен`)
          const updatedUsers = await AuthService.getUsers()
          setUsers(updatedUsers)
          fetchRecentActions()
          // Проверяем, остались ли доступные запросы для текущего пользователя
          const remainingRequests = updatedUsers.filter((u) => {
            if (u.status !== "request") return false
            if (currentUser?.role === "ld") {
              return u.role === "cc" || u.role === "user"
            }
            return true
          })
          if (remainingRequests.length === 0) {
            setActiveTab('active')
          }
        } catch (err: any) {
          setError(err.message || "Не удалось одобрить запрос")
        }
      }
    })
  }

  const handleRejectRequest = async (userId: string, gameNick: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Отклонение запроса на аккаунт',
      message: `Вы уверены, что хотите отклонить запрос на создание аккаунта для ${gameNick}? Запрос будет удален.`,
      type: 'warning',
      confirmText: 'Отклонить',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        setError("")
        setSuccess("")

        try {
          await AuthService.rejectAccountRequest(userId)
          setSuccess(`Запрос на аккаунт для ${gameNick} отклонен`)
          const updatedUsers = await AuthService.getUsers()
          setUsers(updatedUsers)
          fetchRecentActions()
          // Проверяем, остались ли доступные запросы для текущего пользователя
          const remainingRequests = updatedUsers.filter((u) => {
            if (u.status !== "request") return false
            if (currentUser?.role === "ld") {
              return u.role === "cc" || u.role === "user"
            }
            return true
          })
          if (remainingRequests.length === 0) {
            setActiveTab('active')
          }
        } catch (err: any) {
          setError(err.message || "Не удалось отклонить запрос")
        }
      }
    })
  }

  const openCreateModal = () => {
    // Лидер создает пользователей только для своего города
    const city = currentUser?.role === "ld" ? currentUser.city : "CGB-N"
    setFormData({ username: "", gameNick: "", password: "", role: "user", city })
    setShowCreateModal(true)
  }

  const openEditModal = (u: UserType) => {
    setEditUser({
      id: u.id,
      username: u.username,
      gameNick: u.game_nick,
      password: "",
      role: u.role,
    })
    setShowEditModal(true)
  }

  const openRoleModal = (user: UserType) => {
    setChangingRoleUser(user)
    setFormData({
      username: user.username,
      gameNick: user.game_nick,
      password: "",
      role: user.role,
      city: user.city,
    })
    setShowRoleModal(true)
  }

  const openCityModal = (user: UserType) => {
    setChangingCityUser(user)
    setFormData({
      username: user.username,
      gameNick: user.game_nick,
      password: "",
      role: user.role,
      city: user.city,
    })
    setShowCityModal(true)
  }

  const handleChangeCity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!changingCityUser) return

    setError("")
    setSuccess("")

    try {
      await AuthService.updateUserCity(changingCityUser.id, formData.city)

      setSuccess(`Город пользователя ${changingCityUser.game_nick} изменен на ${getCityLabel(formData.city)}`)
      setShowCityModal(false)
      setChangingCityUser(null)
      setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось изменить город")
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "root":
        return "bg-purple-600 text-white"
      case "admin":
        return "bg-red-600 text-white"
      case "ld":
        return "bg-pink-600 text-white"
      case "cc":
        return "bg-blue-600 text-white"
      case "user":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getCityLabel = (city: string) => {
    switch (city) {
      case "CGB-N":
        return "ЦГБ-Н"
      case "CGB-P":
        return "ЦГБ-П"
      case "OKB-M":
        return "ОКБ-М"
      default:
        return city
    }
  }

  const getRoleLabel = (role: string, city?: string) => {
    const cityLabel = city ? ` ${getCityLabel(city)}` : ''
    switch (role) {
      case "root":
        return "Суперадмин"
      case "admin":
        return "Администратор"
      case "ld":
        return `Лидер${cityLabel}`
      case "cc":
        return `СС${cityLabel}`
      case "user":
        return `Участник${cityLabel}`
      default:
        return role
    }
  }

  const getActionTypeLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      create: "Создание",
      update: "Обновление",
      delete: "Удаление",
      role_change: "Изменение роли",
      deactivate: "Деактивация",
      restore: "Восстановление",
      login: "Вход",
      logout: "Выход",
      other: "Другое",
    }
    return labels[actionType] || actionType
  }

  const canUndo = (log: ActionLog) => {
    // Root может отменять действия всех пользователей
    if (currentUser?.role === "root") {
      if (log.undone) return false
      // Исключаем действия входа/выхода, которые отменять не имеет смысла
      return ["deactivate", "restore", "role_change", "update", "create", "delete"].includes(log.action_type)
    }
    // Обычные пользователи могут отменять только свои действия
    if (log.user_id !== currentUser?.id) return false
    if (log.undone) return false
    return ["deactivate", "restore", "role_change", "update"].includes(log.action_type)
  }

  const activeUsers = users.filter((u) => u.status === "active")
  const inactiveUsers = users.filter((u) => u.status === "inactive")
  const requestUsers = users.filter((u) => u.status === "request")

  // Фильтруем пользователей в зависимости от роли текущего пользователя
  const getFilteredUsersByRole = (usersList: UserType[]) => {
    if (currentUser?.role === "ld") {
      // Лидер видит cc, user и других лидеров (включая себя)
      return usersList.filter((u) => u.role === "cc" || u.role === "user" || u.role === "ld")
    }
    if (currentUser?.role === "admin") {
      // Админ видит всех активных, но в запросах только cc, user и ld (не admin и root)
      if (usersList === requestUsers) {
        return usersList.filter((u) => u.role === "cc" || u.role === "user" || u.role === "ld")
      }
      return usersList
    }
    // Root видит всех
    return usersList
  }

  const filteredUsers = activeTab === 'active' 
    ? getFilteredUsersByRole(activeUsers)
    : activeTab === 'inactive' 
    ? getFilteredUsersByRole(inactiveUsers)
    : getFilteredUsersByRole(requestUsers)

  if (loading) {
    return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-muted-foreground"/>
              <span className="text-sm text-muted-foreground">Всего пользователей</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">{users.length}</div>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500"/>
              <span className="text-sm text-muted-foreground">Активные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">{activeUsers.length}</div>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <EyeOff className="w-6 h-6 text-destructive"/>
              <span className="text-sm text-muted-foreground">Неактивные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">{inactiveUsers.length}</div>
          </div>
        </div>
        {(currentUser?.role === "root" || currentUser?.role === "admin" || currentUser?.role === "ld") && getFilteredUsersByRole(requestUsers).length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            <button
                onClick={() => setActiveTab('requests')}
                className="bg-card border-2 border-yellow-500/30 rounded-lg p-4 transition-all hover:border-yellow-500/50 hover:bg-yellow-500/5 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400"/>
                <span className="text-sm text-muted-foreground">Запросы на создание аккаунта</span>
              </div>
              <div className="text-3xl font-semibold text-foreground">{getFilteredUsersByRole(requestUsers).length}</div>
              <p className="text-xs text-muted-foreground mt-2">Нажмите для просмотра</p>
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-destructive"/>
              <span className="text-sm text-muted-foreground">Администраторы</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">
              {users.filter((u) => (  u.role === "admin" || u.role === "root")  && u.status === "active").length}
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-pink-500"/>
              <span className="text-sm text-muted-foreground">Лидеры</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">
              {users.filter((u) => u.role === "ld" && u.status === "active").length}
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <UserCog className="w-5 h-5 text-primary"/>
              <span className="text-sm text-muted-foreground">CC аккаунты</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">{users.filter((u) => u.role === "cc" && u.status === "active").length}</div>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-500"/>
              <span className="text-sm text-muted-foreground">Обычные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">{users.filter((u) => u.role === "user" && u.status === "active").length}</div>
          </div>
        </div>

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

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            <UserPlus className="w-5 h-5"/>
            Создать пользователя
          </button>

          <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
          >
            <RotateCcw className="w-5 h-5"/>
            Обновить
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-border">
          <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
                  activeTab === 'active'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Активные ({activeUsers.length})
          </button>

          {(currentUser?.role === "root" || currentUser?.role === "admin" || currentUser?.role === "ld") && (
              <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
                      activeTab === 'requests'
                          ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Запросы ({getFilteredUsersByRole(requestUsers).length})
              </button>
          )}

          {currentUser?.role === "root" && (
              <button
                  onClick={() => setActiveTab('inactive')}
                  className={`px-4 py-2 font-medium transition-all border-b-2 -mb-0.5 ${
                      activeTab === 'inactive'
                          ? 'border-destructive text-destructive'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Неактивные ({inactiveUsers.length})
              </button>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-card/50 rounded-lg border-2 border-border overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Игровой ник
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Логин
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Действия
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                  <tr
                      key={user.id}
                      className={`hover:bg-muted/30 transition-colors ${
                          user.status !== "active" ? "opacity-60" : ""
                      }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">{user.game_nick}</span>
                        {user.status === "inactive" && (
                            <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                          Деактивирован
                        </span>
                        )}
                        {user.status === "request" && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                          Запрос
                        </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.role
                        )}`}
                    >
                      {getRoleLabel(user.role, user.city)}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === "active" ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4"/>
                        Активен
                      </span>
                      ) : user.status === "request" ? (
                          <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4"/>
                        Запрос
                      </span>
                      ) : (
                          <span className="text-destructive flex items-center gap-1">
                        <X className="w-4 h-4"/>
                        Неактивен
                      </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                      {new Date(user.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Кнопки для запросов на создание аккаунта */}
                        {user.status === "request" && (
                            <>
                              {/* Root видит все запросы */}
                              {currentUser?.role === "root" && (
                                <>
                                  <button
                                      onClick={() => handleApproveRequest(user.id, user.game_nick)}
                                      className="text-green-600 dark:text-green-400 hover:opacity-70 transition-all"
                                      title="Одобрить запрос"
                                  >
                                    <CheckCircle className="w-5 h-5"/>
                                  </button>
                                  <button
                                      onClick={() => handleRejectRequest(user.id, user.game_nick)}
                                      className="text-destructive hover:opacity-70 transition-all"
                                      title="Отклонить запрос"
                                  >
                                    <X className="w-5 h-5"/>
                                  </button>
                                </>
                              )}
                              {/* Admin может одобрять/отклонять cc, user и ld */}
                              {currentUser?.role === "admin" && (user.role === "cc" || user.role === "user" || user.role === "ld") && (
                                <>
                                  <button
                                      onClick={() => handleApproveRequest(user.id, user.game_nick)}
                                      className="text-green-600 dark:text-green-400 hover:opacity-70 transition-all"
                                      title="Одобрить запрос"
                                  >
                                    <CheckCircle className="w-5 h-5"/>
                                  </button>
                                  <button
                                      onClick={() => handleRejectRequest(user.id, user.game_nick)}
                                      className="text-destructive hover:opacity-70 transition-all"
                                      title="Отклонить запрос"
                                  >
                                    <X className="w-5 h-5"/>
                                  </button>
                                </>
                              )}
                              {/* LD может одобрять/отклонять только cc и user */}
                              {currentUser?.role === "ld" && (user.role === "cc" || user.role === "user") && (
                                <>
                                  <button
                                      onClick={() => handleApproveRequest(user.id, user.game_nick)}
                                      className="text-green-600 dark:text-green-400 hover:opacity-70 transition-all"
                                      title="Одобрить запрос"
                                  >
                                    <CheckCircle className="w-5 h-5"/>
                                  </button>
                                  <button
                                      onClick={() => handleRejectRequest(user.id, user.game_nick)}
                                      className="text-destructive hover:opacity-70 transition-all"
                                      title="Отклонить запрос"
                                  >
                                    <X className="w-5 h-5"/>
                                  </button>
                                </>
                              )}
                            </>
                        )}

                        {/* Показываем кнопки только для активных пользователей и не для root (кроме случая редактирования себя) */}
                        {user.status === "active" && user.role !== "root" && (
                            <>
                              {/* Кнопка редактирования: root видит всех, admin/ld видят себя и подчиненных */}
                              {(currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && (currentUser?.id === user.id || user.role !== "admin")) ||
                                  (currentUser?.role === "ld" && (currentUser?.id === user.id || user.role === "cc" || user.role === "user"))) && (
                                  <button
                                      onClick={() => openEditModal(user)}
                                      className="text-primary hover:opacity-70 transition-all"
                                      title="Редактировать"
                                  >
                                    <Edit className="w-5 h-5"/>
                                  </button>
                              )}

                              {/* Кнопка изменения роли: только root или admin для не-админов, но не для себя */}
                              {(currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && user.role !== "admin")) &&
                                  currentUser?.id !== user.id && (
                                  <button
                                      onClick={() => openRoleModal(user)}
                                      className="text-purple-600 dark:text-purple-400 hover:opacity-70 transition-all"
                                      title="Изменить роль"
                                  >
                                    <Shield className="w-5 h-5"/>
                                  </button>
                              )}

                              {/* Кнопка изменения города: только root или admin для не-админов, но не для себя */}
                              {(currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && user.role !== "admin")) &&
                                  currentUser?.id !== user.id && (
                                  <button
                                      onClick={() => openCityModal(user)}
                                      className="text-blue-600 dark:text-blue-400 hover:opacity-70 transition-all"
                                      title="Изменить город"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                      <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                  </button>
                              )}

                              {/* Кнопка деактивации: root/admin для не-админов, ld для cc и user, но не для себя */}
                              {((currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && user.role !== "admin") ||
                                  (currentUser?.role === "ld" && (user.role === "cc" || user.role === "user"))) &&
                                  currentUser?.id !== user.id) && (
                                  <button
                                      onClick={() => handleDeactivateUser(user.id, user.game_nick)}
                                      className="text-destructive hover:opacity-70 transition-all"
                                      title="Деактивировать"
                                  >
                                    <Trash2 className="w-5 h-5"/>
                                  </button>
                              )}
                            </>
                        )}

                        {/* Восстановление и окончательное удаление неактивных - только root */}
                        {user.status === "inactive" && currentUser?.role === "root" && (
                            <>
                              <button
                                  onClick={() => handleRestoreUser(user.id, user.game_nick)}
                                  className="text-green-600 dark:text-green-400 hover:opacity-70 transition-all"
                                  title="Восстановить"
                              >
                                <RotateCcw className="w-5 h-5"/>
                              </button>
                              <button
                                  onClick={() => handlePermanentDelete(user.id, user.game_nick)}
                                  className="text-destructive hover:opacity-70 transition-all"
                                  title="Удалить окончательно"
                              >
                                <Trash2 className="w-5 h-5"/>
                              </button>
                            </>
                        )}
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                  className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-popover-foreground">Создать пользователя</h3>
                  <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setFormData({username: "", gameNick: "", password: "", role: "user", city: "CGB-N"})
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Игровой ник
                    </label>
                    <input
                        type="text"
                        value={formData.gameNick}
                        onChange={(e) => setFormData({...formData, gameNick: e.target.value})}
                        className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Логин
                    </label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Пароль
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        required
                        minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Роль
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    >
                      <option value="user">Пользователь</option>
                      <option value="cc">CC</option>
                      {/* Лидер не может создавать других лидеров */}
                      {currentUser?.role !== "ld" && (
                        <option value="ld">Лидер</option>
                      )}
                      {currentUser?.role === "root" && (
                          <>
                            <option value="admin">Администратор</option>
                          </>
                      )}
                    </select>
                  </div>

                  {/* City selector - root/admin can choose, ld sees their city (disabled) */}
                  {(currentUser?.role === "root" || currentUser?.role === "admin" || currentUser?.role === "ld") && (
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Город
                      </label>
                      <select
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value as "CGB-N" | "CGB-P" | "OKB-M"})}
                          className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                          disabled={currentUser?.role === "ld"}
                      >
                        <option value="CGB-N">ЦГБ-Н</option>
                        <option value="CGB-P">ЦГБ-П</option>
                        <option value="OKB-M">ОКБ-М</option>
                      </select>
                      {currentUser?.role === "ld" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Вы можете создавать пользователей только для своего города
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
                    >
                      <Save className="w-5 h-5"/>
                      Сохранить
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false)
                          setFormData({username: "", gameNick: "", password: "", role: "user", city: "CGB-N"})
                        }}
                        className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-popover border-2 border-border rounded-lg max-w-md w-full p-6 transition-colors">
                <h3 className="text-xl font-semibold text-popover-foreground mb-4">Редактировать пользователя</h3>
                <form onSubmit={handleEditUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Имя пользователя</label>
                    <input
                        type="text"
                        value={editUser.username}
                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        className="w-full px-3 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        disabled={loading}
                        minLength={3}
                        maxLength={50}
                        placeholder="Логин для входа"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      <div className="flex items-center gap-2">
                        <Gamepad className="w-4 h-4" />
                        Игровой ник
                      </div>
                    </label>
                    <input
                        type="text"
                        value={editUser.gameNick}
                        onChange={(e) => setEditUser({ ...editUser, gameNick: e.target.value })}
                        className="w-full px-3 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono transition-colors"
                        disabled={loading}
                        placeholder="Polter_Sokirovskiy"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Формат: Имя_Фамилия (только английские буквы)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Новый пароль (опционально)</label>
                    <input
                        type="password"
                        value={editUser.password}
                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                        className="w-full px-3 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        disabled={loading}
                        minLength={6}
                        placeholder="Оставьте пустым, чтобы не менять"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Оставьте пустым, если не хотите менять пароль</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Сохранение...
                          </>
                      ) : (
                          "Сохранить"
                      )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false)
                          setEditUser({ id: "", username: "", gameNick: "", password: "", role: "user" })
                        }}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-all disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Change Role Modal */}
        {showRoleModal && changingRoleUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                  className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-popover-foreground">
                    Изменить роль: {changingRoleUser.game_nick}
                  </h3>
                  <button
                      onClick={() => {
                        setShowRoleModal(false)
                        setChangingRoleUser(null)
                        setFormData({username: "", gameNick: "", password: "", role: "user", city: "CGB-N"})
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <form onSubmit={handleChangeRole} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Текущая роль
                    </label>
                    <div className="px-4 py-2 bg-muted border-2 border-border rounded-lg">
                  <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          changingRoleUser.role
                      )}`}
                  >
                    {getRoleLabel(changingRoleUser.role)}
                  </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Новая роль
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    >
                      <option value="user">Пользователь</option>
                      <option value="cc">CC</option>
                      <option value="ld">Лидер</option>
                      {currentUser?.role === "root" && (
                          <>
                            <option value="admin">Администратор</option>
                          </>
                      )}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      <Shield className="w-5 h-5"/>
                      Изменить роль
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowRoleModal(false)
                          setChangingRoleUser(null)
                          setFormData({username: "", gameNick: "", password: "", role: "user", city: "CGB-N"})
                        }}
                        className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* City Change Modal */}
        {showCityModal && changingCityUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                  className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-popover-foreground">
                    Изменить город: {changingCityUser.game_nick}
                  </h3>
                  <button
                      onClick={() => {
                        setShowCityModal(false)
                        setChangingCityUser(null)
                        setFormData({username: "", gameNick: "", password: "", role: "user", city: "CGB-N"})
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <form onSubmit={handleChangeCity} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Текущий город
                    </label>
                    <div className="px-4 py-3 bg-muted rounded-lg text-foreground">
                      {getCityLabel(changingCityUser.city)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Новый город
                    </label>
                    <select
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value as "CGB-N" | "CGB-P" | "OKB-M"})}
                        className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    >
                      <option value="CGB-N">ЦГБ-Н</option>
                      <option value="CGB-P">ЦГБ-П</option>
                      <option value="OKB-M">ОКБ-М</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Изменить город
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowCityModal(false)
                          setChangingCityUser(null)
                          setFormData({username: "", gameNick: "", password: "", role: "user", city: "CGB-N"})
                        }}
                        className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

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
                    {confirmModal.confirmText || 'Подтвердить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
      </div>
  )
}