"use client"

import type React from "react"
import { useState, Suspense, lazy, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Manual/Header"
import Sidebar from "@/app/components/Manual/Sidebar"
import { sidebarItems } from "@/data/manualData"
import OverviewSection from "@/app/components/Manual/sections/default/OverviewSection"
import { useAuth } from "@/lib/auth/auth-context"
import { AlertCircle, Loader2, Shield, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" style={{ animationDuration: '2s' }} />
      </div>
      <p className="text-sm text-muted-foreground mt-6">Loading content...</p>
    </motion.div>
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
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 pointer-events-none" />
        <div className="fixed top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center mx-auto shadow-lg" style={{ boxShadow: '0 0 60px var(--primary)' }}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-3xl animate-ping bg-primary/30" style={{ animationDuration: '2s' }} />
          </div>
          <p className="text-muted-foreground mt-6">Loading Metodychka...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/8 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar sidebarItems={sidebarItems} activeSection={activeSection} setActiveSection={setActiveSection} />
      <Header />

      <main className="lg:ml-72 pt-16 min-h-screen relative z-10">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
          <AnimatePresence mode="wait">
            {!canAccessSection(effectiveSection) ? (
              <motion.div 
                key="unauthorized"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="premium-card p-16 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Authorization Required</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Sign in to your account to access all manual sections and features
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/login")}
                  className="premium-button px-8 py-3 text-base"
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Sign in
                </motion.button>
              </motion.div>
            ) : SectionComponent ? (
              <motion.div
                key={effectiveSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  {effectiveSection !== "overview" && (
                    <div className="mb-10">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-1.5 h-10 bg-gradient-to-b from-primary to-orange-500 rounded-full" />
                        <div>
                          <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            {getSectionTitle(effectiveSection)}
                          </h1>
                          <div className="h-1 w-20 bg-gradient-to-r from-primary to-orange-500 rounded-full mt-2 opacity-60" />
                        </div>
                      </motion.div>
                    </div>
                  )}
                  {effectiveSection === "overview" ? (
                    <OverviewSection setActiveSection={setActiveSection} />
                  ) : (
                    <SectionComponent />
                  )}
                </Suspense>
              </motion.div>
            ) : (
              <motion.div 
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="premium-card p-16 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Section Not Found</h2>
                <p className="text-muted-foreground">
                  The requested section does not exist or has been moved.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
