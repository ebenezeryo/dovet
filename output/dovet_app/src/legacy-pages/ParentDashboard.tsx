import React, { useState } from "react";
import { Link, useNavigate, Routes, Route, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  FileText,
  LogOut,
  GraduationCap,
  Bell,
  Menu,
  X,
  Users,
  Flame,
  Award,
  Download,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { DovetUser, GradeResult } from "@/lib/types";
import { AssessmentModeBadge } from "@/components/AssessmentModeBadge";
import { GradeBadge } from "@/components/GradeBadge";
import { useAuth } from "@/lib/auth-context";
import { WEEKLY_SUBJECT_PACKS } from "@/lib/learn-packs-data";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/parent" },
  { name: "Weekly Packs", icon: BookOpen, href: "/parent/learn-packs" },
  { name: "Exams", icon: FileText, href: "/parent/exams" },
  { name: "Progress Analytics", icon: BarChart3, href: "/parent/progress" },
];

const CHILDREN_DATA = [
  {
    id: "child-1",
    name: "Chloe Adeyemi",
    year: "Year 7",
    class: "7A",
    school: "Dovet International Academy",
    teacher: "Mrs. Olu Adebayo",
    overallGrade: "A" as GradeResult,
    learnAvg: 88,
    examAvg: 84,
    streak: 5,
    attendance: "98.5%",
    completedSubjectPacks: 6,
    totalSubjectPacks: 8,
    weakTopics: ["Fractions & Ratios (64%)", "Flowchart Branching (72%)"],
    strongTopics: ["Algorithms Sequence (94%)", "Scientific Notation (90%)"],
    teacherNote: "Chloe is maintaining exceptional consistency with her weekly subject packs. Please encourage her to complete the Physics pack before Sunday.",
  },
  {
    id: "child-2",
    name: "Daniel Adeyemi",
    year: "Year 4",
    class: "4B",
    school: "Dovet International Academy",
    teacher: "Mr. Chukwu",
    overallGrade: "B" as GradeResult,
    learnAvg: 76,
    examAvg: 78,
    streak: 3,
    attendance: "96.0%",
    completedSubjectPacks: 4,
    totalSubjectPacks: 6,
    weakTopics: ["Division with Remainders (58%)"],
    strongTopics: ["Reading Vocabulary (86%)", "Mental Math (82%)"],
    teacherNote: "Daniel has completed 4 weekly packs. He still has Mathematics and Science due in 48 hours.",
  },
];

