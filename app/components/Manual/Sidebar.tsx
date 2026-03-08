"use client"

import type { SidebarItem } from "@/types/manualTypes"
import { useAuth } from "@/lib/auth/auth-context"
import { useMemo, useState } from "react"
import { ChevronDown, Search, Menu, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
  sidebarItems: SidebarItem[]
  activeSection: string
  setActiveSection: (id: string) => void
}

export default function Sidebar({ sidebarItems, activeSection, setActiveSection }: SidebarProps) {
  const { canAccessSection } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const visibleSidebarItems = useMemo(() => {
    return sidebarItems
      .map((item) => {
        if ("items" in item) {
          const accessibleItems = item.items.filter((navItem) => canAccessSection(navItem.id))
          if (accessibleItems.length === 0) return null
          return { ...item, items: accessibleItems }
        }
        return canAccessSection(item.id) ? item : null
      })
      .filter(Boolean) as SidebarItem[]
  }, [sidebarItems, canAccessSection])

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return visibleSidebarItems

    return visibleSidebarItems
      .map((item) => {
        if ("items" in item) {
          const filteredSubItems = item.items.filter((navItem) =>
            navItem.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          if (filteredSubItems.length === 0) return null
          return { ...item, items: filteredSubItems }
        }
        if (item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return item
        }
        return null
      })
      .filter(Boolean) as SidebarItem[]
  }, [visibleSidebarItems, searchQuery])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMobileOpen(false)
  }

  const isGroupExpanded = (groupId: string) => {
    if (searchQuery.trim()) return true
    return expandedGroups.has(groupId)
  }

  return (
    <>
      {/* Mobile toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-xl glass-card lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={{ x: -280 }}
        animate={{ x: isMobileOpen ? 0 : typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -280 }}
        className="fixed left-0 top-0 h-screen w-72 z-40 bg-black/40 backdrop-blur-2xl border-r border-white/5 lg:translate-x-0"
      >
        {/* Gradient glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent" />
        </div>

        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative w-12 h-12 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-primary animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-[2px] bg-black rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold gradient-text">MZ</span>
                </div>
              </motion.div>
              <div>
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  Metodychka
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Premium Edition
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-white/10 placeholder:text-muted-foreground/60 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <ul className="space-y-1">
              {filteredItems.map((item, index) => {
                if ("items" in item) {
                  const isExpanded = isGroupExpanded(item.id)
                  const hasActiveChild = item.items.some((navItem) => navItem.id === activeSection)

                  return (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => toggleGroup(item.id)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300
                          ${hasActiveChild 
                            ? "bg-primary/10 text-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          }
                        `}
                      >
                        <span className="flex items-center gap-3">
                          {hasActiveChild && (
                            <motion.div 
                              layoutId="activeGroup"
                              className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50"
                            />
                          )}
                          {item.title}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 mt-1 pl-4 border-l border-white/10 space-y-0.5">
                              {item.items.map((navItem, subIndex) => (
                                <motion.li 
                                  key={navItem.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.03 }}
                                >
                                  <button
                                    onClick={() => handleNavigation(navItem.id)}
                                    className={`
                                      relative w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-300
                                      ${
                                        activeSection === navItem.id
                                          ? "text-foreground font-medium"
                                          : "text-muted-foreground hover:text-foreground"
                                      }
                                    `}
                                  >
                                    {activeSection === navItem.id && (
                                      <motion.div
                                        layoutId="activeItem"
                                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/10 rounded-lg"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                      />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                      {activeSection === navItem.id && (
                                        <div className="w-1 h-1 rounded-full bg-primary shadow-lg shadow-primary/50" />
                                      )}
                                      {navItem.title}
                                    </span>
                                  </button>
                                </motion.li>
                              ))}
                            </div>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  )
                }

                return (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className={`
                        relative w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-300
                        ${
                          activeSection === item.id
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }
                      `}
                    >
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="activeSingle"
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/10 rounded-xl border border-primary/20"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.title}</span>
                    </button>
                  </motion.li>
                )
              })}
            </ul>

            {filteredItems.length === 0 && searchQuery && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-12 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No results for "{searchQuery}"
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-muted-foreground">
                v3.0 Premium
              </p>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
