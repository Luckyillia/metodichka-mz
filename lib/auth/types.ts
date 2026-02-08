export type UserRole = "guest" | "user" | "instructor" | "cc" | "ld" | "admin" | "root"

export type UserStatus = "active" | "inactive" | "request"

export type UserCity = "CGB-N" | "CGB-P" | "OKB-M"

export interface User {
  id: string
  username: string
  game_nick: string
  role: "root" | "admin" | "cc" | "ld" | "instructor" | "user"
  status: UserStatus
  city: UserCity
  ip_address?: string
  created_at: string
  avatar_url?: string | null
  avatar_public_id?: string | null
  avatar_uploaded_at?: string | null
  avatar_moderation_status?: "pending" | "approved" | "rejected" | null
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type ActionType =
    | 'create'
    | 'update'
    | 'delete'
    | 'role_change'
    | 'login'
    | 'logout'
    | 'deactivate'
    | 'restore'
    | 'other'

export type TargetType = 'user' | 'system' | 'report' | 'other'

export interface ActionLog {
  id: string
  user_id: string
  game_nick: string
  action: string
  action_type: ActionType
  target_type?: TargetType
  target_id?: string
  target_name?: string
  details?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  undone?: boolean
  undone_at?: string
  undone_by_user_id?: string
  undone_by_game_nick?: string
  previous_state?: Record<string, any>
  new_state?: Record<string, any>
}

export interface UndoActionRequest {
  logId: string
}

export interface UndoActionResponse {
  success: boolean
  message: string
  restoredUser?: User
}

export interface ParkingSpace {
  id: number;
  place: number;
  person: string;
  car: string;
  license: string;
  category: 'commanders' | 'deputies' | 'junior';
  updated_at?: string;
  updated_by?: string;
}