import React from "react"
import { Filter, Search, Calendar, RotateCcw, User } from "lucide-react"
import type { ActionLogFilters as FiltersType } from "../types"

interface ActionLogFiltersProps {
  filters: FiltersType
  onUpdate: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void
  onReset: () => void
}

export const ActionLogFilters: React.FC<ActionLogFiltersProps> = ({ filters, onUpdate, onReset }) => {
  return (
    <div className="bg-card/50 rounded-lg p-6 border-2 border-border transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Фильтры
        </h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Сбросить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Поиск — на всю ширину */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Поиск в логах
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onUpdate("searchQuery", e.target.value)}
              placeholder="Поиск по действию, пользователю..."
              className="w-full pl-9 pr-4 py-2 bg-input border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        </div>

        {/* Тип действия */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Тип действия
          </label>
          <select
            value={filters.actionType}
            onChange={(e) => onUpdate("actionType", e.target.value)}
            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            <option value="all">Все действия</option>
            <option value="create">Создание</option>
            <option value="update">Обновление</option>
            <option value="delete">Удаление</option>
            <option value="role_change">Смена роли</option>
            <option value="login">Вход</option>
            <option value="logout">Выход</option>
            <option value="deactivate">Деактивация</option>
            <option value="restore">Восстановление</option>
            <option value="other">Другое</option>
          </select>
        </div>

        {/* Целевой объект */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Целевой объект
          </label>
          <select
            value={filters.targetType}
            onChange={(e) => onUpdate("targetType", e.target.value)}
            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            <option value="all">Все объекты</option>
            <option value="user">Пользователь</option>
            <option value="system">Система</option>
            <option value="report">Отчет</option>
            <option value="other">Другое</option>
          </select>
        </div>

        {/* Кто выполнил */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Кто выполнил
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={filters.performedBy === "all" ? "" : filters.performedBy}
              onChange={(e) => onUpdate("performedBy", e.target.value || "all")}
              placeholder="Все пользователи"
              className="w-full pl-9 pr-4 py-2 bg-input border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        </div>

        {/* Дата от */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Дата от
            </span>
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onUpdate("dateFrom", e.target.value)}
            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>

        {/* Дата до */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Дата до
            </span>
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onUpdate("dateTo", e.target.value)}
            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>

      </div>
    </div>
  )
}