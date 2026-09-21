import React, { useState, useEffect } from "react";
import { useNavigate, Link, Routes, Route, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  LogOut,
  GraduationCap,
  Bell,
  Menu,
  X,
  Award,
  Clock,
  Flame,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Target,
  Trophy,
  Filter,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { DovetUser, GradeResult, LearnPack } from "@/lib/types";
import { AssessmentModeBadge } from "@/components/AssessmentModeBadge";
import { GradeBadge } from "@/components/GradeBadge";
import { StudentProgress } from "./student/StudentProgress";
import { useAuth } from "@/lib/auth-context";
import { WEEKLY_SUBJECT_PACKS } from "@/lib/learn-packs-data";
import { NotificationBell } from "@/components/NotificationBell";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { name: "Weekly Packs", icon: BookOpen, href: "/student/learn-packs" },
  { name: "My Exams", icon: FileText, href: "/student/exams" },
  { name: "My Results", icon: BarChart3, href: "/student/results" },
  { name: "Progress", icon: Award, href: "/student/progress" },
];

const BADGES = [
  { id: "1", title: "5-Week Streak",  icon: Flame,  color: "text-[#BF8360] bg-[#fdf3ee] border-[#e8c4a8]", unlocked: true,  desc: "Completed subject packs 5 weeks consecutively" },
  { id: "2", title: "Speed Precision",icon: Zap,    color: "text-[#3C594E] bg-[#eaf1ef] border-[#c8dcd5]", unlocked: true,  desc: "Completed questions with high accuracy and speed" },
  { id: "3", title: "Mastery Star",   icon: Trophy, color: "text-[#3C594E] bg-[#e8f9f0] border-[#b2eccf]", unlocked: true,  desc: "Scored 90%+ on Mathematics & ICT packs" },
  { id: "4", title: "Exam Ready",     icon: Target, color: "text-slate-600 bg-slate-50 border-slate-200/80", unlocked: false, desc: "Complete all 21 subject weekly packs before term ends" },
];

