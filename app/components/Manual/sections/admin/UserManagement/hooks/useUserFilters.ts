
// app/components/Manual/sections/admin/UserManagement/hooks/useUserFilters.ts (обновлённый)
import { useMemo } from "react"
import type { User as UserType } from "@/lib/auth/types"
import type { UserTab } from "../types"

export const useUserFilters = (
  users: UserType[],
  currentUserRole: string | undefined,
  activeTab: UserTab,
  filterRole: string,
  filterCity: string
) => {
  const activeUsers = useMemo(() => users.filter((u) => u.status === "active"), [users])
  const inactiveUsers = useMemo(() => users.filter((u) => u.status === "inactive"), [users])
  const requestUsers = useMemo(() => users.filter((u) => u.status === "request"), [users])

  const getFilteredUsersByRole = (usersList: UserType[]): UserType[] => {
    if (currentUserRole === "ld") {
      return usersList.filter((u) => u.role === "cc" || u.role === "user" || u.role === "ld")
    }
    if (currentUserRole === "admin") {
      if (usersList === requestUsers) {
        return usersList.filter((u) => u.role === "cc" || u.role === "user" || u.role === "ld")
      }
      return usersList
    }
    return usersList
  }

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

    return filtered
  }

  const filteredUsers = useMemo(() => {
    const usersList = activeTab === 'active' 
      ? activeUsers
      : activeTab === 'inactive' 
      ? inactiveUsers
      : requestUsers
    
    const roleFiltered = getFilteredUsersByRole(usersList)
    return applyFilters(roleFiltered)
  }, [activeTab, activeUsers, inactiveUsers, requestUsers, currentUserRole, filterRole, filterCity])

  const stats = useMemo(() => ({
    total: users.length,
    active: activeUsers.length,
    inactive: inactiveUsers.length,
    requests: getFilteredUsersByRole(requestUsers).length,
    admins: users.filter((u) => (u.role === "admin" || u.role === "root") && u.status === "active").length,
    leaders: users.filter((u) => u.role === "ld" && u.status === "active").length,
    cc: users.filter((u) => u.role === "cc" && u.status === "active").length,
    regularUsers: users.filter((u) => u.role === "user" && u.status === "active").length,
  }), [users, activeUsers, inactiveUsers, requestUsers, currentUserRole])

  return {
    activeUsers,
    inactiveUsers,
    requestUsers,
    filteredUsers,
    getFilteredUsersByRole,
    stats
  }
}
