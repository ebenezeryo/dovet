import React, { useState, useEffect } from "react";
import { useNavigate, Link, Routes, Route, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, Settings, LogOut,
  Bell, GraduationCap, BookOpen, BarChart3, Sparkles, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { DovetUser } from "@/lib/types";
import { TeacherHome } from "./teacher/TeacherHome";
import { TeacherLearnPacks } from "./teacher/TeacherLearnPacks";
import { TeacherExams } from "./teacher/TeacherExams";
import { TeacherClasses } from "./teacher/TeacherClasses";
import { TeacherAnalytics } from "./teacher/TeacherAnalytics";
import { TeacherAIGenerator } from "./teacher/TeacherAIGenerator";
import { TeacherSettings } from "./teacher/TeacherSettings";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/teacher" },
  { name: "My Classes", icon: Users, href: "/teacher/classes" },
  { name: "Weekly Packs", icon: BookOpen, href: "/teacher/learn-packs" },
  { name: "AI Generator", icon: Sparkles, href: "/teacher/ai-generator" },
  { name: "Exams", icon: FileText, href: "/teacher/exams" },
  { name: "Analytics", icon: BarChart3, href: "/teacher/analytics" },
  { name: "Settings", icon: Settings, href: "/teacher/settings" },
];

export const TeacherDashboard = () => {
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
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#3C594E' }}>
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-700 text-sm">{user.schoolName}</span>
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
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-700 text-sm truncate">{user.schoolName}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Teacher Workspace</div>
                </div>
              </div>
            </div>

            {/* Assessment modes pills */}
            <div className="mx-3 mt-3 rounded-2xl bg-slate-50/80 border border-slate-100 p-2.5">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold border" style={{ backgroundColor: '#e8f9f0', color: '#3C594E', borderColor: '#b2eccf' }}>
                  <BookOpen className="h-3 w-3" /> Formative
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold border" style={{ backgroundColor: '#fdf3ee', color: '#BF8360', borderColor: '#e8c4a8' }}>
                  <BarChart3 className="h-3 w-3" /> Summative
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 mt-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== "/teacher" && location.pathname.startsWith(item.href));
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
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-xs" style={{ backgroundColor: '#3C594E' }}>
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
              <Route path="/" element={<TeacherHome user={user} />} />
              <Route path="/classes" element={<TeacherClasses user={user} />} />
              <Route path="/learn-packs" element={<TeacherLearnPacks user={user} />} />
              <Route path="/ai-generator" element={<TeacherAIGenerator user={user} />} />
              <Route path="/exams" element={<TeacherExams user={user} />} />
              <Route path="/analytics" element={<TeacherAnalytics user={user} />} />
              <Route path="/settings" element={<TeacherSettings user={user} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
