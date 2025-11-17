import React from "react"
import { UserPlus, RotateCcw } from "lucide-react"

interface UserActionsProps {
  onCreateUser: () => void
  onRefresh: () => void
}

export const UserActions: React.FC<UserActionsProps> = ({ onCreateUser, onRefresh }) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <button
        onClick={onCreateUser}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
      >
        <UserPlus className="w-5 h-5"/>
        Создать пользователя
      </button>

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