"use client"

import type React from "react"
import { useState, Suspense, lazy, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Manual/Header"
import Sidebar from "@/app/components/Manual/Sidebar"
import { sidebarItems } from "@/data/manualData"
import OverviewSection from "@/app/components/Manual/sections/default/OverviewSection"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import { AlertCircle } from "lucide-react"
import { CommandPalette } from "@/app/components/common/CommandPalette"
import { ErrorBoundary } from "@/app/components/common/ErrorBoundary"
import { useHistory } from "@/app/components/common/History"
import { useProgress } from "@/app/components/common/LearningProgress"
import { MobileNavigation } from "@/app/components/common/MobileNavigation"
import { BookmarkButton } from "@/app/components/common/Bookmarks"
import { motion } from "framer-motion"

const PositionsSection = lazy(() => import("@/app/components/Manual/sections/default/PositionsSection"))
const MSUnifiedContentSection = lazy(() => import("@/app/components/Manual/sections/default/MSUnifiedContentSection"))
const SSUnifiedContentSection = lazy(() => import("@/app/components/Manual/sections/ss/SSUnifiedContentSection"))
const ExamSection = lazy(() => import("@/app/components/Manual/sections/ss/ExamSection"))
const PracticalTasksSection = lazy(() => import("@/app/components/Manual/sections/ss/UnifiedContent/PracticalTasksSection"))
const MedicalCommissionSection = lazy(() => import("@/app/components/Manual/sections/default/MedicalCommissionSection"))
const InterviewSection = lazy(() => import("@/app/components/Manual/sections/default/InterviewSection"))
const MedicationsSection = lazy(() => import("@/app/components/Manual/sections/default/MedicationsSection"))
const MedicalCardSection = lazy(() => import("@/app/components/Manual/sections/default/MedicalCardSection"))
const CommandTemplatesSection = lazy(() => import("@/app/components/Manual/sections/default/CommandTemplatesSection"))
const AnnouncementsSection = lazy(() => import("@/app/components/Manual/sections/ss/AnnouncementsSection"))
const ForumResponsesSection = lazy(() => import("@/app/components/Manual/sections/ss/ForumResponsesSection"))
const GossWaveSection = lazy(() => import("@/app/components/Manual/sections/ss/GossWaveSection"))
const ReportGenerator = lazy(() => import("@/app/components/Manual/sections/ss/ReportGenerator"))
const LeaderReportGenerator = lazy(() => import("@/app/components/Manual/sections/leader/LeaderReportGenerator"))
const UserManagementSection = lazy(() => import("@/app/components/Manual/sections/admin/UserManagementSection"))
const ActionLogSection = lazy(() => import("@/app/components/Manual/sections/admin/ActionLogSection"))
const VehiclesSection = lazy(() => import("@/app/components/Manual/sections/default/VehiclesSection"))
const GSReportGeneratorSection = lazy(() => import("@/app/components/Manual/sections/admin/GSReportGeneratorSection"))
const PromotionSystemSection = lazy(() => import("@/app/components/Manual/sections/admin/PromotionSystem").then(m => ({ default: m.default })));
const BiographyValidatorSection = lazy(() => import("@/app/components/Manual/sections/admin/BiographyValidatorSection"))


const sectionComponents: Record<string, React.ComponentType> = {
  overview: OverviewSection,
  positions: PositionsSection,
  "ss-unified-content": SSUnifiedContentSection,
  "ms-unified-content": MSUnifiedContentSection,
  "commands": CommandTemplatesSection,
  "exam-section": ExamSection,
  "practical-tasks": PracticalTasksSection,
  "medical-commission": MedicalCommissionSection,
  "interview": InterviewSection,
  "medications": MedicationsSection,
  "medical-card": MedicalCardSection,
  vehicles: VehiclesSection,
  announcements: AnnouncementsSection,
  "forum-responses": ForumResponsesSection,
  "goss-wave": GossWaveSection,
  "report-generator": ReportGenerator,
  "leader-report-generator": LeaderReportGenerator,
  "user-management": UserManagementSection,
  "action-log": ActionLogSection,
  "gs-report-generator": GSReportGeneratorSection,
  "promotion-system": PromotionSystemSection,
  "biography-validator": BiographyValidatorSection,
}

const getSectionTitle = (id: string) => {
  const findItem = (items: any[]): any => {
    for (const item of items) {
      if ('items' in item) {
        const found = item.items.find((navItem: any) => navItem.id === id)
        if (found) return found
      } else if (item.id === id) {
        return item
      }
    }
    return null
  }

  const item = findItem(sidebarItems)
  return item ? item.title : "Раздел"
}

export default function ManualPage() {
  const router = useRouter()
  const { user, canAccessSection, isLoading } = useAuth()
  const { addToHistory } = useHistory()
  const { updateProgress, markCompleted, recordInteraction, progress } = useProgress()
  const [activeSection, setActiveSection] = useState("overview")
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Track last seen when user is logged in
  useEffect(() => {
    if (user?.id) {
      AuthService.updateLastSeen(user.id);
      
      // Update last seen every 5 minutes if tab is active
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          AuthService.updateLastSeen(user.id);
        }
      }, 5 * 60 * 1000)
      
      return () => clearInterval(interval)
    }
  }, [user?.id])

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    setIsSidebarOpen(false)
    
    // Add to history
    const sectionTitle = getSectionTitle(sectionId)
    const navItem = sidebarItems.flatMap(item => 'items' in item ? item.items : [item]).find(item => item.id === sectionId)
    if (navItem) {
      addToHistory({
        id: sectionId,
        title: sectionTitle,
        section: 'items' in (navItem as any) ? (navItem as any).title : 'Раздел',
        icon: navItem.icon
      })
      updateProgress(sectionId, { lastViewedAt: Date.now() })
    }
  }, [addToHistory, updateProgress])

  // Listen for navigation events from Command Palette
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      handleSectionChange(e.detail)
    }
    window.addEventListener('navigate-section', handleNavigate as EventListener)
    return () => window.removeEventListener('navigate-section', handleNavigate as EventListener)
  }, [handleSectionChange])

  // Listen for interaction events from UI (copy, generators, etc.)
  useEffect(() => {
    const handleInteraction = () => {
      recordInteraction(activeSection)
    }
    window.addEventListener('record-interaction', handleInteraction as EventListener)
    return () => window.removeEventListener('record-interaction', handleInteraction as EventListener)
  }, [recordInteraction, activeSection])

  const effectiveSection = !isLoading && !canAccessSection(activeSection) ? "overview" : activeSection;
  const SectionComponent = sectionComponents[effectiveSection];

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <CommandPalette />
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar 
          sidebarItems={sidebarItems} 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange}
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="lg:ml-64 flex-1">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 pb-24 lg:pb-6">
            <main className="modern-card min-h-[calc(100vh-8rem)] w-full overflow-hidden">
              {!mounted ? (
                // Loading skeleton - same on server and client
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-muted-foreground">Загрузка...</p>
                </div>
              ) : !canAccessSection(effectiveSection) ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">Требуется авторизация</h2>
                    <p className="text-muted-foreground mb-6">Чтобы получить доступ к разделам методички, войдите в аккаунт</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="modern-button"
                    >
                      Войти в аккаунт
                    </button>
                  </div>
              ) : SectionComponent ? (
                  <ErrorBoundary sectionName={getSectionTitle(effectiveSection)}>
                    <Suspense fallback={
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground">Загрузка раздела...</p>
                      </div>
                    }>
                      <motion.div
                        key={effectiveSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                              {getSectionTitle(effectiveSection)}
                            </h1>
                            <div className="w-20 h-1 bg-primary rounded-full"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => markCompleted(effectiveSection)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all border ${
                                progress[effectiveSection]?.completed
                                  ? "bg-green-500/10 text-green-500 border-green-500/30"
                                  : "bg-muted text-muted-foreground hover:text-foreground border-border"
                              }`}
                              title={progress[effectiveSection]?.completed ? "Раздел уже отмечен как изученный" : "Отметить раздел как изученный"}
                            >
                              {progress[effectiveSection]?.completed ? "✅ Изучено" : "☑️ Отметить"}
                            </button>
                            <BookmarkButton 
                              id={effectiveSection}
                              title={getSectionTitle(effectiveSection)}
                              section="Методичка"
                              icon="📖"
                              variant="button"
                            />
                          </div>
                        </div>
                        {effectiveSection === "overview" ? (
                          <OverviewSection setActiveSection={handleSectionChange} />
                        ) : (
                          <SectionComponent />
                        )}
                      </motion.div>
                    </Suspense>
                  </ErrorBoundary>
              ) : (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Раздел не найден</h2>
                    <p className="text-muted-foreground">Запрашиваемый раздел не существует или был перемещён.</p>
                  </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <MobileNavigation />
    </>
  )
}
