"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { LogOut, User, Palette, Check, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"

type Theme = 'dark' | 'theme-crimson-gradient' | 'theme-sunset-gradient' | 'theme-mz-glow' | 'theme-midnight-purple' | 'theme-aurora'

const themes: { value: Theme; label: string; color: string }[] = [
  { value: 'dark', label: 'Default Dark', color: '#fafafa' },
  { value: 'theme-mz-glow', label: 'Medical Red', color: '#ef4444' },
  { value: 'theme-crimson-gradient', label: 'Crimson', color: '#ef4444' },
  { value: 'theme-sunset-gradient', label: 'Sunset', color: '#f97316' },
  { value: 'theme-midnight-purple', label: 'Midnight', color: '#a855f7' },
  { value: 'theme-aurora', label: 'Aurora', color: '#14b8a6' },
]

const initialsFromNick = (nick: string) => {
  const parts = nick.split(/[_\s]+/).filter(Boolean)
  const a = parts[0]?.[0] || "U"
  const b = parts[1]?.[0] || ""
  return (a + b).toUpperCase()
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark'
    setCurrentTheme(savedTheme)
    const root = document.documentElement
    const themeClasses = themes.map(t => t.value)
    root.classList.remove(...themeClasses)
    root.classList.add(savedTheme)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeTheme = (theme: Theme) => {
    const root = document.documentElement
    const themeClasses = themes.map(t => t.value)
    
    root.classList.add('theme-switching')
    root.classList.remove(...themeClasses)
    root.classList.add(theme)
    
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
    
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }))
    setShowThemeMenu(false)

    setTimeout(() => {
      root.classList.remove('theme-switching')
    }, 300)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getCityLabel = (city: string) => {
    const cities: Record<string, string> = {
      "CGB-N": "CGB-N",
      "CGB-P": "CGB-P",
      "OKB-M": "OKB-M",
    }
    return cities[city] || city
  }

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      root: "Admin",
      admin: "Admin",
      ld: "Leader",
      cc: "Senior",
      instructor: "Instructor",
      user: "Member",
    }
    return badges[role] || role
  }

  return (
    <header className="modern-nav ml-0 lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Page title - hidden on mobile since sidebar toggle is there */}
          <div className="hidden lg:flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">
              Medical Manual
            </h1>
          </div>

          {/* Spacer for mobile */}
          <div className="lg:hidden" />

          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors border border-border"
                aria-label="Change theme"
              >
                <Palette className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline text-muted-foreground">Theme</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
                  <div className="py-1">
                    {themes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => changeTheme(theme.value)}
                        className="w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-accent transition-colors text-sm"
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: theme.color }}
                        />
                        <span className="flex-1 text-foreground">{theme.label}</span>
                        {currentTheme === theme.value && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User section */}
            <div suppressHydrationWarning>
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors border border-border"
                  >
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                        {initialsFromNick(user.game_nick)}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium text-foreground">
                      {user.game_nick}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
                      <div className="px-3 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{user.game_nick}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getRoleBadge(user.role)} {user.city && `• ${getCityLabel(user.city)}`}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-muted-foreground" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="modern-button flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
