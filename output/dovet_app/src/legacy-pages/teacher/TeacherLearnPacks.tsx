import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Sparkles, BookOpen, Plus, Search, Clock,
  CheckCircle2, Eye, Send, Trash2, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CURRICULA, YEAR_GROUPS, SUBJECTS, type DovetUser, type DifficultyLevel } from "@/lib/types";
import { AssessmentModeBadge } from "@/components/AssessmentModeBadge";

interface Props { user: DovetUser; }

// Mock packs — in production these come from Supabase
const MOCK_PACKS = [
  { id: "1", title: "Algorithms & Programming", subject: "ICT", topic: "Algorithms & Programming", yearGroup: "Year 7", curriculum: "Cambridge Lower Secondary", difficulty: "Mixed", status: "published", days: 5, createdAt: "2026-07-08", assignedCount: 28 },
  { id: "2", title: "Significant Figures", subject: "Mathematics", topic: "Significant Figures", yearGroup: "Year 8", curriculum: "Cambridge Lower Secondary", difficulty: "Standard", status: "draft", days: 5, createdAt: "2026-07-06", assignedCount: 0 },
  { id: "3", title: "Forces & Motion", subject: "Physics", topic: "Newton's Laws", yearGroup: "Year 9", curriculum: "Cambridge IGCSE", difficulty: "Hard", status: "published", days: 5, createdAt: "2026-07-04", assignedCount: 32 },
];

