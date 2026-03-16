"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, LogOut, Shield, Palette, Bookmark, History, Bell, Menu } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useBookmarks } from "@/app/components/common/Bookmarks"
import { useHistory } from "@/app/components/common/History"
import { RealtimeNotifications } from "@/app/components/common/RealtimeNotifications"

type Theme = 'dark' | 'theme-crimson-gradient' | 'theme-sunset-gradient' | 'theme-mz-glow' | 'theme-midnight-purple' | 'theme-aurora'

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'dark', label: 'Синяя', icon: '🔵' },
  { value: 'theme-crimson-gradient', label: 'Красная', icon: '🔴' },
  { value: 'theme-sunset-gradient', label: 'Закат', icon: '🌅' },
  { value: 'theme-mz-glow', label: 'МЗ Glow', icon: '✨' },
  { value: 'theme-midnight-purple', label: 'Полночь', icon: '🔮' },
  { value: 'theme-aurora', label: 'Аврора', icon: '🌌' },
]

const initialsFromNick = (nick: string) => {
  const parts = nick.split(/[_\s]+/).filter(Boolean)
  const a = parts[0]?.[0] || "U"
  const b = parts[1]?.[0] || ""
  return (a + b).toUpperCase()
}

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark'
    const root = document.documentElement;
    const themeClasses = themes.map(t => t.value);
    root.classList.remove(...themeClasses);
    root.classList.add(savedTheme);
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
    const root = document.documentElement;
    const themeClasses = themes.map(t => t.value);
    
    root.classList.add('theme-switching');
    
    root.classList.remove(...themeClasses);
    root.classList.add(theme);
    
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme }
    }));
    
    setShowThemeMenu(false);

    setTimeout(() => {
      root.classList.remove('theme-switching');
    }, 300);
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
      ld: { label: `ЛД${city ? ` ${getCityLabel(city)}` : ''}`, color: "bg-pink-600" },
      cc: { label: `СС${city ? ` ${getCityLabel(city)}` : ''}`, color: "bg-blue-600" },
      instructor: { label: `Инструктор${city ? ` ${getCityLabel(city)}` : ''}`, color: "bg-amber-600" },
      user: { label: `Пользователь${city ? ` ${getCityLabel(city)}` : ''}`, color: "bg-green-600" },
    }
    return badges[role as keyof typeof badges] || { label: role, color: "bg-gray-600" }
  }

  return (
    <header className="modern-nav w-full lg:w-[calc(100%-16rem)] lg:ml-64 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors text-foreground"
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl flex-shrink-0">🏥</span>
              <h1 className="text-sm md:text-xl font-semibold text-foreground line-clamp-1">Методичка МЗ</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Desktop Action buttons */}
            <div className="hidden md:flex items-center gap-2">
              <RealtimeNotifications />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-bookmarks'))}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border-2 border-border"
                title="Избранное"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-history'))}
                className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border-2 border-border"
                title="История"
              >
                <History className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="relative theme-menu-container">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border-2 border-border"
                title="Сменить тему"
              >
                <Palette className="w-4 h-4" />
                <span className="text-xs md:text-sm">{themes.find(t => t.value === currentTheme)?.icon || themes[0]?.icon}</span>
              </button>
              
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-40 md:w-48 bg-card border-2 border-border rounded-xl shadow-2xl overflow-hidden z-[100] glass-dark">
                  {themes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => changeTheme(theme.value)}
                      className={`w-full px-4 py-2.5 md:py-3 text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors ${
                        currentTheme === theme.value ? 'bg-primary/20 text-primary font-bold' : 'text-card-foreground'
                      }`}
                    >
                      <span className="text-base md:text-lg">{theme.icon}</span>
                      <span className="text-xs md:text-sm">{theme.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth section */}
            {mounted && (
              <div className="flex items-center gap-2">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 md:gap-3 p-1 md:px-4 md:py-2 bg-secondary rounded-lg border-2 border-border hover:bg-secondary/80 transition-colors"
                      title="Личный кабинет"
                    >
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="avatar"
                          className="w-7 h-7 md:w-10 md:h-10 rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center text-[10px] md:text-sm font-semibold text-foreground">
                          {initialsFromNick(user.game_nick)}
                        </div>
                      )}

                      <div className="hidden sm:flex flex-col">
                        <span className="text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
                          <Shield className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground"/>
                          {user.game_nick}
                        </span>
                        <span
                          className={`mt-1 inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold text-white ${getRoleBadge(user.role, user.city).color}`}
                        >
                          {getRoleBadge(user.role, user.city).label}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="modern-button hidden md:flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4"/>
                      <span>Выйти</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="modern-button flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm"
                  >
                    <Users className="w-4 h-4"/>
                    <span>Войти</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
