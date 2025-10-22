"use client"

import type React from "react"
import { useState, Suspense, lazy, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Manual/Header"
import Sidebar from "@/app/components/Manual/Sidebar"
import { sidebarItems } from "@/data/manualData"
import OverviewSection from "@/app/components/Manual/sections/default/OverviewSection"
import { useAuth } from "@/lib/auth/auth-context"
import { AlertCircle } from "lucide-react"

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
const UserManagementSection = lazy(() => import("@/app/components/Manual/sections/admin/UserManagementSection"))
const ActionLogSection = lazy(() => import("@/app/components/Manual/sections/admin/ActionLogSection"))
const VehiclesSection = lazy(() => import("@/app/components/Manual/sections/default/VehiclesSection"))

const sectionComponents: Record<string, React.ComponentType> = {
  overview: OverviewSection,
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
  "user-management": UserManagementSection,
  "action-log": ActionLogSection,
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
  const { canAccessSection, isLoading } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const SectionComponent = sectionComponents[activeSection]

  useEffect(() => {
    // Removed manual-page class for clean design
  }, [])

  useEffect(() => {
    if (!isLoading && !canAccessSection(activeSection)) {
      setActiveSection("overview")
    }
  }, [activeSection, canAccessSection, isLoading])

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-300">Загрузка...</div>
        </div>
    )
  }

  return (
      <div className="min-h-screen">
        <Header />
        <Sidebar sidebarItems={sidebarItems} activeSection={activeSection} setActiveSection={setActiveSection} />

        <div className="ml-64">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <main className="modern-card min-h-[calc(100vh-8rem)]">
              {!canAccessSection(activeSection) ? (
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
                  <Suspense fallback={<div className="text-center py-8">Загрузка раздела...</div>}>
                    <div className="mb-6">
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {getSectionTitle(activeSection)}
                      </h1>
                      <div className="w-20 h-1 bg-primary rounded-full"></div>
                    </div>
                    <SectionComponent />
                  </Suspense>
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
  )
}
