"use client"

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react"
import { Clock, Trash2, History, X, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HistoryItem {
  id: string
  title: string
  section: string
  icon: string
  visitedAt: number
  visitCount: number
}

interface HistoryContextType {
  history: HistoryItem[]
  addToHistory: (item: Omit<HistoryItem, "visitedAt" | "visitCount">) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
  getMostVisited: (limit?: number) => HistoryItem[]
  getRecentlyVisited: (limit?: number) => HistoryItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

const STORAGE_KEY = "mz-history"
const MAX_HISTORY_ITEMS = 50

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Listen for toggle event from Header
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev)
    window.addEventListener("toggle-history", handleToggle)
    return () => window.removeEventListener("toggle-history", handleToggle)
  }, [])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setHistory(parsed)
      } catch {
        console.error("Failed to parse history")
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }
  }, [history, isLoaded])

  const addToHistory = useCallback((item: Omit<HistoryItem, "visitedAt" | "visitCount">) => {
    setHistory((prev) => {
      const existing = prev.find((h) => h.id === item.id)
      let newHistory: HistoryItem[]

      if (existing) {
        // Update existing item
        newHistory = prev.map((h) =>
          h.id === item.id
            ? { ...h, visitedAt: Date.now(), visitCount: h.visitCount + 1 }
            : h
        )
      } else {
        // Add new item
        newHistory = [
          { ...item, visitedAt: Date.now(), visitCount: 1 },
          ...prev
        ].slice(0, MAX_HISTORY_ITEMS)
      }

      // Sort by visitedAt (newest first)
      return newHistory.sort((a, b) => b.visitedAt - a.visitedAt)
    })
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const getMostVisited = useCallback((limit = 5) => {
    return [...history]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, limit)
  }, [history])

  const getRecentlyVisited = useCallback((limit = 5) => {
    return history.slice(0, limit)
  }, [history])

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getMostVisited,
        getRecentlyVisited,
        isOpen,
        setIsOpen
      }}
    >
      {children}
      <HistoryDrawer />
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider")
  }
  return context
}

// Recently viewed component for OverviewSection
export function RecentlyViewed({ limit = 4 }: { limit?: number }) {
  const { getRecentlyVisited, addToHistory } = useHistory()
  const recent = getRecentlyVisited(limit)

  if (recent.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Недавно просмотренные
      </h3>
      <div className="flex flex-wrap gap-2">
        {recent.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              window.dispatchEvent(new CustomEvent("navigate-section", { detail: item.id }))
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-sm transition-colors"
          >
            <span>{item.icon}</span>
            <span className="text-foreground">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Most visited component
export function MostVisited({ limit = 5 }: { limit?: number }) {
  const { getMostVisited } = useHistory()
  const mostVisited = getMostVisited(limit)

  if (mostVisited.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Часто посещаемые
      </h3>
      <div className="space-y-2">
        {mostVisited.map((item, index) => (
          <div
            key={item.id}
            onClick={() => {
              window.dispatchEvent(new CustomEvent("navigate-section", { detail: item.id }))
            }}
            className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
          >
            <span className="text-xs font-semibold text-muted-foreground w-5">
              {index + 1}.
            </span>
            <span className="text-lg">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.visitCount} посещений</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// History drawer
function HistoryDrawer() {
  const { history, isOpen, setIsOpen, removeFromHistory, clearHistory } = useHistory()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, setIsOpen])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "только что"
    if (minutes < 60) return `${minutes} мин. назад`
    if (hours < 24) return `${hours} ч. назад`
    if (days < 7) return `${days} дн. назад`
    return date.toLocaleDateString("ru-RU")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-card border-l-2 border-border z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">История</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground text-sm">
                      История посещений пуста
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.visitedAt}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("navigate-section", { detail: item.id }))
                          setIsOpen(false)
                        }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(item.visitedAt)}</span>
                            <span>•</span>
                            <span>{item.visitCount} раз</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromHistory(item.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {history.length > 0 && (
                <div className="p-4 border-t-2 border-border">
                  <button
                    onClick={clearHistory}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Очистить историю
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
