export const ACTION_TYPE_COLORS: Record<string, string> = {
  create: "bg-green-600",
  update: "bg-blue-600",
  delete: "bg-red-600",
  role_change: "bg-purple-600",
  login: "bg-teal-600",
  logout: "bg-gray-600",
  other: "bg-slate-600",
  restore: "bg-emerald-600",
  deactivate: "bg-orange-600",
}

export const ACTION_TYPE_LABELS: Record<string, string> = {
  create: "Создание",
  update: "Обновление",
  delete: "Удаление",
  role_change: "Смена роли",
  login: "Вход",
  logout: "Выход",
  other: "Другое",
  restore: "Восстановление",
  deactivate: "Деактивация",
}

export const TARGET_TYPE_LABELS: Record<string, string> = {
  user: "Пользователь",
  system: "Система",
  report: "Отчет",
  other: "Другое",
}

export const CRITICAL_ACTION_TYPES = ["delete", "deactivate", "role_change"]

export const WEEK_DAYS = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]

export const getActionTypeColor = (type: string): string =>
  ACTION_TYPE_COLORS[type] || "bg-gray-600"

export const getActionTypeLabel = (type: string): string =>
  ACTION_TYPE_LABELS[type] || type

export const getTargetTypeLabel = (type?: string): string => {
  if (!type) return "—"
  return TARGET_TYPE_LABELS[type] || type
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

export const isCriticalAction = (actionType: string): boolean =>
  CRITICAL_ACTION_TYPES.includes(actionType)