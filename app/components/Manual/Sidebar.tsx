"use client"

import type { NavItem } from "@/types/manualTypes"
import { useAuth } from "@/lib/auth/auth-context"

interface SidebarProps {
  navItems: NavItem[]
  activeSection: string
  setActiveSection: (id: string) => void
}

export default function Sidebar({ navItems, activeSection, setActiveSection }: SidebarProps) {
  const { canAccessSection } = useAuth()

  return (
    <nav className="modern-sidebar fixed left-0 top-0 h-screen w-64 z-40 overflow-hidden">
      <div className="flex flex-col h-full p-3">
        {/* Logo and Title */}
        <div className="pt-3 pb-4 border-b-2 border-sidebar-border mb-3">
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
          </div>
        </div>

        {/* Navigation items */}
        <ul className="space-y-1 list-none flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasAccess = canAccessSection(item.id)

            if (!hasAccess) {
              return null
            }

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-all duration-200 
                    flex items-center gap-2
                    ${
                      activeSection === item.id
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <span className="text-base min-w-[20px] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-xs leading-tight flex-1">
                    {item.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
