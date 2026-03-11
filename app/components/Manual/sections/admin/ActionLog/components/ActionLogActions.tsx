import React from "react"
import { RefreshCw, Download, FilterX } from "lucide-react"

interface ActionLogActionsProps {
  onRefresh: () => void
  onExportCSV?: () => void
  onResetFilters?: () => void
  isLoading?: boolean
  hasActiveFilters?: boolean
}

export const ActionLogActions: React.FC<ActionLogActionsProps> = ({
  onRefresh,
  onExportCSV,
  onResetFilters,
  isLoading,
  hasActiveFilters,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Обновить
        </button>

        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all"
          >
            <FilterX className="w-4 h-4" />
            Сбросить фильтры
          </button>
        )}
      </div>

      {onExportCSV && (
        <button
          onClick={onExportCSV}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <Download className="w-4 h-4" />
          Экспорт CSV
        </button>
      )}
    </div>
  )
}