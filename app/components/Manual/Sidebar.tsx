"use client"

import type { SidebarItem } from "@/types/manualTypes"
import { useAuth } from "@/lib/auth/auth-context"
import { useMemo, useState } from "react"
import { ChevronDown, Search, Menu, X } from "lucide-react"

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
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card border border-border lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          modern-sidebar fixed left-0 top-0 h-screen w-64 z-40
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">MZ</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-sidebar-foreground">
                  Metodychka
                </h2>
                <p className="text-xs text-muted-foreground">
                  Documentation
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-sidebar-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-sidebar-accent border border-sidebar-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {filteredItems.map((item) => {
                if ("items" in item) {
                  const isExpanded = isGroupExpanded(item.id)
                  const hasActiveChild = item.items.some((navItem) => navItem.id === activeSection)

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => toggleGroup(item.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <ul
                        className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ${
                          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.items.map((navItem) => (
                          <li key={navItem.id}>
                            <button
                              onClick={() => handleNavigation(navItem.id)}
                              className={`
                                w-full text-left px-3 py-1.5 ml-3 text-sm rounded-md transition-colors
                                border-l-2
                                ${
                                  activeSection === navItem.id
                                    ? "border-primary bg-sidebar-accent text-sidebar-foreground font-medium"
                                    : "border-transparent text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                                }
                              `}
                            >
                              {navItem.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                }

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className={`
                        w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                        ${
                          activeSection === item.id
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }
                      `}
                    >
                      {item.title}
                    </button>
                  </li>
                )
              })}
            </ul>

            {filteredItems.length === 0 && searchQuery && (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              v2.0 - Modern Edition
            </p>
          </div>
        </div>
      </nav>
    </>
  )
}
