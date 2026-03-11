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
  
  export const formatRelativeTime = (dateString?: string | null): string => {
    if (!dateString) return "Никогда"
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "только что"
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) return "1 минуту назад"
      if (diffInMinutes >= 2 && diffInMinutes <= 4) return `${diffInMinutes} минуты назад`
      return `${diffInMinutes} минут назад`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      if (diffInHours === 1) return "1 час назад"
      if (diffInHours >= 2 && diffInHours <= 4) return `${diffInHours} часа назад`
      return `${diffInHours} часов назад`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      if (diffInDays === 1) return "вчера"
      if (diffInDays >= 2 && diffInDays <= 4) return `${diffInDays} дня назад`
      return `${diffInDays} дней назад`
    }
    
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }