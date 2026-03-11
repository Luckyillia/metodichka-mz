import React from "react"
import { Clock, User, FileText, Eye, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import type { ActionLog } from "@/lib/auth/types"
import { formatDate, getActionTypeColor, getActionTypeLabel, getTargetTypeLabel, isCriticalAction } from "../utils"

interface ActionLogTableProps {
  logs: ActionLog[]
  total: number
  currentPage: number
  totalPages: number
  logsPerPage: number
  isLoading: boolean
  canUndo: (log: ActionLog) => boolean
  onViewDetails: (log: ActionLog) => void
  onUndo: (logId: string) => void
  onPreviousPage: () => void
  onNextPage: () => void
  onGoToPage: (page: number) => void
  pageNumbers: () => (number | "...")[]
}

export const ActionLogTable: React.FC<ActionLogTableProps> = ({
  logs,
  total,
  currentPage,
  totalPages,
  logsPerPage,
  isLoading,
  canUndo,
  onViewDetails,
  onUndo,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  pageNumbers,
}) => {
  // Скелетон при загрузке
  if (isLoading) {
    return (
      <div className="bg-card/50 rounded-lg border-2 border-border overflow-hidden transition-colors">
        <div className="p-5 border-b-2 border-border">
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: logsPerPage }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-6 animate-pulse">
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 flex-1 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Пустое состояние
  if (logs.length === 0) {
    return (
      <div className="bg-card/50 rounded-lg border-2 border-border p-12 text-center transition-colors">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground font-medium">Записи не найдены</p>
        <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить фильтры</p>
      </div>
    )
  }

  const pages = pageNumbers()

  return (
    <div className="bg-card/50 rounded-lg border-2 border-border overflow-hidden transition-colors">
      {/* Заголовок */}
      <div className="p-5 border-b-2 border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Журнал действий
        </h2>
        <span className="text-sm text-muted-foreground">
          {total.toLocaleString("ru-RU")} записей
        </span>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Дата и время
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Действие
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Цель
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Детали
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => {
              const isCritical = isCriticalAction(log.action_type) && !log.undone
              return (
                <tr
                  key={log.id}
                  className={`transition-colors ${
                    log.undone
                      ? "opacity-40 bg-muted/10"
                      : isCritical
                      ? "hover:bg-destructive/5 bg-destructive/[0.03]"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className={log.undone ? "line-through" : ""}>
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{log.game_nick}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getActionTypeColor(log.action_type)}`}
                      >
                        {getActionTypeLabel(log.action_type)}
                      </span>
                      {log.undone && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                          отменено
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-sm text-foreground ${log.undone ? "line-through" : ""}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">
                      {log.target_name || getTargetTypeLabel(log.target_type)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => onViewDetails(log)}
                        className="flex items-center gap-1 text-sm text-primary hover:opacity-70 transition-opacity"
                      >
                        <Eye className="w-4 h-4" />
                        Показать
                      </button>
                      {canUndo(log) && (
                        <button
                          onClick={() => onUndo(log.id)}
                          className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:opacity-70 transition-opacity"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Отменить
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Пагинация с номерами */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t-2 border-border flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-muted-foreground">
            Страница {currentPage} из {totalPages} · {total.toLocaleString("ru-RU")} записей
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Предыдущая страница"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-muted-foreground text-sm select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onGoToPage(page as number)}
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Следующая страница"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}