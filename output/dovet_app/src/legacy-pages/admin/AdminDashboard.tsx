import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Users, 
  FileText, 
  Search, 
  Bell, 
  UserPlus, 
  ChevronRight, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
} from 'lucide-react';
import {
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogTrigger,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { countries, states as allStates, lgas as allLgas } from "@/lib/location-data";
import { cn } from '@/lib/utils';
import * as Supabase from '@supabase/supabase-js';

function toastSupabaseError(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'message' in error) {
      const msg = String((error as Supabase.PostgrestError).message || fallback)
      const details = 'details' in error && (error as Supabase.PostgrestError).details
        ? String((error as Supabase.PostgrestError).details)
        : undefined
      const text = details ? msg + ' — ' + details : msg || fallback
      toast.error(text)
      return
    }
    toast.error(fallback)
  }

import { useStudents } from "@/lib/student-store";
import { StudentModal } from "@/components/StudentModal";
import type { StudentRecord } from "@/lib/types";

export const AdminDashboardHome = () => {
  const [user, setUser] = useState<any>(null);
  const [branding, setBranding] = useState({ name: '', brand_color: '' });
  const { students, addStudent } = useStudents();
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  const [examForm, setExamForm] = useState({ title: "", subject: "", totalMarks: "100", durationMinutes: "", instructions: "", yearGroup: "", className: "" });
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("dovet_user");
    if(userData) {
        setUser(JSON.parse(userData));
    }
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    const { data, error } = await supabase.functions.invoke('school-branding', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('dovet_token')}`
      }
    });
    if (!error && data) {
      setBranding({
        name: data.name || "",
        brand_color: data.brand_color || "#3C594E",
      });
    }
  };

  const filteredStates = allStates.filter(s => s.countryCode === (countries.find(c => c.name === studentForm.country)?.code || ""));
  const filteredLgas = allLgas.filter(l => l.stateName === studentForm.state);

  const handleAddStudent = (data: Partial<StudentRecord>) => {
    addStudent(data);
  };

  const handleCreateExam = async () => {
    if (!examForm.title.trim() || !examForm.subject.trim() || !examForm.totalMarks) {
      toast.error("Title, subject, and total marks are required");
      return;
    }

    setIsCreatingExam(true);
    try {
      const examPayload = {
          title: examForm.title.trim(),
          subject: examForm.subject.trim(),
          totalMarks: parseInt(examForm.totalMarks) || 100,
          durationMinutes: examForm.durationMinutes ? parseInt(examForm.durationMinutes) : 60,
          instructions: examForm.instructions?.trim() || "",
          yearGroup: examForm.yearGroup?.trim() || "",
          className: examForm.className?.trim() || "",
          examType: 'formative',
          isPublished: false
        };

      const { data, error } = await supabase.functions.invoke('admin-create-exam', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dovet_token')}`,
          'x-subdomain': user?.subdomain
        },
        body: examPayload
      });

      if (error) {
        toastSupabaseError(
          error, 
          "Failed to create exam. Check all fields required."
        );
        console.error('Request body:', examPayload, "Exam creation error:", error);
      } else {
        toast.success(`Exam "${data?.exam?.title || examForm.title}" created successfully!`);
        setExamForm({ title: "", subject: "", totalMarks: "100", durationMinutes: "", instructions: "", yearGroup: "", className: "" });
        setExamDialogOpen(false);
      }
    } catch (err) {
      toast.error("An error occurred while creating exam");
    } finally {
      setIsCreatingExam(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <style dangerouslySetInnerHTML={{ __html: `:root { --primary: ${branding.brand_color}; --ring: ${branding.brand_color}; }` }} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Hey {user?.fullName?.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Here's what's happening at <span className="text-primary font-bold">{branding.name || user?.schoolName}</span> today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search students, staff..." 
              className="pl-10 w-64 bg-white border-slate-200 rounded-xl focus:ring-primary/20 transition-all" 
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/25 font-bold px-6 h-11 bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
            Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: "1,284", icon: Users,      color: "text-[#3C594E]", bg: "bg-[#eaf1ef]", trend: "+12%" },
          { label: "Active Exams",    value: "42",    icon: FileText,   color: "text-[#BF8360]", bg: "bg-[#fdf3ee]", trend: "+5%"  },
          { label: "Faculty Members", value: "86",    icon: ShieldCheck,color: "text-[#3C594E]", bg: "bg-[#e8f9f0]", trend: "0%"   },
          { label: "Submissions",     value: "24.5k", icon: BookOpen,   color: "text-[#3C594E]", bg: "bg-[#F2F2F2]", trend: "+18%" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none px-2 py-0.5">
                  <TrendingUp className="h-3 w-3 mr-1 inline" />
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-lg font-bold text-slate-900">
            Control Center
          <          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setStudentDialogOpen(true)}
              className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#c8dcd5] transition-all text-left group"
            >
              <div className="p-4 bg-[#eaf1ef] rounded-2xl transition-colors">
                <UserPlus className="h-6 w-6 text-[#3C594E]" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Add Students</h3>
                <p className="text-sm text-slate-500 font-medium">Onboard new students to the platform</p>
              </div>
              <ChevronRight className="h-5 w-5 ml-auto text-slate-300 group-hover:text-[#3C594E] transition-colors" />
            </button>

            <StudentModal
              open={studentDialogOpen}
              onOpenChange={setStudentDialogOpen}
              onSave={handleAddStudent}
            />alog>

            <Dialog open={examDialogOpen} onOpenChange={setExamDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#e8c4a8] transition-all text-left group">
                  <div className="p-4 bg-[#fdf3ee] rounded-2xl transition-colors">
                    <FileText className="h-6 w-6 text-[#BF8360]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Create Exam</h3>
                    <p className="text-sm text-slate-500 font-medium">Setup new assessments for classes</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto text-slate-300 group-hover:text-[#BF8360] transition-colors" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl overflow-hidden border-none shadow-2xl p-0">
                <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                  <DialogTitle className="text-2xl font-black text-slate-900">Setup New Exam</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Exam Title</Label>
                    <Input 
                      value={examForm.title}
                      onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                      placeholder="Enter exam title" 
                      className="h-12 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Subject</Label>
                      <Input 
                        value={examForm.subject}
                        onChange={(e) => setExamForm({...examForm, subject: e.target.value})}
                        placeholder="Subject" 
                        className="h-12 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Total Marks</Label>
                      <Input 
                        type="number"
                        value={examForm.totalMarks}
                        onChange={(e) => setExamForm({...examForm, totalMarks: e.target.value})}
                        className="h-12 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Duration (Minutes)</Label>
                    <Input 
                      type="number"
                      value={examForm.durationMinutes}
                      onChange={(e) => setExamForm({...examForm, durationMinutes: e.target.value})}
                      placeholder="60" 
                      className="h-12 rounded-xl bg-slate-50"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Instructions</Label>
                    <Textarea
                      value={examForm.instructions}
                      onChange={(e) => setExamForm({ ...examForm, instructions: e.target.value })}
                      placeholder="Provide clear instructions for the exam..."
                      className="rounded-xl bg-slate-50 min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Year Group</Label>
                      <Input 
                        value={examForm.yearGroup}
                        onChange={(e) => setExamForm({...examForm, yearGroup: e.target.value})}
                        placeholder="Year Group"
                        className="h-12 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Class Name</Label>
                      <Input 
                        value={examForm.className}
                        onChange={(e) => setExamForm({...examForm, className: e.target.value})}
                        placeholder="Class Name"
                        className="h-12 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                  <Button variant="ghost" onClick={() => setExamDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateExam} disabled={isCreatingExam} className="rounded-xl px-8 text-white" style={{ backgroundColor: '#BF8360' }}>
                    {isCreatingExam ? "Creating..." : "Generate Exam"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          </div>{/* end Control Center card */}

          <div className="rounded-[2rem] border border-slate-100 p-8 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-2xl font-black text-slate-900 mb-8">Recent Activity</h2>
            <div className="space-y-6">
              {[
                { title: 'New Exam Submission', user: 'David Chen', time: '5 mins ago', icon: CheckCircle2, color: 'text-[#3C594E]', bg: 'bg-[#e8f9f0]' },
                { title: 'Physics Final Scheduled', user: 'Admin', time: '1 hour ago', icon: Calendar, color: 'text-[#BF8360]', bg: 'bg-[#fdf3ee]' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={cn("p-3 rounded-2xl", activity.bg)}>
                    <activity.icon className={cn("h-5 w-5", activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 truncate">{activity.title}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{activity.user} &bull; {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-black mb-6 relative z-10">Academy Status</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Attendance</span>
                <span className="font-black">94.2%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[94%]" />
              </div>
            </div>
            <Button className="w-full mt-8 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-12 font-black">
              Daily Briefing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
