"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { navItems } from "@/data/manualData"
import { ProgressStats } from "@/app/components/common/LearningProgress"

interface OverviewSectionProps {
  setActiveSection?: (id: string) => void
}

const OverviewSection = ({ setActiveSection }: OverviewSectionProps = {}) => {
  const { canAccessSection } = useAuth()

  // Маппинг между ID секций и их описаниями
  const sectionDescriptions: Record<string, string> = {
    "positions": "Иерархия должностей и рангов МЗ",
    "ms-unified-content": "РП сценарии для младшего состава",
    "ss-unified-content": "Обучающие материалы для старшего состава",
    "commands": "Команды и шаблоны для отыгровки",
    "exam-section": "Правила и процедуры проведения экзаменов",
    "medical-commission": "Алгоритмы проведения медицинской комиссии",
    "interview": "Шаблоны и процедуры собеседования",
    "medications": "Справочник медицинских препаратов",
    "medical-card": "Работа с медицинскими картами пациентов",
    "vehicles": "Транспортные средства МЗ",
    "goss-wave": "Работа с государственной волной связи",
    "announcements": "Шаблоны объявлений для доски объявлений",
    "forum-responses": "Шаблоны ответов для работы по форуму",
    "report-generator": "Генератор отчетов для старшего состава",
    "user-management": "Управление пользователями системы",
    "action-log": "Журнал действий и история изменений"
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
      {/* Заголовок главной страницы */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-300 mb-2">Министерство Здравоохранения</h1>
        <h2 className="text-2xl font-semibold text-slate-200 mb-1">Методическое пособие</h2>
        <p className="text-slate-400">Справочно-информационный портал для сотрудников</p>
      </div>
      {/* Важное уточнение - в самом начале */}
      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="text-red-100">
            <strong className="text-red-200 block mb-3">Важное уточнение</strong>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Данная методичка может содержать неточности или устаревшую информацию</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Материалы служат основой для изучения, но не являются окончательным источником</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>При возникновении спорных вопросов обращайтесь к актуальным регламентам</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>Администрация не несет ответственности за возможные ошибки в содержании</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Прогресс обучения - оставляем только его */}
      <div className="w-full">
        <ProgressStats />
      </div>

      {/* Статистические тайлы */}
      <div className="subsection">
        <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
          <span>📊</span>
          Статистика методички
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-4 border border-blue-700/50 text-center">
            <div className="text-2xl font-bold text-blue-200">{accessibleSections.length}</div>
            <div className="text-sm text-blue-100">Доступных разделов</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-lg p-4 border border-green-700/50 text-center">
            <div className="text-2xl font-bold text-green-200">30+</div>
            <div className="text-sm text-green-100">Препаратов</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-4 border border-purple-700/50 text-center">
            <div className="text-2xl font-bold text-purple-200">4</div>
            <div className="text-sm text-purple-100">Транспортных средств</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 rounded-lg p-4 border border-orange-700/50 text-center">
            <div className="text-2xl font-bold text-orange-200">50+</div>
            <div className="text-sm text-orange-100">Шаблонов и команд</div>
          </div>
        </div>
      </div>

      <div className="subsection">
        <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
          <span>📋</span>
          Разделы методички:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accessibleSections.map((section) => (
            <div
              key={section.id}
              onClick={() => setActiveSection?.(section.id)}
              className="flex flex-col gap-2 p-4 rounded-lg bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-700/50 hover:border-red-600/70 hover:bg-gradient-to-br hover:from-red-900/50 hover:to-red-800/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">{section.icon}</span>
                <strong className="text-white text-sm">{section.title}</strong>
              </div>
              <p className="text-xs text-slate-300">
                {section.description}
              </p>
            </div>
          ))}
        </div>

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
