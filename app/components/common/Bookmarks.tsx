"use client"

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react"
import { Bookmark, X, Clock, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BookmarkItem {
  id: string
  title: string
  section: string
  icon: string
  timestamp: number
}

interface BookmarkContextType {
  bookmarks: BookmarkItem[]
  addBookmark: (item: Omit<BookmarkItem, "timestamp">) => void
  removeBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean
  toggleBookmark: (item: Omit<BookmarkItem, "timestamp">) => void
  clearAll: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

const STORAGE_KEY = "mz-bookmarks"

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setBookmarks(parsed)
      } catch {
        console.error("Failed to parse bookmarks")
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage when bookmarks change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
    }
  }, [bookmarks, isLoaded])

  // Listen for toggle event from Command Palette
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev)
    window.addEventListener("toggle-bookmarks", handleToggle)
    return () => window.removeEventListener("toggle-bookmarks", handleToggle)
  }, [])

  const addBookmark = useCallback((item: Omit<BookmarkItem, "timestamp">) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev
      return [...prev, { ...item, timestamp: Date.now() }]
    })
  }, [])

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  )

  const toggleBookmark = useCallback((item: Omit<BookmarkItem, "timestamp">) => {
    if (isBookmarked(item.id)) {
      removeBookmark(item.id)
    } else {
      addBookmark(item)
    }
  }, [isBookmarked, addBookmark, removeBookmark])

  const clearAll = useCallback(() => {
    setBookmarks([])
  }, [])

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleBookmark,
        clearAll,
        isOpen,
        setIsOpen
      }}
    >
      {children}
      <BookmarkDrawer />
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (!context) {
    throw new Error("useBookmarks must be used within BookmarkProvider")
  }
  return context
}

// Bookmark button component
interface BookmarkButtonProps {
  id: string
  title: string
  section: string
  icon: string
  variant?: "icon" | "button"
}

export function BookmarkButton({ 
  id, 
  title, 
  section, 
  icon, 
  variant = "icon" 
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(id)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark({ id, title, section, icon })
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
          bookmarked
            ? "bg-primary/10 text-primary border border-primary/30"
            : "bg-muted text-muted-foreground hover:text-foreground border border-border"
        }`}
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
        {bookmarked ? "В избранном" : "В избранное"}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg transition-all ${
        bookmarked
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      title={bookmarked ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
    </button>
  )
}

// Bookmark drawer/sidebar
function BookmarkDrawer() {
  const { bookmarks, isOpen, setIsOpen, removeBookmark, clearAll } = useBookmarks()

  // Close on escape
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

  const handleNavigate = (id: string) => {
    window.dispatchEvent(new CustomEvent("navigate-section", { detail: id }))
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
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
                  <Bookmark className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Избранное</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {bookmarks.length}
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
                {bookmarks.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground text-sm">
                      Нет сохраненных закладок
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Нажмите на иконку закладки в разделе, чтобы добавить
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <motion.div
                        key={bookmark.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleNavigate(bookmark.id)}
                      >
                        <span className="text-lg">{bookmark.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {bookmark.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bookmark.section}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeBookmark(bookmark.id)
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
              {bookmarks.length > 0 && (
                <div className="p-4 border-t-2 border-border">
                  <button
                    onClick={clearAll}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Очистить все
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
