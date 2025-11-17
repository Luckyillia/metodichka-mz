// app/components/Manual/sections/admin/UserManagement/components/modals/ChangeRoleModal.tsx (обновлённая)
import React from "react"
import { X, Shield } from "lucide-react"
import type { User as UserType } from "@/lib/auth/types"
import type { UserFormData } from "../../types"
import { getRoleBadgeColor, getRoleLabel } from "../../utils/userHelpers"

interface ChangeRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  user: UserType | null
  formData: UserFormData
  onChange: (data: Partial<UserFormData>) => void
  currentUserRole?: string
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  formData,
  onChange,
  currentUserRole
}) => {
  if (!isOpen || !user) return null

  const isRoot = currentUserRole === "root"
  const isAdmin = currentUserRole === "admin"
  const isLeader = currentUserRole === "ld"

  // Определяем доступные роли в зависимости от текущей роли пользователя
  const getAvailableRoles = () => {
    if (isRoot) {
      // Root может назначать любые роли кроме root
      return [
        { value: "user", label: "Пользователь" },
        { value: "cc", label: "CC" },
        { value: "ld", label: "Лидер" },
        { value: "admin", label: "Администратор" }
      ]
    }
    
    if (isAdmin) {
      // Админ может назначать user, cc, ld
      return [
        { value: "user", label: "Пользователь" },
        { value: "cc", label: "CC" },
        { value: "ld", label: "Лидер" }
      ]
    }
    
    if (isLeader) {
      // Лидер может переключать между user и cc
      return [
        { value: "user", label: "Пользователь" },
        { value: "cc", label: "CC" }
      ]
    }

    return []
  }

  const availableRoles = getAvailableRoles()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-popover-foreground">
            Изменить роль: {user.game_nick}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6"/>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Текущая роль
            </label>
            <div className="px-4 py-2 bg-muted border-2 border-border rounded-lg">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Новая роль
            </label>
            <select
              value={formData.role}
              onChange={(e) => onChange({ role: e.target.value })}
              className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              {availableRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            
            {isLeader && (
              <p className="text-xs text-muted-foreground mt-2">
                Вы можете назначать только роли Пользователь и CC
              </p>
            )}
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
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}