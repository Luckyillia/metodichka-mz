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
      case "user":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }
  
  export const getCityLabel = (city: string): string => {
    switch (city) {
      case "CGB-N":
        return "ЦГБ-Н"
      case "CGB-P":
        return "ЦГБ-П"
      case "OKB-M":
        return "ОКБ-М"
      default:
        return city
    }
  }
  
  export const getRoleLabel = (role: string, city?: string): string => {
    const cityLabel = city ? ` ${getCityLabel(city)}` : ''
    switch (role) {
      case "root":
        return "Суперадмин"
      case "admin":
        return "Администратор"
      case "ld":
        return `Лидер${cityLabel}`
      case "cc":
        return `СС${cityLabel}`
      case "user":
        return `Участник${cityLabel}`
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