// ── Student Home ─────────────────────────────────────────────────────────────
function StudentHome({ user }: { user: DovetUser }) {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<"all" | "due_soon" | "active" | "completed">("all");

  const completedPacks = WEEKLY_SUBJECT_PACKS.filter((p) => p.completionStatus === "completed");
  const dueSoonPacks = WEEKLY_SUBJECT_PACKS.filter((p) => p.completionStatus === "due_soon");
  const activePacks = WEEKLY_SUBJECT_PACKS.filter((p) => p.completionStatus === "active");

  const completionPct = Math.round((completedPacks.length / WEEKLY_SUBJECT_PACKS.length) * 100);

  const displayedPacks =
    filterTab === "all"
      ? WEEKLY_SUBJECT_PACKS
      : filterTab === "due_soon"
      ? dueSoonPacks
      : filterTab === "active"
      ? activePacks
      : completedPacks;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Figma-Style Clean Hero Banner */}
      <div className="relative overflow-hidden text-white p-6 sm:p-8 rounded-3xl border shadow-sm" style={{ backgroundColor: '#3C594E', borderColor: '#2e4339' }}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', color: '#F2F2F2' }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#73D99F' }} />
              Week 4 Learning Cycle · Term 1
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good morning, {user.fullName.split(" ")[0]}
            </h1>
            <p className="text-sm font-normal max-w-xl leading-relaxed" style={{ color: 'rgba(242,242,242,0.85)' }}>
              You have <span className="text-white font-semibold">{dueSoonPacks.length} subject packs closing soon</span>. Each pack is active for 7 days from publication.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/player/learn/pack-ict-w4")}
              className="rounded-2xl font-semibold text-white shadow-md gap-2 h-11 px-5 text-sm transition-all"
              style={{ backgroundColor: '#3C594E' }}
            >
              <Play className="h-4 w-4 fill-white" /> Continue Practice
            </Button>
          </div>
        </div>
      </div>

      {/* Urgent 48h Deadline Alert (if any due soon) */}
      {dueSoonPacks.length > 0 && (
        <div className="bg-[#fdf3ee]/90 border border-[#e8c4a8]/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-[#BF8360]/10 border border-[#BF8360]/20 flex items-center justify-center text-[#BF8360] shrink-0 font-bold">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {dueSoonPacks.length} Subject Packs Expiring in Less Than 48 Hours
              </h3>
              <p className="text-slate-600 text-xs mt-0.5">
                {dueSoonPacks.map((p) => p.subject).join(", ")} will close automatically once the 7-day window ends.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setFilterTab("due_soon")}
            variant="outline"
            className="rounded-xl font-semibold text-xs border-[#e8c4a8] text-[#7a4f30] bg-white hover:bg-[#fdf3ee] shrink-0 h-9 px-4"
          >
            Review Expiring Packs →
          </Button>
        </div>
      )}

      {/* Weekly Progress Meter Card */}
      <Card className="border border-slate-200/70 shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
                  Weekly Subject Progress
                </CardTitle>
                <Badge className="bg-slate-100 text-slate-700 border-none font-semibold text-[11px]">
                  Week 4 of Term 1
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Completed <span className="font-semibold text-slate-900">{completedPacks.length}</span> of {WEEKLY_SUBJECT_PACKS.length} active subject packs ({completionPct}%)
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold tracking-tight" style={{ color: '#3C594E' }}>{completionPct}%</span>
              <span className="text-[11px] text-slate-400 font-medium block">Completed</span>
            </div>
          </div>

            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPct}%`, backgroundColor: '#3C594E' }}
              style={{ width: `${completionPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
              <span className="font-bold text-base block" style={{ color: '#3C594E' }}>{completedPacks.length}</span>
              <span className="text-slate-500 font-medium text-[11px]">Completed</span>
            </div>
            <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
              <span className="font-bold text-[#BF8360] text-base block">{dueSoonPacks.length}</span>
              <span className="text-slate-500 font-medium text-[11px]">Due Soon</span>
            </div>
            <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
              <span className="font-bold text-base block" style={{ color: '#3C594E' }}>{activePacks.length}</span>
              <span className="text-slate-500 font-medium text-[11px]">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Subject Pack Grid with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Weekly Subject Packs</h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              1 pack per subject · 7-day rolling validity window
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto">
            <button
              onClick={() => setFilterTab("all")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                filterTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              All ({WEEKLY_SUBJECT_PACKS.length})
            </button>
            <button
              onClick={() => setFilterTab("due_soon")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                filterTab === "due_soon" ? "bg-white text-[#BF8360] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Due Soon ({dueSoonPacks.length})
            </button>
            <button
              onClick={() => setFilterTab("active")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                filterTab === "active" ? "bg-white text-[#3C594E] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Active ({activePacks.length})
            </button>
            <button
              onClick={() => setFilterTab("completed")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                filterTab === "completed" ? "bg-white text-[#3C594E] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Completed ({completedPacks.length})
            </button>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {displayedPacks.map((pack) => (
            <Card
              key={pack.id}
              className="border border-slate-200/70 shadow-sm hover:border-slate-300 hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden flex flex-col justify-between"
            >
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md" style={{ color: '#3C594E', backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5' }}>
                        {pack.subject}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">Week {pack.weekNumber}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug tracking-tight">
                      {pack.title}
                    </h3>
                  </div>

                  {pack.completionStatus === "completed" && pack.grade && (
                    <GradeBadge grade={pack.grade} score={pack.score || `${pack.percentage}%`} className="shrink-0" />
                  )}
                  {pack.completionStatus === "due_soon" && (
                    <Badge className="bg-[#fdf3ee] text-[#BF8360] border border-[#e8c4a8]/60 font-semibold text-[10px] shrink-0 gap-1">
                      <Clock className="h-3 w-3" /> Due in {pack.daysRemaining}d
                    </Badge>
                  )}
                  {pack.completionStatus === "active" && (
                    <Badge className="bg-slate-50 text-slate-600 border border-slate-200/60 font-semibold text-[10px] shrink-0 gap-1">
                      <Clock className="h-3 w-3" /> {pack.daysRemaining} days left
                    </Badge>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Teacher: <span className="text-slate-600 font-medium">{pack.teacherName}</span></span>
                  <span>{pack.questionCount} Questions</span>
                </div>

                <div className="pt-1">
                  {pack.completionStatus === "completed" ? (
                    <Button
                      onClick={() => navigate(`/player/learn/${pack.id}`)}
                      variant="outline"
                      className="w-full rounded-2xl font-semibold text-xs h-11 border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" style={{ color: '#3C594E' }} /> Review Practice Pack
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/player/learn/${pack.id}`)}
                      className={cn(
                        "w-full rounded-2xl font-semibold text-xs h-11 text-white shadow-sm gap-1.5 transition-all",
                        pack.completionStatus === "due_soon"
                          ? "bg-[#BF8360] hover:bg-[#a8714f]"
                          : "bg-[#3C594E] hover:bg-[#2e4339]"
                      )}
                    >
                      <Play className="h-3.5 w-3.5 fill-white" /> Start Practice Pack
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Achievements & Consistency Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={cn(
                "p-4 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition-all",
                b.unlocked ? "border-slate-200/80 hover:shadow-md" : "border-slate-100 opacity-40 grayscale"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border", b.color)}>
                  <b.icon className="h-4 w-4" />
                </div>
                {b.unlocked ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border" style={{ color: '#3C594E', backgroundColor: '#e8f9f0', borderColor: '#b2eccf' }}>
                    Earned
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    Locked
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800">{b.title}</h4>
                <p className="text-[11px] text-slate-400 font-normal mt-0.5 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Weekly Packs Tab ─────────────────────────────────────────────────────────
function StudentLearnPacksTab({ user }: { user: DovetUser }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Weekly Subject Packs</h1>
        <p className="text-slate-500 text-sm font-normal mt-1">
          Complete each subject pack once a week before its 7-day validity window expires.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {WEEKLY_SUBJECT_PACKS.map((pack) => (
          <Card key={pack.id} className="border border-slate-200/70 shadow-sm hover:border-slate-300 hover:shadow-md transition-all rounded-3xl bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md inline-block mb-2" style={{ color: '#3C594E', backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5' }}>
                    {pack.subject}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-tight tracking-tight">{pack.title}</h3>
                  <p className="text-xs text-slate-400 font-normal mt-1">
                    Teacher: {pack.teacherName} · {pack.curriculum} · Week {pack.weekNumber}
                  </p>
                </div>
                {pack.completionStatus === "completed" && pack.grade && (
                  <GradeBadge grade={pack.grade} score={pack.score || `${pack.percentage}%`} />
                )}
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500">Validity Period:</span>
                <span className={cn(
                  pack.completionStatus === "due_soon" ? "text-[#BF8360] font-bold" : "text-slate-700"
                )}>
                  {pack.completionStatus === "completed" ? "Completed on time" : `Active · ${pack.daysRemaining} days left`}
                </span>
              </div>

              <Button
                onClick={() => navigate(`/player/learn/${pack.id}`)}
                className={cn(
                  "w-full rounded-2xl font-semibold text-xs h-11 text-white shadow-sm gap-1.5",
                  pack.completionStatus === "completed"
                    ? "bg-slate-800 hover:bg-slate-700 text-white"
                    : pack.completionStatus === "due_soon"
                    ? "bg-[#BF8360] hover:bg-[#a8714f]"
                    : "bg-[#3C594E] hover:bg-[#2e4339]"
                )}
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                {pack.completionStatus === "completed" ? "Review Practice Pack" : "Start Weekly Pack"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Exams Tab ─────────────────────────────────────────────────────────────────
function StudentExams({ user }: { user: DovetUser }) {
  const navigate = useNavigate();
  const exams = [
    { id: "1", title: "ICT Midterm Exam", subject: "ICT", teacher: "Mrs Olu", durationMinutes: 60, scheduledAt: "Friday 09:00", status: "scheduled" },
    { id: "2", title: "Biology Unit Test", subject: "Biology", teacher: "Mr Okafor", durationMinutes: 45, scheduledAt: "Completed", status: "completed", score: "42/50", pct: 84, grade: "A" as GradeResult },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Summative Assessments</h1>
        <p className="text-slate-500 text-sm font-normal mt-1">Formal scheduled evaluations</p>
      </div>

      <div className="grid gap-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="border border-slate-200/70 shadow-sm hover:shadow-md transition-all rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AssessmentModeBadge mode="exam" size="sm" />
                    <Badge className={cn("text-xs font-semibold border-none",
                    exam.status === "completed" ? "bg-[#e8f9f0] text-[#3C594E]" : "bg-[#fdf3ee] text-[#BF8360]"
                    )}>
                      {exam.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">{exam.title}</h3>
                  <p className="text-sm text-slate-500 font-normal mt-1">
                    {exam.subject} · {exam.teacher} · {exam.durationMinutes} min · {exam.scheduledAt}
                  </p>
                </div>
                {exam.status === "completed" && exam.grade && (
                  <GradeBadge grade={exam.grade} score={`${exam.pct}%`} className="shrink-0" />
                )}
                {exam.status === "scheduled" && (
                  <Button
                    onClick={() => navigate("/player/exam/1")}
                    className="rounded-2xl font-semibold text-white shrink-0 h-11 px-5 shadow-sm"
                    style={{ backgroundColor: '#BF8360' }}
                  >
                    <Play className="h-4 w-4 mr-2" /> Start Exam
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Results Tab ───────────────────────────────────────────────────────────────
function StudentResults({ user }: { user: DovetUser }) {
  const results = [
    { type: "learn" as const, title: "Algorithms — Week 4",      subject: "ICT",         score: "18/20", pct: 90, grade: "A+" as GradeResult, date: "Today" },
    { type: "learn" as const, title: "Significant Figures",      subject: "Mathematics", score: "18/20", pct: 90, grade: "A+" as GradeResult, date: "Yesterday" },
    { type: "exam" as const,  title: "Biology Unit Test",        subject: "Biology",     score: "42/50", pct: 84, grade: "A" as GradeResult,  date: "9 Jul 2026" },
    { type: "learn" as const, title: "French Verbes au Présent", subject: "French",      score: "16/20", pct: 80, grade: "A" as GradeResult,  date: "4 Jul 2026" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grade History</h1>
        <p className="text-slate-500 text-sm font-normal mt-1">Weekly subject score history and letter grades</p>
      </div>

      <div className="space-y-3">
        {results.map((r, i) => (
          <Card key={i} className="border border-slate-200/70 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <GradeBadge grade={r.grade} score={`${r.pct}%`} className="shrink-0 min-w-[60px]" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-sm leading-tight truncate">{r.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <AssessmentModeBadge mode={r.type} size="sm" />
                  <span className="text-xs text-slate-400 font-medium">{r.subject} · {r.score} · {r.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Main Student Dashboard Shell ──────────────────────────────────────────────
export const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Top Bar with Notifications */}
      <header className="sticky top-0 z-40 flex items-center justify-between backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm" style={{ backgroundColor: '#3C594E' }}>
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-semibold text-slate-700 text-sm tracking-tight block">
              {user.schoolName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium block">
              Student Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

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
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-700 text-sm truncate">{user.schoolName}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Secondary Workspace</div>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 mt-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== "/student" && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
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
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-sm" style={{ backgroundColor: '#3C594E' }}>
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-700 text-xs truncate">{user.fullName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
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
              <Route path="/" element={<StudentHome user={user} />} />
              <Route path="/learn-packs" element={<StudentLearnPacksTab user={user} />} />
              <Route path="/exams" element={<StudentExams user={user} />} />
              <Route path="/results" element={<StudentResults user={user} />} />
              <Route path="/progress" element={<StudentProgress />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
