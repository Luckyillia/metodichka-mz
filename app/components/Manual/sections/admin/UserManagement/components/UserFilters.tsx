import React from "react"
import { Filter } from "lucide-react"
import type { UserCity } from "@/lib/auth/types"

interface UserFiltersProps {
  filterRole: string
  filterCity: string
  onFilterRoleChange: (role: string) => void
  onFilterCityChange: (city: string) => void
  currentUserRole?: string
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filterRole,
  filterCity,
  onFilterRoleChange,
  onFilterCityChange,
  currentUserRole
}) => {
  const isLeader = currentUserRole === "ld"

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Фильтры</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Фильтр по роли */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Роль
          </label>
          <select
            value={filterRole}
            onChange={(e) => onFilterRoleChange(e.target.value)}
            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            <option value="all">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="cc">CC</option>
            {!isLeader && <option value="ld">Лидер</option>}
            {!isLeader && <option value="admin">Администратор</option>}
            {currentUserRole === "root" && <option value="root">Root</option>}
          </select>
        </div>

        {/* Фильтр по городу */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Город
          </label>
          <select
            value={filterCity}
            onChange={(e) => onFilterCityChange(e.target.value)}
            className="w-full px-4 py-2 bg-input border-2 border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            <option value="all">Все города</option>
            <option value="CGB-N">ЦГБ-Н</option>
            <option value="CGB-P">ЦГБ-П</option>
            <option value="OKB-M">ОКБ-М</option>
          </select>
        </div>
      </div>

      {/* Индикатор активных фильтров */}
      {(filterRole !== "all" || filterCity !== "all") && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Активные фильтры:</span>
          {filterRole !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded text-xs">
              Роль: {filterRole}
              <button
                onClick={() => onFilterRoleChange("all")}
                className="hover:opacity-70"
              >
                ✕
              </button>
            </span>
          )}
          {filterCity !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded text-xs">
              Город: {filterCity}
              <button
                onClick={() => onFilterCityChange("all")}
                className="hover:opacity-70"
              >
                ✕
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onFilterRoleChange("all");
              onFilterCityChange("all");
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Сбросить все
          </button>
        </div>
      )}
    </div>
  );
}