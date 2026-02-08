export const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "root":
        return "bg-purple-600 text-white"
      case "admin":
        return "bg-red-600 text-white"
      case "ld":
        return "bg-pink-600 text-white"
      case "cc":
        return "bg-blue-600 text-white"
      case "instructor":
        return "bg-amber-600 text-white"
      case "user":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }
  
  export const getCityLabel = (city: string): string => {
    switch (city) {
      case "CGB-N":
        return "Невский"
      case "CGB-P":
        return "Приволжск"
      case "OKB-M":
        return "Мирный"
      default:
        return city
    }
  }
  
  export const getCityBadgeColor = (city: string): string => {
    switch (city) {
      case "CGB-N":
        return "bg-red-500/15 text-red-700 dark:text-red-300 border-border"
      case "CGB-P":
        return "bg-green-500/15 text-green-700 dark:text-green-300 border-border"
      case "OKB-M":
        return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }
  
  export const getRoleLabel = (role: string, city?: string): string => {
    switch (role) {
      case "root":
        return "Суперадмин"
      case "admin":
        return "Администратор"
      case "ld":
        return "Лидер"
      case "cc":
        return "СС"
      case "instructor":
        return "Инструктор"
      case "user":
        return "Участник"
      default:
        return role
    }
  }
  
  export const getActionTypeLabel = (actionType: string): string => {
    const labels: Record<string, string> = {
      create: "Создание",
      update: "Обновление",
      delete: "Удаление",
      role_change: "Изменение роли",
      deactivate: "Деактивация",
      restore: "Восстановление",
      login: "Вход",
      logout: "Выход",
      other: "Другое",
    }
    return labels[actionType] || actionType
  }