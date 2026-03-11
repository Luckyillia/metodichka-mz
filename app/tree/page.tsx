"use client";

import { useState, useEffect } from "react";

interface TreeNode {
  name: string;
  type: "file" | "dir";
  children?: TreeNode[];
  desc?: string;
  role?: "root" | "admin" | "ld" | "cc" | "instructor" | "user" | "guest";
}

const tree: TreeNode[] = [
  {
    name: "📁 root",
    type: "dir",
    role: "root",
    children: [
      {
        name: "📁 app",
        type: "dir",
        children: [
          { name: "📄 layout.tsx", type: "file", desc: "Корневой layout (провайдеры, стили)" },
          { name: "📄 page.tsx", type: "file", desc: "Главная страница — мануал" },
          {
            name: "📁 account-recovery",
            type: "dir",
            role: "guest",
            children: [{ name: "📄 page.tsx", type: "file", desc: "Восстановление аккаунта" }],
          },
          {
            name: "📁 account-request",
            type: "dir",
            role: "guest",
            children: [{ name: "📄 page.tsx", type: "file", desc: "Запрос аккаунта" }],
          },
          {
            name: "📁 api",
            type: "dir",
            children: [
              { name: "📁 account-recovery", type: "dir", role: "guest", children: [{ name: "📄 verify/route.ts", type: "file" }, { name: "📄 document/route.ts", type: "file" }, { name: "📄 submit/route.ts", type: "file" }] },
              { name: "📁 account-request", type: "dir", role: "guest", children: [{ name: "📄 route.ts", type: "file" }, { name: "📄 id-photo/route.ts", type: "file" }] },
              { name: "📁 action-logs", type: "dir", role: "admin", children: [{ name: "📄 route.ts", type: "file" }] },
              { name: "📁 action-logs-internal", type: "dir", role: "user", children: [{ name: "📄 route.ts", type: "file" }] },
              { name: "📁 auth", type: "dir", role: "guest", children: [{ name: "📄 login/route.ts", type: "file" }] },
              { name: "📁 health", type: "dir", role: "admin", children: [{ name: "📄 route.ts", type: "file" }] },
              { name: "📁 parking-spaces", type: "dir", role: "user", children: [{ name: "📄 route.ts", type: "file" }] },
              { name: "📁 promotion-system", type: "dir", role: "ld", children: [{ name: "📄 route.ts", type: "file" }] },
              { name: "📁 user", type: "dir", role: "user", children: [{ name: "📄 avatar/route.ts", type: "file" }, { name: "📄 profile/route.ts", type: "file" }] },
              { name: "📁 users", type: "dir", role: "ld", children: [
                { name: "📄 route.ts", type: "file" },
                { name: "📄 last-seen/route.ts", type: "file" },
                { name: "📄 permanent-delete/route.ts", type: "file" },
                { name: "📄 transfer-city/route.ts", type: "file" },
                { name: "📄 undo/route.ts", type: "file" }
              ]},
              { name: "📁 admin", type: "dir", role: "admin", children: [{ name: "📁 biography/validate", type: "dir", children: [{ name: "📄 route.ts", type: "file" }] }] },
            ],
          },
          {
            name: "📁 components",
            type: "dir",
            children: [
              {
                name: "📁 common",
                type: "dir",
                children: [
                  { name: "📄 AnimatedComponents.tsx", type: "file" },
                  { name: "📄 AppFooter.tsx", type: "file" },
                  { name: "📄 Bookmarks.tsx", type: "file" },
                  { name: "📄 CommandPalette.tsx", type: "file" },
                  { name: "📄 ErrorBoundary.tsx", type: "file" },
                  { name: "📄 History.tsx", type: "file" },
                  { name: "📄 ImagePreviewModal.tsx", type: "file" },
                  { name: "📄 LearningProgress.tsx", type: "file" },
                  { name: "📄 MobileNavigation.tsx", type: "file" },
                  { name: "📄 RealtimeNotifications.tsx", type: "file" },
                  { name: "📄 Skeleton.tsx", type: "file" },
                  { name: "📄 Toast.tsx", type: "file" },
                ],
              },
              {
                name: "📁 Manual",
                type: "dir",
                children: [
                  { name: "📄 Header.tsx", type: "file" },
                  { name: "📄 Sidebar.tsx", type: "file" },
                  { name: "📄 ProtectedSection.tsx", type: "file" },
                  { name: "📄 CareerPath.tsx", type: "file" },
                  { name: "📄 CommandBlock.tsx", type: "file" },
                  { name: "📄 DropdownMenu.tsx", type: "file" },
                  { name: "📄 ExamplePhrase.tsx", type: "file" },
                  { name: "📄 ProtocolCard.tsx", type: "file" },
                  { name: "📄 ScheduleGrid.tsx", type: "file" },
                  { name: "📄 SectionContent.tsx", type: "file" },
                  {
                    name: "📁 sections",
                    type: "dir",
                    children: [
                      {
                        name: "📁 admin",
                        type: "dir",
                        role: "admin",
                        children: [
                          { name: "📄 ActionLogSection.tsx", type: "file" },
                          { name: "📄 BiographyValidatorSection.tsx", type: "file" },
                          { name: "📄 GSReportGeneratorSection.tsx", type: "file" },
                          { name: "📄 HealthDashboard.tsx", type: "file" },
                          { name: "📄 PromotionSystem.tsx", type: "file" },
                          { name: "📄 UserManagementSection.tsx", type: "file" },
                          { name: "📁 ActionLog", type: "dir" },
                          { name: "📁 BiographyValidator", type: "dir" },
                          { name: "📁 GSReportGenerator", type: "dir" },
                          { name: "📁 UserManagement", type: "dir" },
                        ],
                      },
                      {
                        name: "📁 default",
                        type: "dir",
                        role: "user",
                        children: [
                          { name: "📄 CommandTemplatesSection.tsx", type: "file" },
                          { name: "📄 InterviewSection.tsx", type: "file" },
                          { name: "📄 MedicalCardSection.tsx", type: "file" },
                          { name: "📄 MedicalCommissionSection.tsx", type: "file" },
                          { name: "📄 MedicationsSection.tsx", type: "file" },
                          { name: "📄 MSUnifiedContentSection.tsx", type: "file" },
                          { name: "📄 OverviewSection.tsx", type: "file" },
                          { name: "📄 PositionsSection.tsx", type: "file" },
                          { name: "📄 VehiclesSection.tsx", type: "file" },
                          { name: "� CommandTemplates", type: "dir" },
                          { name: "📁 UnifiedContent", type: "dir" },
                        ],
                      },
                      {
                        name: "📁 ss",
                        type: "dir",
                        role: "cc",
                        children: [
                          { name: "📄 AnnouncementsSection.tsx", type: "file" },
                          { name: "📄 ExamSection.tsx", type: "file" },
                          { name: "📄 ForumResponsesSection.tsx", type: "file" },
                          { name: "📄 GossWaveSection.tsx", type: "file" },
                          { name: "📄 ReportGenerator.tsx", type: "file" },
                          { name: "📄 SSUnifiedContentSection.tsx", type: "file" },
                          { name: "📁 Announcements", type: "dir" },
                          { name: "📁 Exams", type: "dir" },
                          { name: "📁 UnifiedContent", type: "dir" },
                        ],
                      },
                      {
                        name: "📁 leader",
                        type: "dir",
                        role: "ld",
                        children: [{ name: "📄 LeaderReportGenerator.tsx", type: "file" }, { name: "📁 LeaderReport", type: "dir" }],
                      },
                      { name: "📁 old", type: "dir", role: "admin" },
                    ],
                  },
                ],
              },
              { name: "📁 providers", type: "dir", children: [{ name: "📄 Providers.tsx", type: "file" }, { name: "📄 QueryProvider.tsx", type: "file" }] },
            ],
          },
          { name: "📁 login", type: "dir", role: "guest", children: [{ name: "📄 page.tsx", type: "file" }] },
          { name: "📁 profile", type: "dir", role: "user", children: [{ name: "📄 page.tsx", type: "file" }] },
          { name: "📁 tree", type: "dir", role: "root", children: [{ name: "📄 page.tsx", type: "file" }] },
        ],
      },
      {
        name: "📁 lib",
        type: "dir",
        children: [
          { name: "📁 auth", type: "dir", children: [
            { name: "📄 auth-context.tsx", type: "file" },
            { name: "📄 auth-service.ts", type: "file" },
            { name: "📄 constants.ts", type: "file" },
            { name: "📄 types.ts", type: "file" },
            { name: "📄 user-events.ts", type: "file" }
          ]},
          { name: "📁 biography", type: "dir", children: [{ name: "📄 groq.ts", type: "file" }, { name: "📄 normalize.ts", type: "file" }, { name: "📄 prompt.ts", type: "file" }] },
          { name: "📁 image", type: "dir", children: [{ name: "📄 crop-image.ts", type: "file" }] },
          { name: "📄 cloudinary.ts", type: "file" },
          { name: "📄 supabase.ts", type: "file" },
          { name: "📄 utils.ts", type: "file" },
        ],
      },
      { name: "📁 migrations", type: "dir", role: "root" },
      { name: "📁 data", type: "dir", children: [{ name: "📄 manualData.ts", type: "file" }] },
      { name: "📁 types", type: "dir", children: [{ name: "📄 manualTypes.ts", type: "file" }] },
      { name: "📁 public", type: "dir", children: [{ name: "📄 manifest.json", type: "file" }] },
      { name: "📁 scripts", type: "dir", role: "root", children: [{ name: "📄 bump-version.js", type: "file" }, { name: "📄 hash-password.ts", type: "file" }] },
      { name: "� middleware.ts", type: "file", role: "root" },
      { name: "📄 tailwind.config.ts", type: "file" },
      { name: "📄 package.json", type: "file" },
      { name: "📄 tsconfig.json", type: "file" },
      { name: "📄 next.config.ts", type: "file" },
      { name: "📄 .env", type: "file", role: "root" },
      { name: "📄 README.md", type: "file" },
    ],
  },
];

