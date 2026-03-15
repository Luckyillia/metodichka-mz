"use client"

import type React from "react"
import { useState, Suspense, lazy, useEffect, useCallback, useRef } from "react"
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

import MSUnifiedContentSection from "@/app/components/Manual/sections/default/MSUnifiedContentSection"
import SSUnifiedContentSection from "@/app/components/Manual/sections/ss/SSUnifiedContentSection"
import ExamSection from "@/app/components/Manual/sections/ss/ExamSection"
import PracticalTasksSection from "@/app/components/Manual/sections/ss/UnifiedContent/PracticalTasksSection"
import PositionsSection from "@/app/components/Manual/sections/default/PositionsSection"
import CommandTemplatesSection from "@/app/components/Manual/sections/default/CommandTemplatesSection"
import AnnouncementsSection from "@/app/components/Manual/sections/ss/AnnouncementsSection"
import MedicationsSection from "@/app/components/Manual/sections/default/MedicationsSection"
import MedicalCardSection from "@/app/components/Manual/sections/default/MedicalCardSection"
import VehiclesSection from "@/app/components/Manual/sections/default/VehiclesSection"

import ForumResponsesSection from "@/app/components/Manual/sections/ss/ForumResponsesSection"
import GossWaveSection from "@/app/components/Manual/sections/ss/GossWaveSection"
import ReportGenerator from "@/app/components/Manual/sections/ss/ReportGenerator"
import LeaderReportGenerator from "@/app/components/Manual/sections/leader/LeaderReportGenerator"
import MedicalCommissionSection from "@/app/components/Manual/sections/default/MedicalCommissionSection"
import InterviewSection from "@/app/components/Manual/sections/default/InterviewSection"

import UserManagementSection from "@/app/components/Manual/sections/admin/UserManagementSection"
import ActionLogSection from "@/app/components/Manual/sections/admin/ActionLogSection"
import GSReportGeneratorSection from "@/app/components/Manual/sections/admin/GSReportGeneratorSection"
import BiographyValidatorSection from "@/app/components/Manual/sections/admin/BiographyValidatorSection"
import PromotionSystemSection from "@/app/components/Manual/sections/admin/PromotionSystem"

interface SectionWrapperProps {
  sectionId: string;
  SectionComponent: React.ComponentType | any;
  handleSectionChange: (id: string) => void;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ sectionId, SectionComponent, handleSectionChange }) => {
  if (!SectionComponent) return null;
  
  if (sectionId === "overview") {
    return <OverviewSection setActiveSection={handleSectionChange} />;
  }
  
  return <SectionComponent />;
};


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
  const activeSectionRef = useRef(activeSection)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])
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
      // Чтобы избежать ререндера ManualPage (и закрытия дропдаунов) при каждом копировании,
      // мы используем ссылку на текущую секцию вместо зависимости activeSection в массиве зависимостей.
      recordInteraction(activeSectionRef.current)
    }
    window.addEventListener('record-interaction', handleInteraction as EventListener)
    return () => window.removeEventListener('record-interaction', handleInteraction as EventListener)
  }, [recordInteraction]) // Убрали activeSection из зависимостей

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
                      <SectionWrapper 
                        sectionId={effectiveSection} 
                        SectionComponent={SectionComponent} 
                        handleSectionChange={handleSectionChange} 
                      />
                    </motion.div>
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
