import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Clock, CheckCircle2, Search, Eye, Send, Loader2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SUBJECTS, YEAR_GROUPS, CURRICULA, type DovetUser } from "@/lib/types";
import { AssessmentModeBadge } from "@/components/AssessmentModeBadge";

interface Props { user: DovetUser; }

const MOCK_EXAMS = [
  { id: "1", title: "ICT Midterm Exam", subject: "ICT", yearGroup: "Year 7", className: "7A", totalMarks: 100, durationMinutes: 60, status: "published", submissionsCount: 24, avgScore: 71 },
  { id: "2", title: "Mathematics End of Term", subject: "Mathematics", yearGroup: "Year 8", className: "8B", totalMarks: 80, durationMinutes: 90, status: "scheduled", submissionsCount: 0, avgScore: 0 },
  { id: "3", title: "Biology Unit Test", subject: "Biology", yearGroup: "Year 9", className: "9A", totalMarks: 50, durationMinutes: 45, status: "draft", submissionsCount: 0, avgScore: 0 },
];

function ExamList({ user }: Props) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_EXAMS.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle: Record<string, string> = {
    published: "bg-[#e8f9f0] text-[#3C594E]",
    scheduled: "bg-[#fdf3ee] text-[#BF8360]",
    draft:     "bg-slate-100 text-slate-600",
    closed:    "bg-[#F2F2F2] text-[#0D0D0D]",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Exams</h1>
          <p className="text-slate-500 font-medium mt-1">Summative assessments for your classes</p>
        </div>
        <Link to="/teacher/exams/new">
          <Button className="gap-2 font-bold text-white shadow-sm" style={{ backgroundColor: '#3C594E' }}>
            <Plus className="h-4 w-4" /> Create Exam
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search exams..." className="pl-10 bg-white rounded-xl border-slate-200"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-black text-slate-700 text-lg">No exams yet</h3>
          <p className="text-slate-400 mb-6">Create your first summative exam</p>
          <Link to="/teacher/exams/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Exam</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(exam => (
            <Card key={exam.id} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <AssessmentModeBadge mode="exam" size="sm" />
                      <Badge className={cn("text-xs font-bold border-none", statusStyle[exam.status])}>
                        {exam.status === "published" ? <CheckCircle2 className="h-3 w-3 mr-1 inline" /> : <Clock className="h-3 w-3 mr-1 inline" />}
                        {exam.status}
                      </Badge>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight">{exam.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                      {exam.subject} · {exam.yearGroup} {exam.className} · {exam.totalMarks} marks · {exam.durationMinutes} min
                    </p>
                  </div>
                  {exam.submissionsCount > 0 && (
                    <div className="flex gap-6 text-center shrink-0">
                      <div>
                        <div className="font-black text-slate-900 text-lg">{exam.submissionsCount}</div>
                        <div className="text-xs text-slate-400 font-medium">submissions</div>
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-lg">{exam.avgScore}%</div>
                        <div className="text-xs text-slate-400 font-medium">avg score</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    {exam.status === "draft" && (
                      <Button size="sm" className="rounded-xl gap-1.5 text-white" style={{ backgroundColor: '#3C594E' }}>
                        <Send className="h-3.5 w-3.5" /> Publish
                      </Button>
                    )}
                    {exam.submissionsCount > 0 && (
                      <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5" /> Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NewExamForm({ user }: Props) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", subject: "", yearGroup: "", className: "",
    totalMarks: "100", durationMinutes: "60", curriculum: "", instructions: "",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.subject || !form.yearGroup) {
      toast.error("Title, subject and year group are required");
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success(`Exam "${form.title}" saved as draft`);
    setIsSaving(false);
    navigate("/teacher/exams");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link to="/teacher/exams">
          <Button variant="ghost" size="sm" className="rounded-xl text-slate-500">← Back</Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Create Exam</h1>
          <p className="text-slate-500 font-medium mt-1">Build a summative assessment for your students</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-5 shadow-sm max-w-2xl">
        <div className="space-y-2">
          <Label className="font-bold text-sm text-slate-700">Exam Title *</Label>
          <Input className="h-11 rounded-xl bg-slate-50 border-slate-200" placeholder="Enter exam title"
            value={form.title} onChange={e => set("title")(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-sm text-slate-700">Subject *</Label>
            <Select value={form.subject} onValueChange={set("subject")}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200"><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-sm text-slate-700">Year Group *</Label>
            <Select value={form.yearGroup} onValueChange={set("yearGroup")}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200"><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{YEAR_GROUPS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-sm text-slate-700">Class Name</Label>
            <Input className="h-11 rounded-xl bg-slate-50 border-slate-200" placeholder="Class Name"
              value={form.className} onChange={e => set("className")(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-sm text-slate-700">Total Marks</Label>
            <Input type="number" className="h-11 rounded-xl bg-slate-50 border-slate-200"
              value={form.totalMarks} onChange={e => set("totalMarks")(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-sm text-slate-700">Duration (min)</Label>
            <Input type="number" className="h-11 rounded-xl bg-slate-50 border-slate-200"
              value={form.durationMinutes} onChange={e => set("durationMinutes")(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-sm text-slate-700">Curriculum</Label>
          <Select value={form.curriculum} onValueChange={set("curriculum")}>
            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200"><SelectValue placeholder="Select curriculum (optional)" /></SelectTrigger>
            <SelectContent>{CURRICULA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-bold text-sm text-slate-700">Instructions for students</Label>
          <Textarea className="rounded-xl bg-slate-50 border-slate-200 min-h-[100px]"
            placeholder="Provide any instructions students should see before starting..."
            value={form.instructions} onChange={e => set("instructions")(e.target.value)} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => navigate("/teacher/exams")}>Cancel</Button>
          <Button className="flex-1 rounded-xl font-bold gap-2" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save as Draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TeacherExams({ user }: Props) {
  return (
    <Routes>
      <Route path="/" element={<ExamList user={user} />} />
      <Route path="/new" element={<NewExamForm user={user} />} />
    </Routes>
  );
}
