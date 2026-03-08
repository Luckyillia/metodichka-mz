"use client"

import type React from "react"
import { useState, Suspense, lazy, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Manual/Header"
import Sidebar from "@/app/components/Manual/Sidebar"
import { sidebarItems } from "@/data/manualData"
import OverviewSection from "@/app/components/Manual/sections/default/OverviewSection"
import { useAuth } from "@/lib/auth/auth-context"
import { AlertCircle, Loader2 } from "lucide-react"

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
  return item ? item.title : "Section"
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function ManualPage() {
  const router = useRouter()
  const { canAccessSection, isLoading } = useAuth()
  const [activeSection, setActiveSection] = useState("overview")
  const effectiveSection = !isLoading && !canAccessSection(activeSection) ? "overview" : activeSection
  const SectionComponent = sectionComponents[effectiveSection]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar sidebarItems={sidebarItems} activeSection={activeSection} setActiveSection={setActiveSection} />
      <Header />

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
          {!canAccessSection(effectiveSection) ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Authorization Required</h2>
              <p className="text-muted-foreground mb-6">Sign in to access manual sections</p>
              <button
                onClick={() => router.push("/login")}
                className="modern-button"
              >
                Sign in
              </button>
            </div>
          ) : SectionComponent ? (
            <Suspense fallback={<LoadingSpinner />}>
              {effectiveSection !== "overview" && (
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {getSectionTitle(effectiveSection)}
                  </h1>
                  <div className="w-12 h-0.5 bg-primary mt-3 rounded-full" />
                </div>
              )}
              {effectiveSection === "overview" ? (
                <OverviewSection setActiveSection={setActiveSection} />
              ) : (
                <SectionComponent />
              )}
            </Suspense>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Section Not Found</h2>
              <p className="text-muted-foreground">The requested section does not exist or has been moved.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
