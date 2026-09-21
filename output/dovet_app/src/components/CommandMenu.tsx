import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Sparkles,
  Settings,
  LogOut,
  GraduationCap,
  Award,
  BarChart3,
  Play,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command, page, or action..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <GraduationCap className="mr-2 h-4 w-4" /> Home Landing Page
          </CommandItem>
          {user?.role === "admin" && (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/admin"))}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/admin/users"))}>
                <Users className="mr-2 h-4 w-4" /> Students & Staff Roster
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/admin/settings"))}>
                <Settings className="mr-2 h-4 w-4" /> School Settings & Branding
              </CommandItem>
            </>
          )}
          {user?.role === "teacher" && (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/teacher"))}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Teacher Portal
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/teacher/ai-generator"))}>
                <Sparkles className="mr-2 h-4 w-4" /> AI Pack Generator
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/teacher/learn-packs"))}>
                <BookOpen className="mr-2 h-4 w-4" /> Formative Learn Packs
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/teacher/classes"))}>
                <Users className="mr-2 h-4 w-4" /> Class Mastery Heatmap
              </CommandItem>
            </>
          )}
          {user?.role === "student" && (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/student"))}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Student Dashboard
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/student/learn-packs"))}>
                <BookOpen className="mr-2 h-4 w-4" /> My Daily Packs
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/student/exams"))}>
                <FileText className="mr-2 h-4 w-4" /> My Exams
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/student/results"))}>
                <Award className="mr-2 h-4 w-4" /> My Results & Grades
              </CommandItem>
            </>
          )}
          {user?.role === "parent" && (
            <>
              <CommandItem onSelect={() => runCommand(() => navigate("/parent"))}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Child Academic Overview
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/parent/progress"))}>
                <BarChart3 className="mr-2 h-4 w-4" /> Progress & Term Reports
              </CommandItem>
            </>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Launch Interactive Quizzes">
          <CommandItem onSelect={() => runCommand(() => navigate("/player/learn/1"))}>
            <Play className="mr-2 h-4 w-4" style={{ color: '#73D99F' }} /> Play 'Algorithms & Programming' Pack
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/player/learn/2"))}>
            <Play className="mr-2 h-4 w-4 text-primary" /> Play 'Significant Figures' Pack
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Demo Role Switcher">
          <CommandItem onSelect={() => runCommand(() => { switchRole("admin"); navigate("/admin"); })}>
            <Users className="mr-2 h-4 w-4" style={{ color: '#3C594E' }} /> Switch to Admin (Dr. Elizabeth Vance)
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => { switchRole("teacher"); navigate("/teacher"); })}>
            <Users className="mr-2 h-4 w-4" style={{ color: '#BF8360' }} /> Switch to Teacher (Mrs. Olu Adebayo)
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => { switchRole("student"); navigate("/student"); })}>
            <Users className="mr-2 h-4 w-4" style={{ color: '#73D99F' }} /> Switch to Student (Jack Sterling)
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => { switchRole("parent"); navigate("/parent"); })}>
            <Users className="mr-2 h-4 w-4" style={{ color: '#BF8360' }} /> Switch to Parent (Adeyemi Family)
          </CommandItem>
        </CommandGroup>

        {user && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem onSelect={() => runCommand(() => { logout(); navigate("/login"); })}>
                <LogOut className="mr-2 h-4 w-4 text-red-500" /> Logout
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
