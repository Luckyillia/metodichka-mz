"use client"

import React from "react"
import { Loader2, AlertCircle, CheckCircle, X } from "lucide-react"
import { useUserManagement } from "./hooks/useUserManagement"
import { useUserFilters } from "./hooks/useUserFilters"
import { UserStats } from "./components/UserStats"
import { UserActions } from "./components/UserActions"
import { UserTabs } from "./components/UserTabs"
import { UserTable } from "./components/UserTable"
import { UserFilters } from "./components/UserFilters"
import { CreateUserModal } from "./components/modals/CreateUserModal"
import { EditUserModal } from "./components/modals/EditUserModal"
import { ChangeRoleModal } from "./components/modals/ChangeRoleModal"
import { ChangeCityModal } from "./components/modals/ChangeCityModal"
import { TransferCityModal } from "./components/modals/TransferCityModal"
import { ConfirmModal } from "./components/modals/ConfirmModal"
import { AuthService } from "@/lib/auth/auth-service"
import type { User as UserType } from "@/lib/auth/types"

const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    error,
    success,
    activeTab,
    currentUser,
    showCreateModal,
    showEditModal,
    showRoleModal,
    showCityModal,
    showTransferModal,  // ДОБАВЛЕНО
    confirmModal,
    formData,
    editUser,
    changingRoleUser,
    changingCityUser,
    transferringUser,  // ДОБАВЛЕНО
    transferNewCity,   // ДОБАВЛЕНО
    filterRole,
    filterCity,
    setError,
    setSuccess,
    setActiveTab,
    setShowCreateModal,
    setShowEditModal,
    setShowRoleModal,
    setShowCityModal,
    setShowTransferModal,  // ДОБАВЛЕНО
    setFormData,
    setEditUser,
    setChangingRoleUser,
    setChangingCityUser,
    setTransferringUser,  // ДОБАВЛЕНО
    setTransferNewCity,   // ДОБАВЛЕНО
    setFilterRole,
    setFilterCity,
    fetchUsers,
    fetchRecentActions,
    handleCreateUser,
    handleEditUser,
    handleChangeRole,
    handleChangeCity,
    handleTransferCity,  // ДОБАВЛЕНО
    showConfirm,
    hideConfirm,
  } = useUserManagement()

  const { filteredUsers, getFilteredUsersByRole, stats } = useUserFilters(
    users,
    currentUser?.role,
    activeTab,
    filterRole,
    filterCity
  )

  const openTransferModal = (user: UserType) => {
    setTransferringUser(user)
    setTransferNewCity("")
    setShowTransferModal(true)
  }

  const handleCloseTransferModal = () => {
    setShowTransferModal(false)
    setTransferringUser(null)
    setTransferNewCity("")
  }


  const openCreateModal = () => {
    const city = currentUser?.role === "ld" ? currentUser.city : "CGB-N"
    setFormData({ username: "", gameNick: "", password: "", role: "user", city })
    setShowCreateModal(true)
  }

  const openEditModal = (user: UserType) => {
    setEditUser({
      id: user.id,
      username: user.username,
      gameNick: user.game_nick,
      password: "",
      role: user.role,
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

  const handleDeactivateUser = (userId: string, gameNick: string) => {
    showConfirm({
      title: 'Деактивация пользователя',
      message: `Вы уверены, что хотите деактивировать пользователя ${gameNick}?`,
      type: 'danger',
      confirmText: 'Деактивировать',
      onConfirm: async () => {
        hideConfirm()
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

  const handleRestoreUser = (userId: string, gameNick: string) => {
    showConfirm({
      title: 'Восстановление пользователя',
      message: `Вы уверены, что хотите восстановить пользователя ${gameNick}?`,
      type: 'info',
      confirmText: 'Восстановить',
      onConfirm: async () => {
        hideConfirm()
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

  const handlePermanentDelete = (userId: string, gameNick: string) => {
    showConfirm({
      title: 'Окончательное удаление пользователя',
      message: `ВНИМАНИЕ! Вы собираетесь ОКОНЧАТЕЛЬНО удалить пользователя ${gameNick}. Это действие НЕОБРАТИМО! Все данные пользователя будут удалены из базы данных. Продолжить?`,
      type: 'danger',
      confirmText: 'Удалить окончательно',
      onConfirm: async () => {
        hideConfirm()
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
    showConfirm({
      title: 'Одобрение запроса на аккаунт',
      message: `Вы уверены, что хотите одобрить запрос на создание аккаунта для ${gameNick}?`,
      type: 'info',
      confirmText: 'Одобрить',
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await AuthService.approveAccountRequest(userId)
          setSuccess(`Запрос на аккаунт для ${gameNick} одобрен`)
          const updatedUsers = await AuthService.getUsers()
          fetchUsers()
          fetchRecentActions()
          
          const remainingRequests = getFilteredUsersByRole(
            updatedUsers.filter((u) => u.status === "request")
          )
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
    showConfirm({
      title: 'Отклонение запроса на аккаунт',
      message: `Вы уверены, что хотите отклонить запрос на создание аккаунта для ${gameNick}? Запрос будет удален.`,
      type: 'warning',
      confirmText: 'Отклонить',
      onConfirm: async () => {
        hideConfirm()
        setError("")
        setSuccess("")

        try {
          await AuthService.rejectAccountRequest(userId)
          setSuccess(`Запрос на аккаунт для ${gameNick} отклонен`)
          const updatedUsers = await AuthService.getUsers()
          fetchUsers()
          fetchRecentActions()
          
          const remainingRequests = getFilteredUsersByRole(
            updatedUsers.filter((u) => u.status === "request")
          )
          if (remainingRequests.length === 0) {
            setActiveTab('active')
          }
        } catch (err: any) {
          setError(err.message || "Не удалось отклонить запрос")
        }
      }
    })
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditUser({ id: "", username: "", gameNick: "", password: "", role: "user" })
  }

  const handleCloseRoleModal = () => {
    setShowRoleModal(false)
    setChangingRoleUser(null)
    setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
  }

  const handleCloseCityModal = () => {
    setShowCityModal(false)
    setChangingCityUser(null)
    setFormData({ username: "", gameNick: "", password: "", role: "user", city: "CGB-N" })
  }

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
      <UserStats
        stats={stats}
        onRequestsClick={() => setActiveTab('requests')}
        showRequestsButton={
          (currentUser?.role === "root" || 
           currentUser?.role === "admin" || 
           currentUser?.role === "ld") && 
          stats.requests > 0
        }
      />

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
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border-2 border-green-500/30 rounded-lg text-green-600 dark:text-green-400 transition-colors">
          <CheckCircle className="w-5 h-5 flex-shrink-0"/>
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto hover:opacity-70 transition-opacity">
            <X className="w-5 h-5"/>
          </button>
        </div>
      )}

      {/* Actions */}
      <UserActions onCreateUser={openCreateModal} onRefresh={fetchUsers} />

      {/* Tabs */}
      <UserTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          active: stats.active,
          inactive: stats.inactive,
          requests: stats.requests,
        }}
        showInactiveTab={currentUser?.role === "root"}
        showRequestsTab={
          currentUser?.role === "root" || 
          currentUser?.role === "admin" || 
          currentUser?.role === "ld"
        }
      />

      {/* Filters */}
      <UserFilters
        filterRole={filterRole}
        filterCity={filterCity}
        onFilterRoleChange={setFilterRole}
        onFilterCityChange={setFilterCity}
        currentUserRole={currentUser?.role}
      />

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        currentUser={currentUser}
        onEdit={openEditModal}
        onChangeRole={openRoleModal}
        onChangeCity={openCityModal}
        onTransferCity={openTransferModal}  // ДОБАВЛЕНО
        onDeactivate={handleDeactivateUser}
        onRestore={handleRestoreUser}
        onPermanentDelete={handlePermanentDelete}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateUser}
        formData={formData}
        onChange={(data) => setFormData({ ...formData, ...data })}
        currentUserRole={currentUser?.role}
        currentUserCity={currentUser?.city}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleEditUser}
        editUser={editUser}
        onChange={(data) => setEditUser({ ...editUser, ...data })}
        loading={loading}
      />

      <ChangeRoleModal
        isOpen={showRoleModal}
        onClose={handleCloseRoleModal}
        onSubmit={handleChangeRole}
        user={changingRoleUser}
        formData={formData}
        onChange={(data) => setFormData({ ...formData, ...data })}
        currentUserRole={currentUser?.role}
      />

      <ChangeCityModal
        isOpen={showCityModal}
        onClose={handleCloseCityModal}
        onSubmit={handleChangeCity}
        user={changingCityUser}
        formData={formData}
        onChange={(data) => setFormData({ ...formData, ...data })}
      />

      {/* НОВЫЙ МОДАЛЬ для перемещения */}
      <TransferCityModal
        isOpen={showTransferModal}
        onClose={handleCloseTransferModal}
        onSubmit={handleTransferCity}
        user={transferringUser}
        newCity={transferNewCity}
        onChange={setTransferNewCity}
        currentUserRole={currentUser?.role}
      />

      <ConfirmModal {...confirmModal} />
    </div>
  )
}

export default UserManagement