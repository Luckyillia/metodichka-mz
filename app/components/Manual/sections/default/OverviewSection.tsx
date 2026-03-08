"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { navItems } from "@/data/manualData"
import { AlertTriangle, BookOpen, FileText, Syringe, Truck, ArrowRight, Sparkles, Zap, Shield, Users } from "lucide-react"
import { motion } from "framer-motion"

interface OverviewSectionProps {
  setActiveSection?: (id: string) => void
}

const sectionIcons: Record<string, React.ReactNode> = {
  "positions": <Users className="w-5 h-5" />,
  "ms-unified-content": <FileText className="w-5 h-5" />,
  "ss-unified-content": <FileText className="w-5 h-5" />,
  "commands": <Zap className="w-5 h-5" />,
  "exam-section": <BookOpen className="w-5 h-5" />,
  "medical-commission": <Shield className="w-5 h-5" />,
  "interview": <FileText className="w-5 h-5" />,
  "medications": <Syringe className="w-5 h-5" />,
  "medical-card": <FileText className="w-5 h-5" />,
  "vehicles": <Truck className="w-5 h-5" />,
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
    { label: "Sections", value: accessibleSections.length.toString(), icon: <BookOpen className="w-5 h-5" /> },
    { label: "Medications", value: "30+", icon: <Syringe className="w-5 h-5" /> },
    { label: "Vehicles", value: "4", icon: <Truck className="w-5 h-5" /> },
    { label: "Templates", value: "50+", icon: <FileText className="w-5 h-5" /> },
  ]

  return (
    <motion.div 
      className="space-y-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.div variants={item} className="relative text-center py-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Documentation</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Ministry of Health</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Methodical Manual - Reference and information portal for employees
          </p>
        </div>
      </motion.div>

      {/* Warning Notice */}
      <motion.div 
        variants={item}
        className="relative glass-card p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-500" />
        <div className="flex gap-5 pl-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">Important Notice</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                This manual may contain inaccuracies or outdated information
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                Materials serve as a learning foundation, not the final source
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                For disputed questions, refer to current regulations
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                Administration is not responsible for potential content errors
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -4 }}
            className="premium-card p-6 text-center group cursor-default"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
              {stat.icon}
            </div>
            <div className="stat-number">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Sections Grid */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Available Sections</h2>
          <span className="text-sm text-muted-foreground px-3 py-1 bg-white/5 rounded-full">
            {accessibleSections.length} sections
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleSections.map((section, index) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection?.(section.id)}
              className="group premium-card p-5 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-orange-500/20 transition-all duration-300">
                  {sectionIcons[section.id] || <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {section.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

        {accessibleSections.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No sections available for your role.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Color Legend */}
      <motion.div variants={item} className="glass-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Phrase Color Indication</h3>
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg" style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }} />
            <div>
              <span className="text-sm font-medium text-foreground">MS - Junior Staff</span>
              <p className="text-xs text-muted-foreground">Green-blue gradient</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg" style={{ boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)' }} />
            <div>
              <span className="text-sm font-medium text-foreground">SS - Senior Staff</span>
              <p className="text-xs text-muted-foreground">Orange gradient</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Tip */}
      <motion.div 
        variants={item}
        className="relative glass-card p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-orange-500" />
        <div className="flex items-start gap-4 pl-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Pro Tip</span>
            <p className="text-sm text-muted-foreground mt-1">
              This manual contains most work instructions. Use the navigation on the left for quick access to the section you need.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OverviewSection