const ROLES = {
  root: { label: "root", color: "#ff4444" },
  admin: { label: "admin", color: "#ff8800" },
  ld: { label: "ld", color: "#ffcc00" },
  cc: { label: "cc", color: "#44aaff" },
  instructor: { label: "instructor", color: "#88ff88" },
  user: { label: "user", color: "#aaaaaa" },
};

function Node({ node, depth = 0, searchQuery = "" }: { node: TreeNode; depth?: number; searchQuery?: string }) {
  const [open, setOpen] = useState(depth < 2 || (searchQuery.length > 0));
  
  useEffect(() => {
    if (searchQuery.length > 0) {
      const hasMatch = (n: TreeNode): boolean => {
        if (n.name.toLowerCase().includes(searchQuery.toLowerCase()) || (n.desc || "").toLowerCase().includes(searchQuery.toLowerCase())) return true;
        if (n.children) return n.children.some(hasMatch);
        return false;
      };
      if (hasMatch(node)) setOpen(true);
    }
  }, [searchQuery, node]);

  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 18;

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-primary/30 text-foreground rounded px-0.5">{part}</span> : 
        part
    );
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "root": return "text-purple-500";
      case "admin": return "text-red-500";
      case "ld": return "text-pink-500";
      case "cc": return "text-blue-500";
      case "instructor": return "text-amber-500";
      case "user": return "text-green-500";
      case "guest": return "text-slate-400";
      default: return "";
    }
  };

  return (
    <div style={{ marginLeft: indent }} className="relative">
      <div
        onClick={() => hasChildren && setOpen((v) => !v)}
        className={`
          group flex items-start gap-2 py-1.5 px-2 rounded-md transition-all duration-200
          ${hasChildren ? "cursor-pointer hover:bg-muted/50" : "cursor-default"}
          ${node.role ? "border-l-2 ml-[-2px]" : ""}
        `}
        style={{ borderLeftColor: node.role ? `var(--${node.role})` : "transparent" }}
      >
        <span className="text-[10px] text-muted-foreground mt-1.5 w-3 flex-shrink-0">
          {hasChildren ? (open ? "▼" : "▶") : "•"}
        </span>
        
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`text-sm font-medium break-all ${node.type === 'dir' ? 'text-amber-200/90' : 'text-blue-200/90'} ${getRoleColor(node.role)}`}>
              {highlightText(node.name, searchQuery)}
            </span>
            {node.role && (
              <span className={`text-[8px] md:text-[9px] uppercase px-1 rounded border border-current opacity-70 flex-shrink-0 ${getRoleColor(node.role)}`}>
                {node.role}
              </span>
            )}
          </div>
          {node.desc && (
            <span className="text-[11px] text-muted-foreground/70 italic break-words">
              {highlightText(node.desc, searchQuery)}
            </span>
          )}
        </div>
      </div>
      
      {hasChildren && open && (
        <div className="ml-3 border-l border-border/30 pl-1 my-0.5">
          {node.children?.map((child, i) => (
            <Node key={i} node={child} depth={depth + 1} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectTree() {
  const [search, setSearch] = useState("");

  function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
    if (!q) return nodes;
    return nodes.reduce((acc: TreeNode[], node) => {
      if (node.name.toLowerCase().includes(q) || (node.desc || "").toLowerCase().includes(q)) {
        acc.push(node);
      } else if (node.children) {
        const filtered = filterTree(node.children, q);
        if (filtered.length > 0) acc.push({ ...node, children: filtered });
      }
      return acc;
    }, []);
  }

  const filtered = filterTree(tree, search.toLowerCase());

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 pb-32 lg:pb-0">
      <div className="w-full mx-auto px-4 md:px-6 py-16 md:py-12">
        {/* Header Spacer for Mobile Sidebar Toggle */}
        <div className="h-4 lg:hidden"></div>
        
        {/* Header */}
        <div className="mb-8 md:mb-10 text-center lg:text-left">
          <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
              <span className="text-2xl md:text-3xl">📂</span>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Карта Проекта
              </h1>
              <p className="text-[10px] md:text-sm text-muted-foreground mt-1 font-mono uppercase tracking-widest opacity-60">
                Project Architecture Overview
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-border/50 via-border to-transparent mb-6"></div>
        </div>

        {/* Legend & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="modern-card p-4 md:p-5 border-primary/10">
            <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 md:mb-4 text-center md:text-left">
              Роли доступа
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {Object.entries(ROLES).map(([key, r]) => (
                <div 
                  key={key} 
                  className="flex items-center gap-1.5 md:gap-2 px-2 md:px-2.5 py-1 rounded-lg border bg-muted/30 transition-all hover:bg-muted/50"
                  style={{ borderColor: `${r.color}33`, color: r.color }}
                >
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: r.color }}></div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modern-card p-4 md:p-5 border-primary/10 flex flex-col justify-center">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <span className="text-sm">🔍</span>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по файлам..."
                className="w-full bg-slate-900/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl py-2.5 md:py-2.5 pl-10 pr-4 text-xs md:text-sm transition-all outline-none text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Main Tree Container */}
        <div className="modern-card p-0 md:p-6 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-3xl -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
          
          <div className="relative z-10 w-full overflow-x-auto p-4 md:p-0">
            <div className="min-w-max md:min-w-0 space-y-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 text-muted-foreground/50 italic text-sm">
                  <span className="text-3xl md:text-4xl mb-4 opacity-20">🔎</span>
                  <p>Ничего не найдено</p>
                </div>
              ) : (
                filtered.map((node, i) => <Node key={i} node={node} depth={0} searchQuery={search} />)
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4 text-center text-[9px] md:text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.2em]">
          Interactive Structure Visualization • 2026
        </div>
      </div>
    </div>
  );
}