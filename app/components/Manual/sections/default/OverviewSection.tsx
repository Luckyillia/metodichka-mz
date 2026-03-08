"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { navItems } from "@/data/manualData"
import { AlertTriangle, BookOpen, FileText, Syringe, Truck, ArrowRight } from "lucide-react"

interface OverviewSectionProps {
  setActiveSection?: (id: string) => void
}

const sectionIcons: Record<string, React.ReactNode> = {
  "positions": <BookOpen className="w-5 h-5" />,
  "ms-unified-content": <FileText className="w-5 h-5" />,
  "ss-unified-content": <FileText className="w-5 h-5" />,
  "commands": <FileText className="w-5 h-5" />,
  "exam-section": <BookOpen className="w-5 h-5" />,
  "medical-commission": <FileText className="w-5 h-5" />,
  "interview": <FileText className="w-5 h-5" />,
  "medications": <Syringe className="w-5 h-5" />,
  "medical-card": <FileText className="w-5 h-5" />,
  "vehicles": <Truck className="w-5 h-5" />,
}

const OverviewSection = ({ setActiveSection }: OverviewSectionProps = {}) => {
  const { canAccessSection } = useAuth()

  const sectionDescriptions: Record<string, string> = {
    "positions": "Hierarchy of positions and ranks",
    "ms-unified-content": "RP scenarios for junior staff",
    "ss-unified-content": "Training materials for senior staff",
    "commands": "Commands and roleplay templates",
    "exam-section": "Exam rules and procedures",
    "medical-commission": "Medical commission algorithms",
    "interview": "Interview templates and procedures",
    "medications": "Medical preparations reference",
    "medical-card": "Working with patient medical cards",
    "vehicles": "Ministry of Health vehicles",
    "goss-wave": "State communication wave",
    "announcements": "Announcement board templates",
    "forum-responses": "Forum response templates",
    "report-generator": "Senior staff report generator",
    "user-management": "System user management",
    "action-log": "Action log and change history"
  }

  const sections = navItems
    .filter(item => item.id !== "overview")
    .map(item => ({
      id: item.id,
      title: item.title,
      description: sectionDescriptions[item.id] || "Section description",
    }))

  const accessibleSections = sections.filter(section => canAccessSection(section.id))

  const stats = [
    { label: "Sections", value: accessibleSections.length.toString() },
    { label: "Medications", value: "30+" },
    { label: "Vehicles", value: "4" },
    { label: "Templates", value: "50+" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-semibold text-foreground mb-3">
          Ministry of Health
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Methodical Manual - Reference and information portal for employees
        </p>
      </div>

      {/* Warning Notice */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Important Notice</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>This manual may contain inaccuracies or outdated information</li>
              <li>Materials serve as a learning foundation, not the final source</li>
              <li>For disputed questions, refer to current regulations</li>
              <li>Administration is not responsible for potential content errors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sections Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {accessibleSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection?.(section.id)}
              className="group bg-card border border-border rounded-lg p-4 text-left hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {sectionIcons[section.id] || <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {accessibleSections.length === 0 && (
          <div className="text-center text-muted-foreground py-12 bg-card border border-border rounded-lg">
            No sections available for your role.
          </div>
        )}
      </div>

      {/* Color Legend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Phrase Color Indication</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500" />
            <span className="text-muted-foreground">MS - Junior Staff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
            <span className="text-muted-foreground">SS - Senior Staff</span>
          </div>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-accent border border-border rounded-lg p-4 border-l-2 border-l-primary">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> This manual contains most work instructions. 
          Use the navigation on the left for quick access to the section you need.
        </p>
      </div>
    </div>
  )
}

export default OverviewSection
