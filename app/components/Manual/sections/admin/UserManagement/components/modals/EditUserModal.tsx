import React from "react"
import { X, Loader2, Gamepad } from "lucide-react"
import type { EditUserData } from "../../types"

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  editUser: EditUserData
  onChange: (data: Partial<EditUserData>) => void
  loading: boolean
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editUser,
  onChange,
  loading
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-popover border-2 border-border rounded-lg max-w-md w-full p-6 transition-colors">
        <h3 className="text-xl font-semibold text-popover-foreground mb-4">Редактировать пользователя</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Имя пользователя</label>
            <input
              type="text"
              value={editUser.username}
              onChange={(e) => onChange({ username: e.target.value })}
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
              onChange={(e) => onChange({ gameNick: e.target.value })}
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
              onChange={(e) => onChange({ password: e.target.value })}
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
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-all disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}