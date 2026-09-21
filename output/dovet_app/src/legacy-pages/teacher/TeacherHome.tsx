import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users, Clock, TrendingUp, FileText, BookOpen,
  BarChart3, Sparkles, ChevronRight, CheckCircle2, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DovetUser } from "@/lib/types";

interface Props { user: DovetUser; }

export function TeacherHome({ user }: Props) {
  const stats = [
    { label: "Assigned Students", value: "142", icon: Users,     color: "text-[#3C594E]", bg: "bg-[#eaf1ef]", trend: "+4" },
    { label: "Active Learn Packs", value: "8",  icon: BookOpen,  color: "text-[#3C594E]", bg: "bg-[#e8f9f0]", trend: "+2" },
    { label: "Pending Exams",      value: "3",  icon: FileText,  color: "text-[#BF8360]", bg: "bg-[#fdf3ee]", trend: "" },
    { label: "Class Average",      value: "74%",icon: TrendingUp, color: "text-[#3C594E]", bg: "bg-[#F2F2F2]", trend: "↑3%" },
  ];

  const recentActivity = [
    { text: "Chloe completed Monday Algorithms quiz",  time: "2m ago",   icon: CheckCircle2, color: "text-[#3C594E]" },
    { text: "Year 7 ICT Learn Pack published",         time: "1h ago",   icon: BookOpen,     color: "text-[#3C594E]" },
    { text: "Biology Midterm exam scheduled",          time: "3h ago",   icon: FileText,     color: "text-[#BF8360]" },
    { text: "5 new students submitted Science quiz",   time: "Yesterday",icon: CheckCircle2, color: "text-[#3C594E]" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome back, {user.fullName.split(" ")[0]}! 🍎
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Here's what's happening at <span className="text-primary font-bold">{user.schoolName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <Link to="/teacher/learn-packs/new">
            <Button className="rounded-xl shadow-lg shadow-primary/25 font-bold gap-2">
              <Sparkles className="h-4 w-4" /> New Learn Pack
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2.5 rounded-xl", s.bg)}>
                  <s.icon className={cn("h-5 w-5", s.color)} />
                </div>
                {s.trend && <span className="text-xs font-bold text-slate-400">{s.trend}</span>}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions + activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-black text-slate-900">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Sparkles, title: "Generate AI Learn Pack",
                sub: "New formative pack in minutes", color: "bg-[#e8f9f0]", iconColor: "text-[#3C594E]",
                href: "/teacher/learn-packs/new"
              },
              {
                icon: FileText, title: "Create Exam",
                sub: "Build a summative assessment", color: "bg-[#fdf3ee]", iconColor: "text-[#BF8360]",
                href: "/teacher/exams/new"
              },
              {
                icon: Users, title: "View My Classes",
                sub: "Manage students and groups", color: "bg-[#eaf1ef]", iconColor: "text-[#3C594E]",
                href: "/teacher/classes"
              },
              {
                icon: BarChart3, title: "Analytics",
                sub: "Scores, trends, weak topics", color: "bg-[#F2F2F2]", iconColor: "text-[#3C594E]",
                href: "/teacher/analytics"
              },
            ].map((action, i) => (
              <Link to={action.href} key={i}>
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group cursor-pointer">
                  <div className={cn("p-3 rounded-xl", action.color)}>
                    <action.icon className={cn("h-5 w-5", action.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 text-sm">{action.title}</div>
                    <div className="text-xs text-slate-500 font-medium">{action.sub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Recent Activity</h2>
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <a.icon className={cn("h-4 w-4 shrink-0 mt-0.5", a.color)} />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{a.text}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
            <Link to="/teacher/analytics">
              <Button variant="ghost" className="w-full rounded-2xl font-bold text-slate-400 text-sm mt-2">
                View all activity →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