function ParentOverview({ child, onOpenReport }: { child: typeof CHILDREN_DATA[0]; onOpenReport: () => void }) {
  const completionPct = Math.round((child.completedSubjectPacks / child.totalSubjectPacks) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Child Summary Header */}
      <div className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5', color: '#3C594E' }}>
              {child.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{child.name}</h2>
                <Badge className="border font-semibold text-xs" style={{ backgroundColor: '#eaf1ef', color: '#3C594E', borderColor: '#c8dcd5' }}>
                  {child.year} · {child.class}
                </Badge>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm font-normal mt-1">
                {child.school} · Form Teacher: <span className="text-slate-700 font-medium">{child.teacher}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GradeBadge grade={child.overallGrade} score={`${Math.round((child.learnAvg + child.examAvg) / 2)}%`} className="shrink-0" />
            <Button
              onClick={onOpenReport}
              variant="outline"
              className="rounded-2xl font-semibold border-slate-200 gap-2 h-10 text-xs sm:text-sm hover:bg-slate-50"
            >
              <Download className="h-4 w-4" style={{ color: '#3C594E' }} /> Term Report Card
            </Button>
          </div>
        </div>

        {/* Weekly Completion Progress Meter */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">
              Week 4 Subject Packs Progress: {child.completedSubjectPacks} of {child.totalSubjectPacks} Completed
            </span>
            <span className="font-bold" style={{ color: '#3C594E' }}>{completionPct}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${completionPct}%`, backgroundColor: '#3C594E' }}
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#3C594E' }}>{child.learnAvg}%</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Weekly Packs Avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#3C594E' }}>{child.examAvg}%</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Summative Exam Avg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1 tracking-tight" style={{ color: '#BF8360' }}>
              <Flame className="h-5 w-5" style={{ fill: '#BF8360' }} /> {child.streak} Wks
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Active Streak</div>
          </div>
        </div>
      </div>

      {/* Weekly Subject Packs Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Weekly Subject Packs Status (Week 4)</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {WEEKLY_SUBJECT_PACKS.slice(0, 6).map((pack) => (
            <div
              key={pack.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: '#3C594E' }}>
                  {pack.subject}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                  {pack.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-normal">
                  {pack.completionStatus === "completed" ? (
                    <span className="font-semibold flex items-center gap-1" style={{ color: '#3C594E' }}>
                      <CheckCircle2 className="h-3 w-3" /> Completed ({pack.score})
                    </span>
                  ) : pack.completionStatus === "due_soon" ? (
                    <span className="font-semibold flex items-center gap-1" style={{ color: '#BF8360' }}>
                      <Clock className="h-3 w-3" /> Due in {pack.daysRemaining}d
                    </span>
                  ) : (
                    <span>{pack.daysRemaining} days left</span>
                  )}
                </div>
              </div>

              {pack.completionStatus === "completed" && pack.grade && (
                <GradeBadge grade={pack.grade} score={pack.score || `${pack.percentage}%`} className="shrink-0" />
              )}
              {pack.completionStatus !== "completed" && (
                <Badge
                  className="border text-[10px] font-medium shrink-0 bg-slate-50 text-slate-600 border-slate-200"
                  style={pack.completionStatus === "due_soon" ? { backgroundColor: '#fdf3ee', color: '#BF8360', borderColor: '#e8c4a8' } : {}}
                >
                  Pending
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Feedback Note */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Teacher Feedback</h3>
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed italic">
            "{child.teacherNote}"
          </p>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Teacher: <span className="font-medium text-slate-700">{child.teacher}</span></span>
            <span>Week 4 Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Parent Dashboard Shell ──────────────────────────────────────────────────
export const ParentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [selectedChildId, setSelectedChildId] = useState("child-1");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedChild = CHILDREN_DATA.find((c) => c.id === selectedChildId) || CHILDREN_DATA[0];

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#3C594E' }}>
            <Users className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Parent Portal</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200/70 transform transition-transform duration-200 lg:translate-x-0 lg:static",
          isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )} style={{ backgroundColor: '#ffffff' }}>
          <div className="flex h-full flex-col">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5', color: '#3C594E' }}>
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Parent Portal</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Family Dashboard</div>
                </div>
              </div>
            </div>

            {/* Multi-Child Switcher */}
            <div className="p-3 border-b border-slate-100">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block px-1">
                Select Child
              </label>
              <div className="space-y-1">
                {CHILDREN_DATA.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChildId(c.id)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between",
                      selectedChildId === c.id
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <div>
                      <div className="font-semibold text-xs leading-tight">{c.name}</div>
                      <div className={cn("text-[10px] mt-0.5", selectedChildId === c.id ? "text-slate-300" : "text-slate-400")}>
                        {c.year} · {c.class}
                      </div>
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md", selectedChildId === c.id ? "bg-slate-800 text-white" : "border border-slate-200")} style={selectedChildId !== c.id ? { backgroundColor: '#eaf1ef', color: '#3C594E' } : {}}>
                      {c.overallGrade}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== "/parent" && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-[#73D99F]" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-100">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-semibold text-xs"
                onClick={() => { logout(); navigate("/login"); }}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <main className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<ParentOverview child={selectedChild} onOpenReport={() => setReportModalOpen(true)} />} />
              <Route path="/learn-packs" element={<ParentOverview child={selectedChild} onOpenReport={() => setReportModalOpen(true)} />} />
              <Route path="/exams" element={<ParentOverview child={selectedChild} onOpenReport={() => setReportModalOpen(true)} />} />
              <Route path="/progress" element={<ParentOverview child={selectedChild} onOpenReport={() => setReportModalOpen(true)} />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Term Report Card Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Term Academic Report</DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-normal mt-1">
                  Official Formative & Summative Evaluation · {selectedChild.school}
                </DialogDescription>
              </div>
              <GradeBadge grade={selectedChild.overallGrade} score={`${Math.round((selectedChild.learnAvg + selectedChild.examAvg) / 2)}%`} />
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3 bg-slate-50/80 border border-slate-100 p-4 rounded-2xl text-xs font-medium text-slate-700">
              <div>Student: <span className="font-semibold text-slate-900">{selectedChild.name}</span></div>
              <div>Grade Level: <span className="font-semibold text-slate-900">{selectedChild.year} ({selectedChild.class})</span></div>
              <div>Form Teacher: <span className="font-semibold text-slate-900">{selectedChild.teacher}</span></div>
              <div>Attendance: <span className="font-semibold" style={{ color: '#3C594E' }}>{selectedChild.attendance}</span></div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Weekly Pack Mastery Status</h4>
              <div className="p-3 rounded-2xl text-xs font-semibold" style={{ backgroundColor: '#eaf1ef', border: '1px solid #b2eccf', color: '#2a3f38' }}>
                {selectedChild.completedSubjectPacks} of {selectedChild.totalSubjectPacks} Subject Packs Completed on Time
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Strengths & Mastery Areas</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedChild.strongTopics.map((s, i) => (
                  <Badge key={i} className="border font-semibold text-xs py-1 px-3 rounded-xl" style={{ backgroundColor: '#e8f9f0', color: '#3C594E', borderColor: '#b2eccf' }}>
                    ✓ {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Target Improvement Topics</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedChild.weakTopics.map((w, i) => (
                  <Badge key={i} className="border font-semibold text-xs py-1 px-3 rounded-xl" style={{ backgroundColor: '#fdf3ee', color: '#BF8360', borderColor: '#e8c4a8' }}>
                    ⚡ {w}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl text-xs" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5', color: '#2a3f38' }}>
              <div className="font-semibold mb-1">Teacher Recommendation:</div>
              <p className="leading-relaxed">{selectedChild.teacherNote}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setReportModalOpen(false)} className="rounded-xl font-semibold text-xs">
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success(`Exporting PDF Report Card for ${selectedChild.name}...`);
                setReportModalOpen(false);
              }}
              className="rounded-xl font-semibold text-xs text-white gap-2 shadow-sm"
              style={{ backgroundColor: '#3C594E' }}
            >
              <Download className="h-4 w-4" /> Download PDF Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
