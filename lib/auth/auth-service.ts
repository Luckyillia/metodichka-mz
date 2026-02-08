// lib/auth/auth-service.ts - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ
import type { User, ActionLog } from "./types"
import { AUTH_STORAGE_KEY, SESSION_DURATION } from "./constants"

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
  try {
    console.log('[AuthService] Attempting login for:', username)
    console.log('[AuthService] Password length:', password.length)
    console.log('[AuthService] Username length:', username.length)
    
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    console.log('[AuthService] Response status:', response.status)
    console.log('[AuthService] Response ok:', response.ok)

    if (!response.ok) {
      console.error('[AuthService] Login failed with status:', response.status)

      const errorData = await response.json().catch(() => ({} as any))
      console.log('[AuthService] Error data from server:', errorData)

      if (errorData && (errorData as any).error) {
        const err: any = new Error((errorData as any).error)
        if ((errorData as any).errorType) {
          err.errorType = (errorData as any).errorType
        }
        throw err // ← Ошибка уходит наружу, но с типом
      }

      return null
    }

    const data = await response.json()
    const user = data?.user
    const token = data?.token

    if (!user || !token) {
      console.error('[AuthService] Invalid login response shape')
      return null
    }

    console.log('[AuthService] Login successful, user:', user.username, 'role:', user.role)
    this.saveToken(token)
    return user
  } catch (error) {
    console.error("[AuthService] Login error:", error)
    // Пробрасываем ошибку дальше, чтобы UI мог показать сообщение
    throw error
  }

  }

  static async getPromotionSystem(): Promise<any> {
    try {
      const response = await this.fetchWithAuth("/api/promotion-system", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        return { promotions: [], reprimands: [] }
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error fetching promotion system:", error)
      return { promotions: [], reprimands: [] }
    }
  }

  static async updatePromotionTask(
    sectionKey: string,
    taskId: number,
    field: "task" | "max" | "points",
    value: string
  ): Promise<any> {
    try {
      const response = await this.fetchWithAuth("/api/promotion-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_task", sectionKey, taskId, field, value }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update task")
      }
      return data
    } catch (error) {
      console.error("[AuthService] Error updating promotion task:", error)
      throw error
    }
  }

  static async addPromotionTask(
    sectionKey: string,
    task: string,
    max: string,
    points: string
  ): Promise<any> {
    try {
      const response = await this.fetchWithAuth("/api/promotion-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_task", sectionKey, task, max, points }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to add task")
      }
      return data
    } catch (error) {
      console.error("[AuthService] Error adding promotion task:", error)
      throw error
    }
  }

  static async deletePromotionTask(taskId: number): Promise<{ success: boolean }> {
    try {
      const response = await this.fetchWithAuth("/api/promotion-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_task", taskId }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task")
      }
      return data
    } catch (error) {
      console.error("[AuthService] Error deleting promotion task:", error)
      throw error
    }
  }

  static saveToken(token: string): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, token)
      } catch (error) {
        console.error('[AuthService] Error saving token:', error)
      }
    }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") {
      return null
    }

    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) {
      return null
    }

    try {
      const userData = JSON.parse(Buffer.from(token, "base64").toString())
      const { timestamp, signature, loginTimestamp, ...user } = userData

      const loginTs = loginTimestamp || timestamp
      if (loginTs && Date.now() - loginTs > SESSION_DURATION) {
        this.logout()
        return null
      }

      return user as User
    } catch (error) {
      console.error("[AuthService] Error decrypting user:", error)
      this.logout()
      return null
    }
  }
  static async transferUserCity(userId: string, newCity: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users/transfer-city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newCity }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to transfer user")
      }

      return data.user
    } catch (error) {
      console.error("[AuthService] Error transferring user:", error)
      throw error
    }
  }
  static getAuthToken(): string | null {
    if (typeof window === "undefined") {
      return null
    }

    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) {
      return null
    }

    return token
  }

  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken()

    if (!token) {
      throw new Error("No authentication token")
    }

    const headers = new Headers(options.headers)
    headers.set("Authorization", `Bearer ${token}`)

    return fetch(url, {
      ...options,
      headers,
    })
  }

  static hasRole(user: User | null, allowedRoles: string[]): boolean {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  static canAccessSection(user: User | null, sectionId: string): boolean {
    // Если пользователь не авторизован, доступ запрещен ко всем секциям
    if (!user) {
      return false
    }

    const publicSections = [
      "overview",
      "ms-unified-content",
      "commands",
      "rp-task",
      "parking-spaces",
      "medical-commission",
      "interview",
      "medications",
      "medical-card",
      "vehicles",
      "positions",
    ]

    const ccLdSections = [...publicSections, "exam-section", "ss-unified-content", "goss-wave", "announcements", "forum-responses", "report-generator"]
    const ldSections = [...ccLdSections, "promotion-system", "leader-report-generator", "user-management"]
    const privilegedSections = [...ldSections, "gs-report-generator", "action-log", "user-management", "biography-validator"];

    switch (user.role) {
      case "root":
      case "admin":
        return privilegedSections.includes(sectionId)
      case "ld":
        return ldSections.includes(sectionId)
      case "cc":
        return ccLdSections.includes(sectionId)
      case "instructor":
        return [...publicSections, "ss-unified-content"].includes(sectionId)
      case "user":
        return publicSections.includes(sectionId)
      default:
        return publicSections.includes(sectionId)
    }
  }

  static async logAction(
      userId: string,
      gameNick: string,
      action: string,
      actionType: "create" | "update" | "delete" | "role_change" | "login" | "logout" | "deactivate" | "restore" | "other" = "other",
      targetType?: "user" | "system" | "report" | "other",
      targetId?: string,
      targetName?: string,
      details?: string,
      metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.fetchWithAuth("/api/action-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          action_type: actionType,
          target_type: targetType,
          target_id: targetId,
          target_name: targetName,
          details,
          metadata,
        }),
      })
    } catch (error) {
      console.error("[AuthService] Error logging action:", error)
    }
  }

  static async getActionLogs(
      limit: number = 100,
      offset: number = 0,
      filters?: {
        action_type?: string
        target_type?: string
        user_id?: string
      }
  ): Promise<{ logs: ActionLog[]; total: number }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })

      if (filters?.action_type) params.append("action_type", filters.action_type)
      if (filters?.target_type) params.append("target_type", filters.target_type)
      if (filters?.user_id) params.append("user_id", filters.user_id)

      const response = await this.fetchWithAuth(`/api/action-logs?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[AuthService] Error fetching logs:", error)
      return { logs: [], total: 0 }
    }
  }

  // ===== ИСПРАВЛЕННЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ =====

  static async getUsers(): Promise<User[]> {
    try {
      const response = await this.fetchWithAuth("/api/users")

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[AuthService] GetUsers failed:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Failed to fetch users: ${response.status} ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error fetching users:", error)
      return []
    }
  }

  static async createUser(username: string, gameNick: string, password: string, role: string, city?: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, gameNick, password, role, city }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error creating user:", error)
      throw error
    }
  }

  static async updateUser(userId: string, username: string, gameNick: string, password?: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, gameNick, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error updating user:", error)
      throw error
    }
  }

  static async updateUserRole(userId: string, role: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error updating role:", error)
      throw error
    }
  }

  static async updateUserCity(userId: string, city: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, city, action: "change_city" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update city")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error updating city:", error)
      throw error
    }
  }

  static async deactivateUser(userId: string): Promise<void> {
    try {
      const response = await this.fetchWithAuth(`/api/users?id=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        let errorMessage = "Failed to deactivate user"
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch {
          // Response might be empty
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("[AuthService] Error deactivating user:", error)
      throw error
    }
  }

  static async restoreUser(userId: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "restore" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to restore user")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error restoring user:", error)
      throw error
    }
  }

  static async undoAction(logId: string): Promise<{ success: boolean; message: string; restoredUser?: User }> {
    try {
      const response = await this.fetchWithAuth("/api/users/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to undo action")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error undoing action:", error)
      throw error
    }
  }

  static async permanentDeleteUser(userId: string): Promise<void> {
    try {
      const response = await this.fetchWithAuth(`/api/users/permanent-delete?id=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        let errorMessage = "Failed to permanently delete user"
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch {
          // Response might be empty
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("[AuthService] Error permanently deleting user:", error)
      throw error
    }
  }

  static async approveAccountRequest(userId: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "approve" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve account request")
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error approving account request:", error)
      throw error
    }
  }

  static async rejectAccountRequest(userId: string): Promise<void> {
    try {
      const response = await this.fetchWithAuth(`/api/users/permanent-delete?id=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        let errorMessage = "Failed to reject account request"
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch {
          // Response might be empty
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("[AuthService] Error rejecting account request:", error)
      throw error
    }
  }

  // ===== ИСПРАВЛЕННЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С ПАРКОВОЧНЫМИ МЕСТАМИ =====

  static async getParkingSpaces(): Promise<any[]> {
    try {
      // GET запрос не требует авторизации (публичный доступ)
      const response = await fetch("/api/parking-spaces", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("[AuthService] Failed to fetch parking spaces, status:", response.status)
        return []
      }

      const data = await response.json()
      return data.spaces || []
    } catch (error) {
      console.error("[AuthService] Error fetching parking spaces:", error)
      return []
    }
  }

  static async updateParkingSpace(
      place: number,
      person: string,
      car: string,
      license: string
  ): Promise<any> {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error("Не авторизован")
      }

      const response = await fetch("/api/parking-spaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          place,
          person,
          car,
          license,
        }),
      })

      // Сначала читаем текст ответа
      const text = await response.text()

      // Проверяем, не пустой ли ответ
      if (!text) {
        if (response.ok) {
          // Успешный ответ без тела
          return { success: true }
        }
        throw new Error("Пустой ответ от сервера")
      }

      // Пытаемся распарсить JSON
      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error("[AuthService] Failed to parse response:", text)
        throw new Error("Некорректный ответ от сервера")
      }

      // Проверяем статус после парсинга
      if (!response.ok) {
        throw new Error(data.error || `Ошибка ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("[AuthService] Error updating parking space:", error)
      throw error
    }
  }
}