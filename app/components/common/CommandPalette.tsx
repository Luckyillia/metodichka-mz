"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { 
  Search, 
  FileText, 
  User, 
  Shield, 
  Pill, 
  Car, 
  Clipboard,
  GraduationCap,
  Radio,
  Megaphone,
  MessageSquare,
  FileBarChart,
  Users,
  ScrollText,
  Award,
  History,
  Bookmark,
  X
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { sidebarItems } from "@/data/manualData"
import { motion, AnimatePresence } from "framer-motion"

interface CommandItem {
  id: string
  title: string
  icon: React.ReactNode
  shortcut?: string
  section: string
  keywords: string[]
  action: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()
  const { canAccessSection, user } = useAuth()

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Get icon by section
  const getIcon = (id: string) => {
    const icons: Record<string, React.ReactNode> = {
      overview: <FileText className="w-4 h-4" />,
      positions: <Award className="w-4 h-4" />,
      "ms-unified-content": <ScrollText className="w-4 h-4" />,
      commands: <MessageSquare className="w-4 h-4" />,
      "medical-commission": <Clipboard className="w-4 h-4" />,
      interview: <User className="w-4 h-4" />,
      medications: <Pill className="w-4 h-4" />,
      "medical-card": <FileText className="w-4 h-4" />,
      vehicles: <Car className="w-4 h-4" />,
      "ss-unified-content": <GraduationCap className="w-4 h-4" />,
      "exam-section": <Clipboard className="w-4 h-4" />,
      "goss-wave": <Radio className="w-4 h-4" />,
      announcements: <Megaphone className="w-4 h-4" />,
      "forum-responses": <MessageSquare className="w-4 h-4" />,
      "report-generator": <FileBarChart className="w-4 h-4" />,
      "leader-report-generator": <FileBarChart className="w-4 h-4" />,
      "gs-report-generator": <Shield className="w-4 h-4" />,
      "user-management": <Users className="w-4 h-4" />,
      "action-log": <History className="w-4 h-4" />,
      "promotion-system": <Award className="w-4 h-4" />,
      "biography-validator": <Shield className="w-4 h-4" />,
    }
    return icons[id] || <FileText className="w-4 h-4" />
  }

  // Build commands list
  const commands = useMemo(() => {
    const items: CommandItem[] = []

    // Add sections from sidebar
    sidebarItems.forEach((group) => {
      if ("items" in group) {
        group.items.forEach((item) => {
          if (canAccessSection(item.id)) {
            items.push({
              id: item.id,
              title: item.title,
              icon: getIcon(item.id),
              section: group.title,
              keywords: [item.title, group.title, item.id],
              action: () => {
                window.dispatchEvent(new CustomEvent("navigate-section", { detail: item.id }))
                setOpen(false)
              }
            })
          }
        })
      }
    })

    // Add quick actions
    items.push(
      {
        id: "copy-last",
        title: "Скопировать последнюю фразу",
        icon: <Clipboard className="w-4 h-4" />,
        shortcut: "Ctrl+Shift+C",
        section: "Быстрые действия",
        keywords: ["копировать", "фраза", "clipboard"],
        action: () => {
          // This would need to be implemented with a global state
          setOpen(false)
        }
      },
      {
        id: "bookmarks",
        title: "Открыть избранное",
        icon: <Bookmark className="w-4 h-4" />,
        shortcut: "Ctrl+B",
        section: "Быстрые действия",
        keywords: ["избранное", "bookmarks", "закладки"],
        action: () => {
          window.dispatchEvent(new CustomEvent("toggle-bookmarks"))
          setOpen(false)
        }
      }
    )

    // Admin quick actions
    if (user?.role === "admin" || user?.role === "root") {
      items.push({
        id: "admin-dashboard",
        title: "Панель администратора",
        icon: <Shield className="w-4 h-4" />,
        section: "Администрирование",
        keywords: ["admin", "админ", "панель"],
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-section", { detail: "user-management" }))
          setOpen(false)
        }
      })
    }

    return items
  }, [canAccessSection, user])

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return commands
    
    const lowerSearch = search.toLowerCase()
    return commands.filter((cmd) => {
      const titleMatch = cmd.title.toLowerCase().includes(lowerSearch)
      const keywordMatch = cmd.keywords.some((k) => k.toLowerCase().includes(lowerSearch))
      return titleMatch || keywordMatch
    })
  }, [commands, search])

  // Group commands by section
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.section]) {
        groups[cmd.section] = []
      }
      groups[cmd.section].push(cmd)
    })
    return groups
  }, [filteredCommands])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl mx-4 bg-card border-2 border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="w-full" loop>
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Поиск разделов, команд, действий..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Results */}
              <Command.List className="max-h-[50vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Ничего не найдено</p>
                    <p className="text-sm opacity-70 mt-1">
                      Попробуйте другие ключевые слова
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([section, items]) => (
                    <Command.Group
                      key={section}
                      heading={section}
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2"
                    >
                      {items.map((item) => (
                        <Command.Item
                          key={item.id}
                          onSelect={item.action}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                        >
                          <span className="text-muted-foreground">{item.icon}</span>
                          <span className="flex-1">{item.title}</span>
                          {item.shortcut && (
                            <kbd className="px-2 py-0.5 text-xs bg-muted rounded text-muted-foreground">
                              {item.shortcut}
                            </kbd>
                          )}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))
                )}
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t-2 border-border bg-muted/30 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
                    <span>навигация</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
                    <span>выбрать</span>
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
                  <span>закрыть</span>
                </span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
