"use client"

import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, CheckCircle, Circle, Lock, Trophy, Target, BarChart2, Clock } from "lucide-react"
import { AuthService } from "@/lib/auth/auth-service"
import type { UserRole } from "@/lib/auth/types"
// Progress bar component
function SimpleProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${className || "h-2"}`}>
      <div 
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

interface SectionProgress {
  sectionId: string
  completed: boolean
  lastViewedAt: number | null
  timeSpent: number // in seconds
  interactions: number // clicks, copies, etc
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (progress: Record<string, SectionProgress>) => boolean
  unlockedAt: number | null
  roles?: UserRole[]
}

interface ProgressContextType {
  progress: Record<string, SectionProgress>
  updateProgress: (sectionId: string, updates: Partial<SectionProgress>) => void
  markCompleted: (sectionId: string) => void
  addTimeSpent: (sectionId: string, seconds: number) => void
  recordInteraction: (sectionId: string) => void
  resetProgress: () => void
  setCompletedForSections: (sectionIds: string[], completed: boolean) => void
  setAllCompleted: (completed: boolean) => void
  getOverallProgress: () => number
  getCompletedCount: () => number
  getTotalSections: () => number
  achievements: Achievement[]
  unlockedAchievements: Achievement[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const STORAGE_KEY = "mz-learning-progress"
const ACHIEVEMENTS_STORAGE_KEY = "mz-achievements"

function getAccessibleSectionIds(role: UserRole): string[] {
  const allKnownSections = [
    "overview",
    "ms-unified-content",
    "commands",
    "rp-task",
    "parking-spaces",
    "medical-commission",
    "interview",
    "medications",
    "medical-card",
    "vehicles",
    "positions",
    "exam-section",
    "ss-unified-content",
    "goss-wave",
    "announcements",
    "forum-responses",
    "report-generator",
    "promotion-system",
    "leader-report-generator",
    "user-management",
    "gs-report-generator",
    "action-log",
    "biography-validator",
  ]

  const fakeUser = { role } as any
  return allKnownSections.filter((id) => AuthService.canAccessSection(fakeUser, id))
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "root":
      return "Root"
    case "admin":
      return "Админ"
    case "ld":
      return "Лидер"
    case "cc":
      return "СС"
    case "instructor":
      return "Инструктор"
    case "user":
      return "Пользователь"
    default:
      return role
  }
}

// Predefined achievements - улучшенная логичная система
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Начальные достижения
  {
    id: "first-steps",
    title: "Первое знакомство",
    description: "Открыть любой раздел методички",
    icon: "👋",
    condition: (progress) => Object.values(progress).some((p) => p.lastViewedAt !== null),
    unlockedAt: null
  },
  {
    id: "reader",
    title: "Читатель",
    description: "Открыть 5 различных разделов",
    icon: "📖",
    condition: (progress) => Object.values(progress).filter((p) => p.lastViewedAt !== null).length >= 5,
    unlockedAt: null
  },
  {
    id: "scholar",
    title: "Знаток",
    description: "Открыть 10 различных разделов",
    icon: "🎓",
    condition: (progress) => Object.values(progress).filter((p) => p.lastViewedAt !== null).length >= 10,
    unlockedAt: null
  },
  
  // Достижения за изучение
  {
    id: "completed-one",
    title: "Первый шаг",
    description: "Отметить первый раздел как изученный",
    icon: "✅",
    condition: (progress) => Object.values(progress).filter(p => p.completed).length >= 1,
    unlockedAt: null
  },
  {
    id: "halfway",
    title: "На полпути",
    description: "Изучить 50% разделов",
    icon: "🎯",
    condition: (progress) => {
      const completed = Object.values(progress).filter(p => p.completed).length
      const total = Object.keys(progress).length
      return total >= 4 && completed / total >= 0.5
    },
    unlockedAt: null
  },
  {
    id: "master",
    title: "Мастер МЗ",
    description: "Изучить все разделы",
    icon: "🏆",
    condition: (progress) => {
      const completed = Object.values(progress).filter(p => p.completed).length
      const total = Object.keys(progress).length
      return total > 0 && completed === total
    },
    unlockedAt: null
  },
  
  // Роль-зависимые достижения
  {
    id: "admin-audit",
    title: "Контроль качества",
    description: "Для админов: открыть Журнал действий",
    icon: "🛡️",
    roles: ["admin", "root"],
    condition: (progress) => !!progress["action-log"]?.lastViewedAt,
    unlockedAt: null,
  },
  {
    id: "admin-users",
    title: "Управленец",
    description: "Для админов: открыть Управление пользователями",
    icon: "👥",
    roles: ["admin", "root", "ld"],
    condition: (progress) => !!progress["user-management"]?.lastViewedAt,
    unlockedAt: null,
  },
  {
    id: "leader-growth",
    title: "Рост состава",
    description: "Для лидеров: открыть Систему повышений",
    icon: "📈",
    roles: ["ld"],
    condition: (progress) => !!progress["promotion-system"]?.lastViewedAt,
    unlockedAt: null,
  },
  {
    id: "cc-exam",
    title: "Экзаменатор",
    description: "Для СС: открыть экзаменационный раздел",
    icon: "📝",
    roles: ["cc", "ld", "admin", "root"],
    condition: (progress) => !!progress["exam-section"]?.lastViewedAt,
    unlockedAt: null,
  },
  {
    id: "instructor-training",
    title: "Наставник",
    description: "Для инструкторов: открыть материалы СС",
    icon: "🧑‍🏫",
    roles: ["instructor"],
    condition: (progress) => !!progress["ss-unified-content"]?.lastViewedAt,
    unlockedAt: null,
  },
  
  // Достижения за время
  {
    id: "time-begins",
    title: "Начало пути",
    description: "Провести 5 минут в методичке",
    icon: "🕐",
    condition: (progress) => 
      Object.values(progress).reduce((sum, p) => sum + p.timeSpent, 0) >= 300,
    unlockedAt: null
  },
  {
    id: "dedicated",
    title: "Усердный ученик",
    description: "Провести 30 минут в обучении",
    icon: "⏱️",
    condition: (progress) => 
      Object.values(progress).reduce((sum, p) => sum + p.timeSpent, 0) >= 1800,
    unlockedAt: null
  },
  {
    id: "marathon",
    title: "Марафонец",
    description: "Провести 2 часа в методичке",
    icon: "🏃",
    condition: (progress) => 
      Object.values(progress).reduce((sum, p) => sum + p.timeSpent, 0) >= 7200,
    unlockedAt: null
  },
  
  // Достижения за активность
  {
    id: "active",
    title: "Активный",
    description: "Выполнить 10 действий",
    icon: "⚡",
    condition: (progress) => 
      Object.values(progress).reduce((sum, p) => sum + p.interactions, 0) >= 10,
    unlockedAt: null
  },
  {
    id: "expert",
    title: "Эксперт",
    description: "Выполнить 50 действий",
    icon: "💫",
    condition: (progress) => 
      Object.values(progress).reduce((sum, p) => sum + p.interactions, 0) >= 50,
    unlockedAt: null
  },
  
  // Достижение за возвращение
  {
    id: "regular",
    title: "Постоянство",
    description: "Изучать методичку 3 дня подряд",
    icon: "🔄",
    condition: (progress) => {
      const viewDates = Object.values(progress)
        .map(p => p.lastViewedAt)
        .filter(Boolean)
        .map(t => new Date(t!).toDateString())
      const uniqueDates = [...new Set(viewDates)]
      return uniqueDates.length >= 3
    },
    unlockedAt: null
  }
]

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<string, SectionProgress>>({})
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const role = (AuthService.getCurrentUser()?.role || "user") as UserRole
  const accessibleSectionIds = useMemo(() => getAccessibleSectionIds(role), [role])

  // Ensure progress has entries for all accessible sections (so totals are not "static" / incomplete)
  useEffect(() => {
    if (!isLoaded) return
    if (accessibleSectionIds.length === 0) return

    setProgress((prev) => {
      let changed = false
      const next = { ...prev }

      for (const sectionId of accessibleSectionIds) {
        if (!next[sectionId]) {
          changed = true
          next[sectionId] = {
            sectionId,
            completed: false,
            lastViewedAt: null,
            timeSpent: 0,
            interactions: 0,
          }
        }
      }

      return changed ? next : prev
    })
  }, [accessibleSectionIds, isLoaded])

  // Load data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const storedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)
    
    if (stored) {
      try {
        setProgress(JSON.parse(stored))
      } catch {
        console.error("Failed to parse progress")
      }
    }

    if (storedAchievements) {
      try {
        const storedAchievementsData = JSON.parse(storedAchievements)
        // Merge stored achievements with default ones to preserve condition functions
        setAchievements(DEFAULT_ACHIEVEMENTS.map(defaultAchievement => {
          const storedAchievement = storedAchievementsData.find((a: any) => a.id === defaultAchievement.id)
          return storedAchievement 
            ? { ...defaultAchievement, unlockedAt: storedAchievement.unlockedAt }
            : defaultAchievement
        }))
      } catch {
        console.error("Failed to parse achievements")
      }
    }
    
    setIsLoaded(true)
  }, [])

  // Save progress
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  }, [progress, isLoaded])

  // Check and unlock achievements
  useEffect(() => {
    if (!isLoaded) return

    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.unlockedAt) return achievement

        if (achievement.roles && !achievement.roles.includes(role)) {
          return achievement
        }
        
        if (achievement.condition(progress)) {
          return { ...achievement, unlockedAt: Date.now() }
        }
        return achievement
      })

      // Save if changed
      const hasNewUnlocks = updated.some((a, i) => 
        a.unlockedAt !== prev[i].unlockedAt
      )
      
      if (hasNewUnlocks) {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated))
      }

      return updated
    })
  }, [progress, isLoaded])

  const updateProgress = useCallback((sectionId: string, updates: Partial<SectionProgress>) => {
    setProgress(prev => {
      const current = prev[sectionId]
      return {
        ...prev,
        [sectionId]: {
          sectionId,
          completed: current?.completed ?? false,
          lastViewedAt: current?.lastViewedAt ?? null,
          timeSpent: current?.timeSpent ?? 0,
          interactions: current?.interactions ?? 0,
          ...updates
        }
      }
    })
  }, [])

  const markCompleted = useCallback((sectionId: string) => {
    updateProgress(sectionId, { 
      completed: true, 
      lastViewedAt: Date.now() 
    })
  }, [updateProgress])

  const addTimeSpent = useCallback((sectionId: string, seconds: number) => {
    setProgress(prev => {
      const current = prev[sectionId]
      return {
        ...prev,
        [sectionId]: {
          sectionId,
          completed: current?.completed || false,
          lastViewedAt: current?.lastViewedAt ?? null,
          timeSpent: (current?.timeSpent || 0) + seconds,
          interactions: current?.interactions || 0
        }
      }
    })
  }, [])

  const recordInteraction = useCallback((sectionId: string) => {
    setProgress(prev => {
      const current = prev[sectionId]
      return {
        ...prev,
        [sectionId]: {
          sectionId,
          completed: current?.completed || false,
          lastViewedAt: current?.lastViewedAt ?? null,
          timeSpent: current?.timeSpent || 0,
          interactions: (current?.interactions || 0) + 1
        }
      }
    })
  }, [])

  const getOverallProgress = useCallback(() => {
    const completed = accessibleSectionIds
      .map((id) => progress[id])
      .filter((p) => p?.completed).length
    const total = accessibleSectionIds.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }, [progress, accessibleSectionIds])

  const getCompletedCount = useCallback(() => {
    return accessibleSectionIds
      .map((id) => progress[id])
      .filter((p) => p?.completed).length
  }, [progress, accessibleSectionIds])

  const getTotalSections = useCallback(() => {
    return accessibleSectionIds.length
  }, [accessibleSectionIds])

  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null)

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY)
    } catch {
      // ignore
    }

    setProgress({})
    setAchievements(DEFAULT_ACHIEVEMENTS)
  }, [])

  const setCompletedForSections = useCallback((sectionIds: string[], completed: boolean) => {
    const now = Date.now()
    setProgress((prev) => {
      const next = { ...prev }
      for (const sectionId of sectionIds) {
        const current = next[sectionId]
        next[sectionId] = {
          sectionId,
          completed,
          lastViewedAt: current?.lastViewedAt ?? now,
          timeSpent: current?.timeSpent ?? 0,
          interactions: current?.interactions ?? 0,
        }
      }
      return next
    })
  }, [])

  const setAllCompleted = useCallback((completed: boolean) => {
    setCompletedForSections(accessibleSectionIds, completed)
  }, [accessibleSectionIds, setCompletedForSections])

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateProgress,
        markCompleted,
        addTimeSpent,
        recordInteraction,
        resetProgress,
        setCompletedForSections,
        setAllCompleted,
        getOverallProgress,
        getCompletedCount,
        getTotalSections,
        achievements,
        unlockedAchievements,
        isOpen,
        setIsOpen
      }}
    >
      {children}
      <ProgressDrawer />
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider")
  }
  return context
}

// Hook for tracking section progress
export function useSectionProgress(sectionId: string) {
  const { 
    progress, 
    updateProgress, 
    markCompleted, 
    addTimeSpent, 
    recordInteraction 
  } = useProgress()

  const sectionProgress = progress[sectionId]

  // Track time spent
  useEffect(() => {
    if (!sectionId) return

    const interval = setInterval(() => {
      addTimeSpent(sectionId, 5) // Record every 5 seconds
    }, 5000)

    // Initial update
    updateProgress(sectionId, { lastViewedAt: Date.now() })

    return () => clearInterval(interval)
  }, [sectionId, addTimeSpent, updateProgress])

  return {
    progress: sectionProgress,
    markCompleted: () => markCompleted(sectionId),
    recordInteraction: () => recordInteraction(sectionId),
    isCompleted: sectionProgress?.completed || false
  }
}

// Progress stats component - улучшенная версия
export function ProgressStats() {
  const { 
    getOverallProgress, 
    getCompletedCount, 
    getTotalSections,
    unlockedAchievements,
    achievements,
    setIsOpen
    ,progress
  } = useProgress()

  const progressPercent = getOverallProgress()
  const completed = getCompletedCount()
  const total = getTotalSections()
  const unlocked = unlockedAchievements.length
  const totalAchievements = achievements.length
  const totalMinutes = Math.round(Object.values(progress).reduce((sum, p) => sum + p.timeSpent, 0) / 60)
  const remaining = Math.max(0, total - completed)
  const achievementsPercent = totalAchievements > 0 ? Math.round((unlocked / totalAchievements) * 100) : 0

  if (total === 0) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-card to-muted/50 border-2 border-border rounded-xl p-5 mb-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Прогресс обучения</h3>
            <p className="text-xs text-muted-foreground">Отслеживайте свой прогресс</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
        >
          Подробнее
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* CTA */}
        <div className={`rounded-xl p-3 border text-sm ${
          remaining === 0
            ? "bg-green-500/10 border-green-500/20 text-green-500"
            : remaining <= 3
              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
              : "bg-primary/5 border-border text-muted-foreground"
        }`}>
          {remaining === 0 ? (
            <span>🎉 Вы закрыли все разделы, доступные вашей роли.</span>
          ) : (
            <span>
              Осталось разделов: <span className="font-semibold text-foreground">{remaining}</span>. 
              Отмечай разделы кнопкой <span className="font-semibold">“☑️ Отметить”</span> вверху страницы.
            </span>
          )}
        </div>

        {/* Основной прогресс */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Изучено разделов</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{completed}</span>
              <span className="text-muted-foreground">/ {total}</span>
            </div>
          </div>
          
          {/* Красивый прогресс-бар */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Блик на прогресс-баре */}
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">{progressPercent}% завершено</p>
            {progressPercent === 100 && (
              <span className="text-xs text-green-500 font-medium">🎉 Все разделы изучены!</span>
            )}
          </div>
        </div>

        {/* Прогресс достижений */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Достижения</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-yellow-500">{unlocked}</span>
              <span className="text-muted-foreground">/ {totalAchievements}</span>
            </div>
          </div>

          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-yellow-500/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${achievementsPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

            {/* Milestones */}
            {totalAchievements > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {[25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    className="absolute top-0 bottom-0 w-px bg-border/70"
                    style={{ left: `${pct}%` }}
                    title={`${pct}% достижений`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">{achievementsPercent}% ачивок</p>
            {achievementsPercent === 100 && (
              <span className="text-xs text-yellow-500 font-medium">🏅 Все достижения открыты!</span>
            )}
          </div>

          {/* Next milestones */}
          {totalAchievements > 0 && achievementsPercent < 100 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((pct) => {
                const need = Math.ceil((pct / 100) * totalAchievements)
                const reached = unlocked >= need
                return (
                  <div
                    key={pct}
                    className={`rounded-lg border px-2 py-2 text-center text-[10px] ${
                      reached
                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                        : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                    title={`Порог: ${need} достиж.`}
                  >
                    <div className="font-semibold">{pct}%</div>
                    <div>{need}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Статистика в ряд */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center hover:bg-muted/50 transition-colors">
            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{unlocked}</p>
            <p className="text-[10px] text-muted-foreground">Достижений</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center hover:bg-muted/50 transition-colors">
            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{totalMinutes}</p>
            <p className="text-[10px] text-muted-foreground">Минут в обучении</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center hover:bg-muted/50 transition-colors">
            <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{unlocked > 0 ? Math.round((unlocked / totalAchievements) * 100) : 0}%</p>
            <p className="text-[10px] text-muted-foreground">Ачивок получено</p>
          </div>
        </div>

        {/* Последние достижения */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Последние достижения</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {unlockedAchievements.slice(0, 3).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                  title={achievement.description}
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">{achievement.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Progress drawer
function ProgressDrawer() {
  const { 
    isOpen, 
    setIsOpen, 
    progress, 
    achievements, 
    unlockedAchievements,
    resetProgress,
    setCompletedForSections,
    setAllCompleted,
    getOverallProgress,
    getCompletedCount,
    getTotalSections
  } = useProgress()

  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isOpen) return
    const next: Record<string, boolean> = {}
    Object.keys(progress).forEach((id) => {
      next[id] = false
    })
    setSelectedSections(next)
  }, [isOpen, progress])

  const selectedIds = useMemo(() => Object.keys(selectedSections).filter((id) => selectedSections[id]), [selectedSections])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, setIsOpen])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}ч ${mins}мин`
    return `${mins}мин`
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-96 bg-card border-l-2 border-border shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Прогресс обучения</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Overall Stats */}
              <div className="bg-primary/10 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {getOverallProgress()}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getCompletedCount()} из {getTotalSections()} разделов изучено
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setAllCompleted(true)}
                  className="px-3 py-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/15 transition-colors text-sm"
                >
                  ✅ Всё изучено
                </button>
                <button
                  onClick={() => setAllCompleted(false)}
                  className="px-3 py-2 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors text-sm"
                >
                  ↩ Снять отметки
                </button>
                <button
                  onClick={() => {
                    resetProgress()
                    setIsOpen(false)
                  }}
                  className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 transition-colors text-sm"
                >
                  🗑 Сброс
                </button>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Достижения ({unlockedAchievements.length}/{achievements.length})
                </h3>
                <div className="space-y-2">
                  {achievements.map((achievement) => {
                    const isUnlocked = achievement.unlockedAt !== null
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                          isUnlocked
                            ? "bg-yellow-500/10 border-yellow-500/30"
                            : "bg-muted/50 border-border opacity-60"
                        }`}
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <p className={`font-medium ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                            {achievement.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          {isUnlocked && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                              Разблокировано: {new Date(achievement.unlockedAt!).toLocaleDateString("ru-RU")}
                            </p>
                          )}
                        </div>
                        {isUnlocked && <CheckCircle className="w-5 h-5 text-yellow-500" />}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Section Details */}
              {Object.keys(progress).length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Разделы (выборочно)</h3>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={selectedIds.length === 0}
                        onClick={() => setCompletedForSections(selectedIds, true)}
                        className="px-2 py-1 rounded-md text-xs bg-green-500/10 text-green-500 border border-green-500/20 disabled:opacity-50"
                      >
                        Отметить
                      </button>
                      <button
                        disabled={selectedIds.length === 0}
                        onClick={() => setCompletedForSections(selectedIds, false)}
                        className="px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground border border-border disabled:opacity-50"
                      >
                        Снять
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.values(progress).map((section) => (
                      <div
                        key={section.sectionId}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!selectedSections[section.sectionId]}
                            onChange={(e) =>
                              setSelectedSections((prev) => ({
                                ...prev,
                                [section.sectionId]: e.target.checked,
                              }))
                            }
                            className="accent-primary"
                          />
                          {section.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{section.sectionId}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(section.timeSpent)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
