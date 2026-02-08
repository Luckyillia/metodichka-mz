import { useCallback, useMemo } from "react"
import type { User as UserType } from "@/lib/auth/types"
import type { UserTab } from "../types"

export const useUserFilters = (
  users: UserType[],
  currentUserRole: string | undefined,
  activeTab: UserTab,
  filterRole: string,
  filterCity: string,
  filterOrder: string,
  sortOrder: 'asc' | 'desc',
  searchQuery: string
) => {
  const applyFilters = useCallback((usersList: UserType[]): UserType[] => {
    let filtered = usersList

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      filtered = filtered.filter((u) => {
        const username = String((u as any).username || "").toLowerCase()
        const gameNick = String((u as any).game_nick || "").toLowerCase()
        const id = String((u as any).id || "").toLowerCase()
        return username.includes(q) || gameNick.includes(q) || id.includes(q)
      })
    }

    // Фильтр по роли
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole)
    }

    // Фильтр по городу
    if (filterCity !== "all") {
      filtered = filtered.filter((u) => u.city === filterCity)
    }

    if (filterOrder !== "all") {
      // Create local constant to fix TypeScript narrowing issue
      const currentSortOrder = sortOrder;
      filtered = [...filtered].sort((a, b) => {
        const aValue = String(a[filterOrder as keyof UserType] ?? '');
        const bValue = String(b[filterOrder as keyof UserType] ?? '');
        
        if (currentSortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return filtered
  }, [filterCity, filterOrder, filterRole, searchQuery, sortOrder])

  const getFilteredUsersByRole = useCallback((usersList: UserType[]): UserType[] => {
    // Лидер видит только user, cc и ld своего города
    if (currentUserRole === "ld") {
      return usersList.filter((u) => 
        (u.role === "cc" || u.role === "user" || u.role === "ld")
      )
    }
    // Админ видит всех, кроме других админов и root в запросах
    if (currentUserRole === "admin") {
      if (usersList.some(u => u.status === "request")) {
        return usersList.filter((u) => 
          u.role === "cc" || u.role === "user" || u.role === "ld"
        )
      }
      return usersList
    }
    // Root видит всех
    return usersList
  }, [currentUserRole])

  const activeUsers = useMemo(() => 
    applyFilters(getFilteredUsersByRole(users.filter((u) => u.status === "active"))), 
    [applyFilters, getFilteredUsersByRole, users]
  )
  
  const inactiveUsers = useMemo(() => 
    applyFilters(getFilteredUsersByRole(users.filter((u) => u.status === "inactive"))), 
    [applyFilters, getFilteredUsersByRole, users]
  )
  
  const requestUsers = useMemo(() => 
    applyFilters(getFilteredUsersByRole(users.filter((u) => u.status === "request"))), 
    [applyFilters, getFilteredUsersByRole, users]
  )

  const filteredUsers = useMemo(() => {
    return activeTab === 'active' 
      ? activeUsers
      : activeTab === 'inactive' 
      ? inactiveUsers
      : requestUsers
  }, [activeTab, activeUsers, inactiveUsers, requestUsers])

  const stats = useMemo(() => {
    const allUsers = users.filter(u => {
      if (currentUserRole === "ld") {
        return u.role === "cc" || u.role === "user" || u.role === "ld"
      }
      return true
    })

    const filteredActive = applyFilters(allUsers.filter(u => u.status === "active"))
    const filteredInactive = applyFilters(allUsers.filter(u => u.status === "inactive"))
    const filteredRequests = applyFilters(getFilteredUsersByRole(allUsers.filter(u => u.status === "request")))

    return {
      total: filteredActive.length + filteredInactive.length + filteredRequests.length,
      active: filteredActive.length,
      inactive: filteredInactive.length,
      requests: filteredRequests.length,
      admins: filteredActive.filter(u => u.role === "admin" || u.role === "root").length,
      leaders: filteredActive.filter(u => u.role === "ld").length,
      cc: filteredActive.filter(u => u.role === "cc").length,
      regularUsers: filteredActive.filter(u => u.role === "user").length,
    }
  }, [applyFilters, getFilteredUsersByRole, users, currentUserRole])

  return {
    activeUsers,
    inactiveUsers,
    requestUsers,
    filteredUsers,
    getFilteredUsersByRole,
    stats
  }
}