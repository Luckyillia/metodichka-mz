"use client"

import type { SidebarItem } from "@/types/manualTypes"
import { useAuth } from "@/lib/auth/auth-context"
import { useMemo, useState, useEffect } from "react"
import { Menu, X, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
  sidebarItems: SidebarItem[]
  activeSection: string
  setActiveSection: (id: string) => void
  isMobileOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ 
  sidebarItems, 
  activeSection, 
  setActiveSection,
  isMobileOpen: externalIsMobileOpen,
  onClose
}: SidebarProps) {
  const { canAccessSection } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [internalIsMobileOpen, setInternalIsMobileOpen] = useState(false)

  const isMobileOpen = externalIsMobileOpen !== undefined ? externalIsMobileOpen : internalIsMobileOpen
  const setIsMobileOpen = onClose || setInternalIsMobileOpen

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile sidebar when section changes
  useEffect(() => {
    // Only close if we are currently open
    if (isMobileOpen) {
      if (onClose) {
        onClose();
      } else {
        setInternalIsMobileOpen(false);
      }
    }
  }, [activeSection]); // Removed isMobileOpen/externalIsMobileOpen from deps to avoid immediate closing on mount/toggle

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-3 bg-sidebar/95 backdrop-blur-md" suppressHydrationWarning>
      {/* Logo and Title */}
      <div className="pt-3 pb-4 border-b border-sidebar-border mb-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center text-xl flex-shrink-0">
            🏥
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-bold text-sidebar-foreground leading-tight">
              Министерство
            </h2>
            <h2 className="text-xs font-bold text-sidebar-foreground leading-tight">
              Здравоохранения
            </h2>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation items */}
      <ul className="space-y-1 list-none flex-1 overflow-y-auto custom-scrollbar">
        {mounted && visibleSidebarItems.map((item) => {
          if ('items' in item) {
            return (
              <li key={item.id} className="mb-4">
                <div className="px-3 py-2 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-[0.2em] mb-1">
                  {item.title}
                </div>
                <div className="space-y-0.5">
                  {item.items.map((navItem) => (
                    <button
                      key={navItem.id}
                      onClick={() => setActiveSection(navItem.id)}
                      className={`
                        w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200
                        flex items-center gap-3 group
                        ${
                          activeSection === navItem.id
                            ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 shadow-lg shadow-sidebar-primary/5"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        }
                      `}
                    >
                      <span className={`text-lg flex items-center justify-center flex-shrink-0 transition-transform group-active:scale-90 ${activeSection === navItem.id ? "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : ""}`}>
                        {navItem.icon}
                      </span>
                      <span className="text-xs font-medium leading-tight flex-1">
                        {navItem.title}
                      </span>
                      {activeSection === navItem.id && (
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      )}
                    </button>
                  ))}
                </div>
              </li>
            )
          }
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200
                  flex items-center gap-3 group
                  ${
                    activeSection === item.id
                      ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 shadow-lg shadow-sidebar-primary/5"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }
                `}
              >
                <span className={`text-lg flex items-center justify-center flex-shrink-0 transition-transform group-active:scale-90 ${activeSection === item.id ? "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : ""}`}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium leading-tight flex-1">
                  {item.title}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 z-40 border-r border-sidebar-border overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
