import React from "react"
import { Users, CheckCircle, EyeOff, Shield, Star, UserCog, AlertCircle } from "lucide-react"

interface UserStatsProps {
  stats: {
    total: number
    active: number
    inactive: number
    requests: number
    admins: number
    leaders: number
    cc: number
    regularUsers: number
  }
  onRequestsClick?: () => void
  showRequestsButton?: boolean
}

export const UserStats: React.FC<UserStatsProps> = ({ stats, onRequestsClick, showRequestsButton }) => {
  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-muted-foreground"/>
            <span className="text-sm text-muted-foreground">Всего пользователей</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.total}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500"/>
            <span className="text-sm text-muted-foreground">Активные пользователи</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.active}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <EyeOff className="w-6 h-6 text-destructive"/>
            <span className="text-sm text-muted-foreground">Неактивные пользователи</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.inactive}</div>
        </div>
      </div>

      {/* Requests Button */}
      {showRequestsButton && stats.requests > 0 && (
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={onRequestsClick}
            className="bg-card border-2 border-yellow-500/30 rounded-lg p-4 transition-all hover:border-yellow-500/50 hover:bg-yellow-500/5 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400"/>
              <span className="text-sm text-muted-foreground">Запросы на создание аккаунта</span>
            </div>
            <div className="text-3xl font-semibold text-foreground">{stats.requests}</div>
            <p className="text-xs text-muted-foreground mt-2">Нажмите для просмотра</p>
          </button>
        </div>
      )}

      {/* Role Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-destructive"/>
            <span className="text-sm text-muted-foreground">Администраторы</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.admins}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-pink-500"/>
            <span className="text-sm text-muted-foreground">Лидеры</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.leaders}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-5 h-5 text-primary"/>
            <span className="text-sm text-muted-foreground">CC аккаунты</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.cc}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-500"/>
            <span className="text-sm text-muted-foreground">Обычные пользователи</span>
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.regularUsers}</div>
        </div>
      </div>
    </div>
  )
}