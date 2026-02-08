import React from "react"
import { UserPlus, RotateCcw, ImageOff, X, CheckCircle, RotateCcw as RestoreIcon, Trash2 } from "lucide-react"
import type { UserTab } from "../types"

interface UserActionsProps {
  onCreateUser: () => void
  onRefresh: () => void
  activeTab?: UserTab
  currentUserRole?: string
  selectedCount?: number
  onBulkResetAvatar?: () => void
  onBulkApproveAvatars?: () => void
  onBulkRejectAvatars?: () => void
  onBulkApproveRequests?: () => void
  onBulkRestoreInactive?: () => void
  onBulkPermanentDelete?: () => void
  onBulkDeactivateActive?: () => void
  onClearSelection?: () => void
  canBulkResetAvatar?: boolean
}

export const UserActions: React.FC<UserActionsProps> = ({
  onCreateUser,
  onRefresh,
  activeTab = 'active',
  currentUserRole,
  selectedCount = 0,
  onBulkResetAvatar,
  onBulkApproveAvatars,
  onBulkRejectAvatars,
  onBulkApproveRequests,
  onBulkRestoreInactive,
  onBulkPermanentDelete,
  onBulkDeactivateActive,
  onClearSelection,
  canBulkResetAvatar = false,
}) => {
  const canApproveAll = activeTab === 'requests' && !!onBulkApproveRequests && (currentUserRole === 'root' || currentUserRole === 'admin' || currentUserRole === 'ld')
  const canRestoreAll = activeTab === 'inactive' && !!onBulkRestoreInactive && currentUserRole === 'root'
  const canDeleteAll = activeTab === 'inactive' && !!onBulkPermanentDelete && currentUserRole === 'root'
  const canDeactivateAll = activeTab === 'active' && !!onBulkDeactivateActive && (currentUserRole === 'root' || currentUserRole === 'admin' || currentUserRole === 'ld')
  const canModerateAvatars = activeTab === 'moderation' && (currentUserRole === 'root' || currentUserRole === 'admin' || currentUserRole === 'ld')

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">

      <button
        onClick={onCreateUser}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
      >
        <UserPlus className="w-5 h-5"/>
        Создать пользователя
      </button>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Выбрано: {selectedCount}</span>

          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
          >
            <X className="w-4 h-4"/>
            Снять выбор
          </button>

          {canModerateAvatars && !!onBulkApproveAvatars && (
            <button
              onClick={onBulkApproveAvatars}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Одобрить аватары
            </button>
          )}

          {canModerateAvatars && !!onBulkRejectAvatars && (
            <button
              onClick={onBulkRejectAvatars}
              className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <ImageOff className="w-4 h-4" />
              Отклонить аватары
            </button>
          )}

          {canBulkResetAvatar && (
            <button
              onClick={onBulkResetAvatar}
              className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <ImageOff className="w-4 h-4"/>
              Сбросить аватары
            </button>
          )}

          {canApproveAll && (
            <button
              onClick={onBulkApproveRequests}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Одобрить всех
            </button>
          )}

          {canRestoreAll && (
            <button
              onClick={onBulkRestoreInactive}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <RestoreIcon className="w-4 h-4" />
              Восстановить
            </button>
          )}

          {canDeleteAll && (
            <button
              onClick={onBulkPermanentDelete}
              className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Удалить навсегда
            </button>
          )}

          {canDeactivateAll && (
            <button
              onClick={onBulkDeactivateActive}
              className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Деактивировать
            </button>
          )}
        </div>
      )}

      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
      >
        <RotateCcw className="w-5 h-5"/>
        Обновить
      </button>
    </div>
  )
}