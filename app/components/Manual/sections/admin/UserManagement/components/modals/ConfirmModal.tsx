import React from "react"
import { AlertCircle } from "lucide-react"
import type { ConfirmModalState } from "../../types"

interface ConfirmModalProps extends ConfirmModalState {}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  confirmText = 'Подтвердить',
  type = 'warning'
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-xl shadow-2xl max-w-md w-full border-2 border-border animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full ${
              type === 'danger' ? 'bg-destructive/20' :
              type === 'info' ? 'bg-primary/20' : 'bg-yellow-500/20'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                type === 'danger' ? 'text-destructive' :
                type === 'info' ? 'text-primary' : 'text-yellow-600 dark:text-yellow-400'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-popover-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-medium ${
                type === 'danger' 
                  ? 'bg-destructive hover:opacity-90 text-destructive-foreground' :
                  type === 'info'
                    ? 'bg-primary hover:opacity-90 text-primary-foreground'
                    : 'bg-yellow-600 dark:bg-yellow-500 hover:opacity-90 text-white'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}