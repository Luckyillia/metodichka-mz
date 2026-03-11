import React from "react"
import {
  BarChart2,
  Users,
  ShieldAlert,
  TrendingUp,
  Activity,
} from "lucide-react"
import type { ActionLogStats as StatsType } from "../types"
import { getActionTypeColor } from "../utils"

interface ActionLogStatsProps {
  stats: StatsType
  isLoading?: boolean
}

const SkeletonCard = () => (
  <div className="bg-card border-2 border-border rounded-lg p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg bg-muted" />
      <div className="h-3 w-28 bg-muted rounded" />
    </div>
    <div className="h-8 w-16 bg-muted rounded" />
  </div>
)

export const ActionLogStats: React.FC<ActionLogStatsProps> = ({ stats, isLoading }) => {
  // ─── BUG FIX: правильная высота баров — px, не % от % ───
  const maxWeekCount = Math.max(...stats.weeklyActivity.map((d) => d.count), 1)
  const BAR_MAX_HEIGHT = 64 // px

  // Макс для прогресс-баров топ действий
  const maxActionCount = stats.topActions[0]?.count || 1

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-card border-2 border-border rounded-lg p-5 animate-pulse h-48" />
          ))}
        </div>
        <div className="bg-card border-2 border-border rounded-lg p-5 animate-pulse h-36" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* KPI карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Всего записей</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.total.toLocaleString("ru-RU")}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Активных польз.</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.activeUsers}</div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Критических</span>
          </div>
          <div className="text-3xl font-bold text-destructive">{stats.criticalActions}</div>
          {stats.total > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.criticalActions / stats.total) * 100).toFixed(1)}% от всех
            </p>
          )}
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-4 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Сегодня</span>
          </div>
          <div className="text-3xl font-bold text-green-500">{stats.todayActions}</div>
        </div>
      </div>

      {/* Топ действий + Самые активные */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Actions — с прогресс-барами */}
        <div className="bg-card border-2 border-border rounded-lg p-5 transition-colors">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Топ действий
          </h3>
          <div className="space-y-3">
            {stats.topActions.length === 0 ? (
              <p className="text-xs text-muted-foreground">Нет данных</p>
            ) : (
              stats.topActions.map((action) => {
                const pct = Math.round((action.count / maxActionCount) * 100)
                return (
                  <div key={action.icon} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${getActionTypeColor(action.icon)}`} />
                        <span className="text-sm text-foreground">{action.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">{action.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getActionTypeColor(action.icon)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-card border-2 border-border rounded-lg p-5 transition-colors">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Самые активные
          </h3>
          <div className="space-y-2">
            {stats.mostActiveUsers.length === 0 ? (
              <p className="text-xs text-muted-foreground">Нет данных</p>
            ) : (
              stats.mostActiveUsers.map((u, idx) => {
                const medals = ["🥇", "🥈", "🥉"]
                return (
                  <div
                    key={u.name}
                    className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-6 text-center">
                        {medals[idx] ?? <span className="text-xs text-muted-foreground">{idx + 1}.</span>}
                      </span>
                      <span className="text-sm text-foreground">{u.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{u.count} действий</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Weekly Activity — исправленный бар-чарт */}
      <div className="bg-card border-2 border-border rounded-lg p-5 transition-colors">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Активность за 7 дней
        </h3>
        <div className="flex items-end gap-2" style={{ height: `${BAR_MAX_HEIGHT + 36}px` }}>
          {stats.weeklyActivity.map((day, idx) => {
            // ─── BUG FIX: высота в px, не % от % ───
            const barHeight = maxWeekCount > 0
              ? Math.max(Math.round((day.count / maxWeekCount) * BAR_MAX_HEIGHT), day.count > 0 ? 4 : 0)
              : 0
            const isToday = idx === 6

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{day.count > 0 ? day.count : ""}</span>
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: `${BAR_MAX_HEIGHT}px` }}
                >
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      isToday ? "bg-primary" : "bg-primary/40 hover:bg-primary/70"
                    }`}
                    style={{ height: `${barHeight}px` }}
                    title={`${day.day}: ${day.count}`}
                  />
                </div>
                <span className={`text-xs ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {day.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}