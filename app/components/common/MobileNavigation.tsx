"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  Home, 
  User, 
  Settings, 
  Menu, 
  X,
  Search,
  Bookmark,
  History,
  Bell,
  Map,
  Shield,
  FileText,
  LogOut
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth/auth-context"

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Close menu on route change
    setIsOpen(false)
  }, [pathname])

  if (!isMobile) return null

  const navItems = [
    { icon: Home, label: "Главная", href: "/", shortcut: "⌘H" },
    { icon: Search, label: "Поиск", action: () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
    }, shortcut: "⌘K" },
    // { icon: Map, label: "Карта", href: "/tree" },
    { icon: Bookmark, label: "Избранное", action: () => {
      window.dispatchEvent(new CustomEvent("toggle-bookmarks"))
    }},
    { icon: History, label: "История", action: () => {
      window.dispatchEvent(new CustomEvent("toggle-history"))
    }},
    { icon: User, label: isAuthenticated ? "Профиль" : "Вход", href: isAuthenticated ? "/profile" : "/login" },
    { icon: LogOut, label: "Выход", action: () => {
      logout()
      window.dispatchEvent(new CustomEvent("close-mobile-menu"))
    }, condition: isAuthenticated },
  ]

  const adminItems = isAuthenticated && ["root", "admin", "ld"].includes(user?.role || "") ? [
    { icon: Shield, label: "Админ-панель", action: () => {
      window.dispatchEvent(new CustomEvent("navigate-section", { detail: "user-management" }))
      if (pathname !== "/") router.push("/")
    }},
    { icon: FileText, label: "Логи действий", action: () => {
      window.dispatchEvent(new CustomEvent("navigate-section", { detail: "action-log" }))
      if (pathname !== "/") router.push("/")
    }},
  ] : []

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border/50 z-50 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.filter(item => item.icon !== LogOut).slice(0, 4).map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.action) {
                  item.action()
                } else if (item.href) {
                  router.push(item.href)
                }
              }}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95 ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-6 h-6 ${pathname === item.href ? "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : ""}`} />
              <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsOpen(true)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95 ${
              isOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Menu className="w-6 h-6" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Меню</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Меню</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border/50 rounded-xl mb-6">
                    <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                      {user.game_nick?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-foreground">{user.game_nick}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{user.role}</p>
                    </div>
                    <button 
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Выйти"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-2 ml-2">Навигация</p>
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.action) {
                          item.action()
                        } else if (item.href) {
                          router.push(item.href)
                        }
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                        pathname === item.href ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted text-foreground/80 hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] font-mono text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded border border-border/50">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  ))}

                  {adminItems.length > 0 && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mt-6 mb-2 ml-2 text-amber-500/70">Администрирование</p>
                      {adminItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            if (item.action) item.action()
                            setIsOpen(false)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-all duration-200 text-left text-foreground/80 hover:text-foreground"
                        >
                          <item.icon className="w-5 h-5 text-amber-500/70" />
                          <span className="flex-1 font-medium">{item.label}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Quick Tips */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Совет:</strong> Используйте Cmd+K для быстрого поиска разделов
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Safe Area Spacer */}
      <div className="h-16 lg:hidden" />
    </>
  )
}
