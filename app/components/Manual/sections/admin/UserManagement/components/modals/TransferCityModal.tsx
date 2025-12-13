import React from "react"
import { X, AlertTriangle, MapPin } from "lucide-react"
import type { User as UserType } from "@/lib/auth/types"
import { getCityLabel } from "../../utils/userHelpers"

interface TransferCityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  user: UserType | null
  newCity: string
  onChange: (city: string) => void
  currentUserRole?: string
}

export const TransferCityModal: React.FC<TransferCityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  newCity,
  onChange,
  currentUserRole
}) => {
  if (!isOpen || !user) return null

  const isLeader = currentUserRole === "ld"
  const availableCities = ["CGB-N", "CGB-P", "OKB-M"].filter(city => city !== user.city)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-popover-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Переместить игрока: {user.game_nick}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6"/>
          </button>
        </div>

        {isLeader && (
          <div className="mb-4 p-4 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                ВНИМАНИЕ! Необратимое действие
              </p>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80">
                После перемещения игрока в другой город вы не сможете вернуть его обратно. 
                Только администраторы могут отменить это действие.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Текущий город
            </label>
            <div className="px-4 py-3 bg-muted rounded-lg text-foreground">
              {getCityLabel(user.city)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Новый город
            </label>
            <select
              value={newCity}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="">Выберите город...</option>
              {availableCities.map(city => (
                <option key={city} value={city}>
                  {getCityLabel(city)}
                </option>
              ))}
            </select>
          </div>

          {newCity && (
            <div className="p-3 bg-blue-500/10 border-2 border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Игрок {user.game_nick} будет перемещен из {getCityLabel(user.city)} в {getCityLabel(newCity as any)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!newCity}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLeader 
                  ? 'bg-yellow-600 dark:bg-yellow-500 text-white hover:opacity-90'
                  : 'bg-blue-600 dark:bg-blue-500 text-white hover:opacity-90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <MapPin className="w-5 h-5"/>
              {isLeader ? 'Переместить (необратимо)' : 'Переместить игрока'}
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