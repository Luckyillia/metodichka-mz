import React from "react"
import { X, Save, Gamepad } from "lucide-react"
import type { UserFormData } from "../../types"
import { getCityLabel } from "../../utils/userHelpers"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: UserFormData
  onChange: (data: Partial<UserFormData>) => void
  currentUserRole?: string
  currentUserCity?: string
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  currentUserRole,
  currentUserCity
}) => {
  if (!isOpen) return null

  const isLeader = currentUserRole === "ld"
  const isRoot = currentUserRole === "root"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-popover-foreground">Создать пользователя</h3>
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
              <div className="flex items-center gap-2">
                <Gamepad className="w-4 h-4" />
                Игровой ник
              </div>
            </label>
            <input
              type="text"
              value={formData.gameNick}
              onChange={(e) => onChange({ gameNick: e.target.value })}
              className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors font-mono"
              placeholder="Polter_Sokirovskiy"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Формат: Имя_Фамилия (только английские буквы)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Логин
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => onChange({ username: e.target.value })}
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
              onChange={(e) => onChange({ password: e.target.value })}
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
              onChange={(e) => onChange({ role: e.target.value })}
              className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="user">Пользователь</option>
              {(isRoot || isLeader) && <option value="instructor">Инструктор</option>}
              <option value="cc">CC</option>
              {!isLeader && <option value="ld">Лидер</option>}
              {isRoot && <option value="admin">Администратор</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Город
            </label>
            <select
              value={formData.city}
              onChange={(e) => onChange({ city: e.target.value as "CGB-N" | "CGB-P" | "OKB-M" })}
              className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              disabled={isLeader}
            >
              <option value="CGB-N">ЦГБ-Н</option>
              <option value="CGB-P">ЦГБ-П</option>
              <option value="OKB-M">ОКБ-М</option>
            </select>
            {isLeader && (
              <p className="text-xs text-muted-foreground mt-1">
                Вы можете создавать пользователей только для своего города
              </p>
            )}
          </div>

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