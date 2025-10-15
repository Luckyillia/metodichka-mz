"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { navItems } from "@/data/manualData"

const OverviewSection = () => {
  const { canAccessSection } = useAuth()

  // Маппинг между ID секций и их описаниями
  const sectionDescriptions: Record<string, string> = {
    "lectures": "Проведение учебных занятий",
    "training": "Организация практических занятий",
    "events": "Список основных мероприятий МЗ",
    "rp-task": "Практические применение изученного материала",
    "exam-section": "Процедуры проведения экзаменов",
    "medical-commission": "Алгоритмы проведения медицинской комиссии",
    "interview": "Шаблонные действия при собеседовании",
    "medications": "Справочник медицинских препаратов",
    "medical-card": "Работа с медицинскими картами",
    "goss-wave": "Работа с государственной волной",
    "announcements": "Стандартные отписи в ДО",
    "forum-responses": "Краткое описание для работы по форуму",
    "report-generator": "Инструмент для создания отчетов",
    "user-management": "Администрирование пользователей системы",
    "action-log": "История действий в системе"
  }

  // Создаем секции на основе navItems (кроме overview)
  const sections = navItems
    .filter(item => item.id !== "overview")
    .map(item => ({
      id: item.id,
      title: item.title,
      description: sectionDescriptions[item.id] || "Описание раздела",
      icon: "•"
    }))

  // Фильтруем секции по правам доступа
  const accessibleSections = sections.filter(section => canAccessSection(section.id))

  return (
    <div className="space-y-6">
      <div className="subsection">
        <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
          <span>📋</span>
          Разделы методички:
        </h3>
        <ul className="space-y-3 text-slate-200">
          {accessibleSections.map((section) => (
            <li key={section.id} className="flex items-start gap-3">
              <span className="text-red-400 mt-1">{section.icon}</span>
              <div>
                <strong className="text-white">{section.title}</strong> - {section.description}
              </div>
            </li>
          ))}
        </ul>

        {accessibleSections.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            Нет доступных разделов для вашей роли.
          </div>
        )}
      </div>

      {/* Примечание о цветовой индикации фраз */}
      <div className="subsection">
        <div className="flex items-start gap-3">
          <span className="text-red-400 text-lg">ℹ️</span>
          <div className="text-sm text-slate-300">
            <p className="mb-2">
              <strong className="text-slate-200">Цветовая индикация фраз копирования:</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-blue-500 border border-green-400/50"></div>
                <span className="text-green-300">МС - Младший состав</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-600 border border-orange-400/50"></div>
                <span className="text-orange-300">СС - Старший состав</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-amber-100">
            <strong className="text-amber-200">Важно:</strong> Данная методичка содержит большинство инструкций для
            работы. Используйте навигацию слева для быстрого перехода к нужному разделу.
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewSection
