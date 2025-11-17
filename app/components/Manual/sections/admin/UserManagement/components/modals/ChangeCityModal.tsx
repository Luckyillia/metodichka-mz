import React from "react"
import { X } from "lucide-react"
import type { User as UserType } from "@/lib/auth/types"
import type { UserFormData } from "../../types"
import { getCityLabel } from "../../utils/userHelpers"

interface ChangeCityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  user: UserType | null
  formData: UserFormData
  onChange: (data: Partial<UserFormData>) => void
}

export const ChangeCityModal: React.FC<ChangeCityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  formData,
  onChange
}) => {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg border-2 border-border p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-popover-foreground">
            Изменить город: {user.game_nick}
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
              value={formData.city}
              onChange={(e) => onChange({ city: e.target.value as "CGB-N" | "CGB-P" | "OKB-M" })}
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