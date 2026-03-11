import type { ActionLog } from "@/lib/auth/types"

export interface ActionLogFilters {
  actionType: string
  targetType: string
  searchQuery: string
  dateFrom: string
  dateTo: string
  performedBy: string
}

export interface ActionLogStats {
  total: number
  activeUsers: number
  criticalActions: number
  todayActions: number
  topActions: { label: string; count: number; color: string; icon: string }[]
  mostActiveUsers: { name: string; count: number }[]
  weeklyActivity: { day: string; count: number }[]
}

export interface ConfirmModalState {
  isOpen: boolean
  title: string
  message: string
  type?: "danger" | "info" | "warning"
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
}