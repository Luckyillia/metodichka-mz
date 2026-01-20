import type { SidebarItem } from "@/types/manualTypes"

export const sidebarItems: SidebarItem[] = [
  {
    id: "ms-group",
    title: "Младший состав",
    items: [
      { id: "overview", title: "Главная", icon: "🏠" },
      { id: "positions", title: "Должности МЗ", icon: "👔" },
      { id: "ms-unified-content", title: "РП сценарии", icon: "🔗" },
      { id: "commands", title: "Бинды и доклады", icon: "💬" },
      { id: "medical-commission", title: "Мед.комиссия для срочной службы", icon: "🏥" },
      { id: "interview", title: "Собеседование", icon: "👥" },
      { id: "medications", title: "Препараты", icon: "💊" },
      { id: "medical-card", title: "Мед.карта", icon: "📋" },
      { id: "vehicles", title: "Транспорт МЗ", icon: "🚑" },
    ]
  },
  {
    id: "ss-group",
    title: "Старший состав",
    items: [
      { id: "ss-unified-content", title: "Обучение", icon: "📚" },
      { id: "exam-section", title: "Правила проведения экзаменов", icon: "📝" },
      { id: "goss-wave", title: "Гос Волна", icon: "📻" },
      { id: "announcements", title: "Шаблоны для Доски Объявлений", icon: "📢" },
      { id: "forum-responses", title: "Работа по форуму", icon: "💬" },
      { id: "report-generator", title: "Генератор отчетов", icon: "📝" },
    ]
  },
  {
    id: "leader-group",
    title: "Лидер",
    items: [
      { id: "leader-report-generator", title: "Генератор отчета лидера", icon: "📊" },
    ]
  },
  {
    id: "admin-group",
    title: "Администрирование",
    items: [
      { id: "gs-report-generator", title: "Генератор отчета ГС", icon: "🗂️" },
      { id: "promotion-system", title: "Система продвижения", icon: "📈" },
      { id: "user-management", title: "Управление пользователями", icon: "👥" },
      { id: "action-log", title: "Журнал действий", icon: "📋" },
    ]
  }
]

// Для обратной совместимости оставляем старый экспорт
export const navItems = sidebarItems.flatMap(item =>
  'items' in item ? item.items : [item]
)
