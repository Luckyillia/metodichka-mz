import { useMemo } from "react"
import type { User as UserType } from "@/lib/auth/types"
import type { UserTab } from "../types"

export const useUserFilters = (
  users: UserType[],
  currentUserRole: string | undefined,
  activeTab: UserTab,
  filterRole: string,
  filterCity: string,
  filterOrder: string,
  sortOrder: 'asc' | 'desc'
) => {
  const applyFilters = (usersList: UserType[]): UserType[] => {
    let filtered = usersList

    // Фильтр по роли
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole)
    }

    // Фильтр по городу
    if (filterCity !== "all") {
      filtered = filtered.filter((u) => u.city === filterCity)
    }

    if (filterOrder !== "all") {
      filtered = [...filtered].sort((a, b) => {
        const aValue = String(a[filterOrder as keyof UserType] ?? '');
        const bValue = String(b[filterOrder as keyof UserType] ?? '');
        
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return filtered
  }

  const getFilteredUsersByRole = (usersList: UserType[]): UserType[] => {
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
  }

  const activeUsers = useMemo(() => 
    applyFilters(getFilteredUsersByRole(users.filter((u) => u.status === "active"))), 
    [users, currentUserRole, filterRole, filterCity, filterOrder, sortOrder]
  )
  
  const inactiveUsers = useMemo(() => 
    applyFilters(getFilteredUsersByRole(users.filter((u) => u.status === "inactive"))), 
    [users, currentUserRole, filterRole, filterCity, filterOrder, sortOrder]
  )
  
  const requestUsers = useMemo(() => 
    applyFilters(getFilteredUsersByRole(users.filter((u) => u.status === "request"))), 
    [users, currentUserRole, filterRole, filterCity, filterOrder, sortOrder]
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
  }, [users, currentUserRole, filterRole, filterCity, filterOrder, sortOrder])

  return {
    activeUsers,
    inactiveUsers,
    requestUsers,
    filteredUsers,
    getFilteredUsersByRole,
    stats
  }
}