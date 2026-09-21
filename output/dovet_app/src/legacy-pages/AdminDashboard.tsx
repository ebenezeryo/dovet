import React, { useState } from "react";
import { useNavigate, Link, Routes, Route, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut, 
  GraduationCap, 
  Menu,
  X,
  BookOpen,
  BarChart3,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

// Sub-pages
import { DashboardHome } from "./admin/DashboardHome";
import { UsersAndStaff } from "./admin/UsersAndStaff";
import { SettingsPage } from "./admin/SettingsPage";
import { AdminLearnPacks } from "./admin/AdminLearnPacks";
import { AdminAnalytics } from "./admin/AdminAnalytics";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#3C594E' }}>
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm" style={{ color: '#0D0D0D' }}>{user.schoolName}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-slate-200/70 transform transition-transform duration-200 lg:translate-x-0 lg:static",
          isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )} style={{ backgroundColor: '#ffffff' }}>
          <div className="flex h-full flex-col">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: '#3C594E' }}>
                  <Shield className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: '#0D0D0D' }}>{user.schoolName}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Administrative Console</div>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 mt-2">
              {[
                { name: "Overview", icon: LayoutDashboard, href: "/admin" },
                { name: "Staff & Students", icon: Users, href: "/admin/users" },
                { name: "Learning Packs", icon: BookOpen, href: "/admin/learn-packs" },
                { name: "School Analytics", icon: BarChart3, href: "/admin/analytics" },
                { name: "Settings & Branding", icon: SettingsIcon, href: "/admin/settings" },
              ].map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== "/admin" && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#73D99F]" : "text-slate-400")} />
                    <span>{item.name}</span>
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
                  <div className="font-semibold text-xs truncate" style={{ color: '#0D0D0D' }}>{user.fullName}</div>
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
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome user={user} />} />
              <Route path="/users" element={<UsersAndStaff user={user} />} />
              <Route path="/learn-packs" element={<AdminLearnPacks user={user} />} />
              <Route path="/analytics" element={<AdminAnalytics user={user} />} />
              <Route path="/settings" element={<SettingsPage user={user} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