function PackList({ user }: Props) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_PACKS.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Learn Packs</h1>
          <p className="text-slate-500 font-medium mt-1">AI-generated formative learning packs for your classes</p>
        </div>
        <Link to="/teacher/learn-packs/new">
          <Button className="gap-2 font-bold text-white shadow-sm" style={{ backgroundColor: '#3C594E' }}>
            <Sparkles className="h-4 w-4" /> Generate New Pack
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search packs..." className="pl-10 bg-white rounded-xl border-slate-200"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-black text-slate-700 text-lg">No packs yet</h3>
          <p className="text-slate-400 mb-6">Generate your first AI learn pack to get started</p>
          <Link to="/teacher/learn-packs/new">
            <Button className="gap-2 font-bold text-white shadow-sm" style={{ backgroundColor: '#3C594E' }}>
              <Sparkles className="h-4 w-4" /> Generate Pack
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(pack => (
            <Card key={pack.id} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <AssessmentModeBadge mode="learn" size="sm" />
                      <Badge variant="secondary" className={cn("text-xs font-bold border-none",
                        pack.status === "published" ? "bg-[#e8f9f0] text-[#3C594E]" : "bg-slate-100 text-slate-600"
                      )}>
                        {pack.status === "published" ? <CheckCircle2 className="h-3 w-3 mr-1 inline" /> : <Clock className="h-3 w-3 mr-1 inline" />}
                        {pack.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs border-none font-bold" style={{ backgroundColor: '#fdf3ee', color: '#BF8360' }}>
                        {pack.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight truncate">{pack.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                      {pack.subject} · {pack.yearGroup} · {pack.curriculum} · {pack.days} days
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-2 hidden sm:block">
                      <div className="font-black text-slate-900 text-lg">{pack.assignedCount}</div>
                      <div className="text-xs text-slate-400 font-medium">students</div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    {pack.status === "draft" && (
                      <Button size="sm" className="rounded-xl gap-1.5 text-white" style={{ backgroundColor: '#3C594E' }}>
                        <Send className="h-3.5 w-3.5" /> Publish
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

function NewPackForm({ user }: Props) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({
    studentName: "", subject: "", topic: "", yearGroup: "",
    curriculum: "", difficulty: "Mixed" as DifficultyLevel,
    teacherName: user.fullName,
    monday: "", tuesday: "", wednesday: "", thursday: "", friday: "",
    timerSeconds: 50, soundEffects: "on",
  });

  const handleGenerate = async () => {
    if (!form.subject || !form.topic || !form.yearGroup || !form.curriculum) {
      toast.error("Please fill in Subject, Topic, Year Group, and Curriculum");
      return;
    }
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000)); // simulate generation
    toast.success("Learn Pack generated! It has been saved as a draft.");
    setIsGenerating(false);
    navigate("/teacher/learn-packs");
  };

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link to="/teacher/learn-packs">
          <Button variant="ghost" size="sm" className="rounded-xl text-slate-500">← Back</Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" /> Generate AI Learn Pack
          </h1>
          <p className="text-slate-500 font-medium mt-1">Fill in the details and Dovet will generate a full 5-day formative learning pack</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-5 shadow-sm">
            <h3 className="font-black text-slate-900 text-base border-b pb-3">Pack Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-sm text-slate-700">Subject *</Label>
                <Select value={form.subject} onValueChange={set("subject")}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-sm text-slate-700">Year Group *</Label>
                <Select value={form.yearGroup} onValueChange={set("yearGroup")}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_GROUPS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-sm text-slate-700">Topic *</Label>
              <Input className="h-11 rounded-xl bg-slate-50 border-slate-200" placeholder="Enter topic"
                value={form.topic} onChange={e => set("topic")(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-sm text-slate-700">Curriculum *</Label>
                <Select value={form.curriculum} onValueChange={set("curriculum")}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRICULA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-sm text-slate-700">Difficulty</Label>
                <Select value={form.difficulty} onValueChange={v => setForm(f => ({ ...f, difficulty: v as DifficultyLevel }))}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Easy","Standard","Hard","Mixed"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Subtopics */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-slate-900 text-base border-b pb-3">Daily Subtopics <span className="text-slate-400 font-medium text-sm">(optional — Dovet will suggest these if left blank)</span></h3>
            {["monday","tuesday","wednesday","thursday","friday"].map(day => (
              <div key={day} className="space-y-1.5">
                <Label className="font-bold text-sm text-slate-700 capitalize">{day}</Label>
                <Input className="h-10 rounded-xl bg-slate-50 border-slate-200 text-sm"
                  placeholder={`Subtopic for ${day.charAt(0).toUpperCase() + day.slice(1)} (optional)`}
                  value={(form as any)[day]}
                  onChange={e => set(day as keyof typeof form)(e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-slate-900 text-base border-b pb-3">Quiz Settings</h3>
            <div className="space-y-2">
              <Label className="font-bold text-sm text-slate-700">Timer per question (seconds)</Label>
              <Input type="number" min={0} max={300} className="h-11 rounded-xl bg-slate-50 border-slate-200"
                value={form.timerSeconds} onChange={e => setForm(f => ({ ...f, timerSeconds: Number(e.target.value) }))} />
              <p className="text-xs text-slate-400">Set 0 to disable the timer</p>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-sm text-slate-700">Sound Effects</Label>
              <Select value={form.soundEffects} onValueChange={set("soundEffects")}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">On</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-3xl border p-5 space-y-3" style={{ backgroundColor: '#eaf1ef', borderColor: '#c8dcd5' }}>
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#3C594E' }} />
              <div>
                <h4 className="font-black text-sm" style={{ color: '#2a3f38' }}>What gets generated</h4>
                <ul className="text-xs mt-2 space-y-1" style={{ color: '#3C594E' }}>
                  <li>✅ 5-day question bank (.docx)</li>
                  <li>✅ 5 interactive HTML quizzes</li>
                  <li>✅ 28 questions per day</li>
                  <li>✅ Hints, solutions & step-by-step explanations</li>
                  <li>✅ Results flow back to this dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <Button className="w-full h-12 rounded-2xl font-black gap-2 text-base text-white shadow-sm"
            style={{ backgroundColor: '#3C594E' }}
            onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><Sparkles className="h-5 w-5" /> Generate Pack</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TeacherLearnPacks({ user }: Props) {
  return (
    <Routes>
      <Route path="/" element={<PackList user={user} />} />
      <Route path="/new" element={<NewPackForm user={user} />} />
    </Routes>
  );
}
