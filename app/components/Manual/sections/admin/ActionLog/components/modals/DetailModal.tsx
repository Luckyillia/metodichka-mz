import React from "react"
import type { ActionLog } from "@/lib/auth/types"
import { formatDate, getActionTypeColor, getActionTypeLabel, getTargetTypeLabel } from "../../utils"

interface DetailModalProps {
  log: ActionLog
  isRootUser: boolean
  onClose: () => void
}

export const DetailModal: React.FC<DetailModalProps> = ({ log, isRootUser, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-popover rounded-lg border-2 border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-colors custom-scrollbar">
      <div className="sticky top-0 bg-popover border-b-2 border-border p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-popover-foreground">Детали записи</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Пользователь</p>
            <p className="text-foreground font-medium">{log.game_nick}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Дата и время</p>
            <p className="text-foreground">{formatDate(log.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Тип действия</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getActionTypeColor(log.action_type)}`}
            >
              {getActionTypeLabel(log.action_type)}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Целевой объект</p>
            <p className="text-foreground">{getTargetTypeLabel(log.target_type)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Действие</p>
          <p className="text-foreground">{log.action}</p>
        </div>

        {log.target_name && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Целевое имя</p>
            <p className="text-foreground">{log.target_name}</p>
          </div>
        )}

        {log.details && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Подробности</p>
            <p className="text-muted-foreground text-sm">{log.details}</p>
          </div>
        )}

        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Метаданные</p>
            <div className="bg-muted/50 rounded p-4 border-2 border-border">
              <pre className="text-xs text-muted-foreground overflow-x-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {isRootUser && log.ip_address && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">IP адрес</p>
            <p className="text-foreground font-mono text-sm">{log.ip_address}</p>
          </div>
        )}

        {isRootUser && log.user_agent && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">User Agent</p>
            <p className="text-muted-foreground text-xs break-all">{log.user_agent}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">ID записи</p>
            <p className="text-muted-foreground font-mono text-xs break-all">{log.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">ID пользователя</p>
            <p className="text-muted-foreground font-mono text-xs break-all">{log.user_id}</p>
          </div>
        </div>

        {log.target_id && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">ID целевого объекта</p>
            <p className="text-muted-foreground font-mono text-xs break-all">{log.target_id}</p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-popover border-t-2 border-border p-6">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
)