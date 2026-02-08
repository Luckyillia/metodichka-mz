import type { User as UserType } from "@/lib/auth/types"

export interface UserFormData {
  username: string
  gameNick: string
  password: string
  role: string
  city: "CGB-N" | "CGB-P" | "OKB-M"
}

export interface EditUserData {
  id: string
  username: string
  gameNick: string
  password: string
  role: "root" | "admin" | "ld" | "cc" | "user"
}

export interface TransferCityData {
  userId: string
  newCity: "CGB-N" | "CGB-P" | "OKB-M"
}

export interface ConfirmModalState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export type UserTab = 'active' | 'inactive' | 'requests' | 'moderation'