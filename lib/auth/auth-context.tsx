"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthState } from "./types"
import { AuthService } from "./auth-service"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  canAccessSection: (sectionId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })

    const checkSessionInterval = setInterval(() => {
      const currentUser = AuthService.getCurrentUser()
      if (!currentUser && state.isAuthenticated) {
        // Session expired, log out
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkSessionInterval)
  }, [state.isAuthenticated])

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = await AuthService.login(username, password)

    if (user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }

    return false
  }

  const logout = () => {
    if (state.user && (state.user.role === "admin" || state.user.role === "root" || state.user.role === "ld")) {
      AuthService.logAction(
          state.user.id,
          state.user.game_nick,
          "Выход из системы",
          "logout",
          "system"
      )
    }

    AuthService.logout()
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const canAccessSection = (sectionId: string): boolean => {
    return AuthService.canAccessSection(state.user, sectionId)
  }

  return (
      <AuthContext.Provider
          value={{
            ...state,
            login,
            logout,
            canAccessSection,
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
