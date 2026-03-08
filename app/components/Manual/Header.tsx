"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { LogOut, User, Palette, Check, ChevronDown, Sparkles, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type Theme = 'dark' | 'theme-cyber-neon' | 'theme-emerald-matrix' | 'theme-royal-purple' | 'theme-sunset-fire' | 'theme-arctic-ice'

const themes: { value: Theme; label: string; color: string; gradient: string }[] = [
  { value: 'dark', label: 'Crimson Flame', color: '#ef4444', gradient: 'from-red-500 to-orange-500' },
  { value: 'theme-cyber-neon', label: 'Cyber Neon', color: '#0ea5e9', gradient: 'from-cyan-500 to-blue-500' },
  { value: 'theme-emerald-matrix', label: 'Matrix', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
  { value: 'theme-royal-purple', label: 'Royal Purple', color: '#a855f7', gradient: 'from-purple-500 to-pink-500' },
  { value: 'theme-sunset-fire', label: 'Sunset Fire', color: '#f97316', gradient: 'from-orange-500 to-yellow-500' },
  { value: 'theme-arctic-ice', label: 'Arctic Ice', color: '#38bdf8', gradient: 'from-sky-400 to-indigo-500' },
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

  const currentThemeData = themes.find(t => t.value === currentTheme)

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 z-30 bg-black/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Page title */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              whileHover={{ scale: 1.02 }}
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Medical Manual</span>
            </motion.div>
          </div>

          {/* Spacer for mobile */}
          <div className="lg:hidden" />

          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl glass-card hover:border-primary/30 transition-all duration-300"
                aria-label="Change theme"
              >
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentThemeData?.gradient || 'from-red-500 to-orange-500'} shadow-lg`} 
                  style={{ boxShadow: `0 0 12px ${currentThemeData?.color}` }}
                />
                <span className="hidden sm:inline text-foreground/80 font-medium">Theme</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showThemeMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 mb-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Theme</p>
                      </div>
                      {themes.map((theme) => (
                        <motion.button
                          key={theme.value}
                          whileHover={{ x: 4 }}
                          onClick={() => changeTheme(theme.value)}
                          className={`w-full px-3 py-2.5 text-left flex items-center gap-3 rounded-xl transition-all duration-300 ${
                            currentTheme === theme.value 
                              ? 'bg-white/10' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg bg-gradient-to-r ${theme.gradient} shadow-lg`}
                            style={{ boxShadow: `0 0 10px ${theme.color}40` }}
                          />
                          <span className="flex-1 text-sm font-medium text-foreground">{theme.label}</span>
                          {currentTheme === theme.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-primary" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User section */}
            <div suppressHydrationWarning>
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl glass-card hover:border-primary/30 transition-all duration-300"
                  >
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ boxShadow: '0 0 15px var(--primary)' }}>
                        {initialsFromNick(user.game_nick)}
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <span className="block text-sm font-semibold text-foreground leading-tight">
                        {user.game_nick}
                      </span>
                      <span className="block text-xs text-primary">
                        {getRoleBadge(user.role)}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatar_url}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-sm font-bold text-white">
                                {initialsFromNick(user.game_nick)}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-foreground">{user.game_nick}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
                                  {getRoleBadge(user.role)}
                                </span>
                                {user.city && (
                                  <span className="text-xs text-muted-foreground">
                                    {getCityLabel(user.city)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-white/5 rounded-xl transition-all duration-300"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">Profile Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                              <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                            </div>
                            <span className="font-medium group-hover:text-red-400 transition-colors">Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="premium-button flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Sign in</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
