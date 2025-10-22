"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, LogOut, Shield, Palette } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"

type Theme = 'dark' | 'theme-crimson-gradient' | 'theme-sunset-gradient' | 'theme-mz-glow'

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'dark', label: 'Синяя', icon: '🔵' },
  { value: 'theme-crimson-gradient', label: 'Красная', icon: '🔴' },
  { value: 'theme-sunset-gradient', label: 'Закат', icon: '🌅' },
  { value: 'theme-mz-glow', label: 'МЗ Glow', icon: '✨' },
]

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark')
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark'
    setCurrentTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showThemeMenu && !target.closest('.theme-menu-container')) {
        setShowThemeMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showThemeMenu])

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
    document.documentElement.className = theme
    setShowThemeMenu(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getCityLabel = (city: string) => {
    const cities = {
      "CGB-N": "ЦГБ-Н",
      "CGB-P": "ЦГБ-П",
      "OKB-M": "ОКБ-М",
    }
    return cities[city as keyof typeof cities] || city
  }

  const getRoleBadge = (role: string, city?: string) => {
    const badges = {
      root: { label: "Суперадмин", color: "bg-purple-600" },
      admin: { label: "Администратор", color: "bg-red-600" },
      ld: { label: `Лидер ${city ? getCityLabel(city) : ''}`, color: "bg-pink-600" },
      cc: { label: `СС ${city ? getCityLabel(city) : ''}`, color: "bg-blue-600" },
      user: { label: `Участник ${city ? getCityLabel(city) : ''}`, color: "bg-green-600" },
    }
    return badges[role as keyof typeof badges] || { label: role, color: "bg-gray-600" }
  }

  return (
    <header className="modern-nav ml-64">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <h1 className="text-xl font-semibold text-foreground">Методичка Министерства Здравоохранения</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Switcher */}
            <div className="relative theme-menu-container">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border-2 border-border"
                title="Сменить тему"
              >
                <Palette className="w-4 h-4" />
                <span className="text-sm">{themes.find(t => t.value === currentTheme)?.icon}</span>
              </button>
              
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden z-50">
                  {themes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => changeTheme(theme.value)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors ${
                        currentTheme === theme.value ? 'bg-primary text-primary-foreground font-semibold' : 'text-card-foreground'
                      }`}
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className="text-sm">{theme.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-secondary rounded-lg border-2 border-border">
                  <Shield className="w-4 h-4 text-muted-foreground"/>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{user.game_nick}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(user.role, user.city).color} text-white w-fit`}>
                      {getRoleBadge(user.role, user.city).label}
                    </span>
                  </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="modern-button flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4"/>
                  <span>Выйти</span>
                </button>
              </>
            ) : (
                <Link
                    href="/login"
                    className="modern-button flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Войти</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
