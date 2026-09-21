import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, BookOpen, FileText, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DovetUser } from "@/lib/types";

interface Props { user: DovetUser; }

const WEAK_TOPICS = [
  { topic: "Boolean Logic in Conditions", subject: "ICT", class: "Year 7 7A", avgScore: 42, students: 14 },
  { topic: "Solving Quadratic Equations", subject: "Mathematics", class: "Year 8 8B", avgScore: 38, students: 19 },
  { topic: "Cell Division — Meiosis", subject: "Biology", class: "Year 9 9A", avgScore: 51, students: 9 },
];

const STUDENT_PERFORMANCE = [
  { name: "Sofia Mensah",    learnAvg: 95, examAvg: 91, trend: "up",   grade: "A+" },
  { name: "Chloe Adeyemi",   learnAvg: 88, examAvg: 74, trend: "up",   grade: "A"  },
  { name: "Kwame Asante",    learnAvg: 70, examAvg: 66, trend: "flat", grade: "B"  },
  { name: "James Okonkwo",   learnAvg: 62, examAvg: 55, trend: "down", grade: "C"  },
  { name: "Amara Diallo",    learnAvg: 45, examAvg: 52, trend: "up",   grade: "D"  },
];

const gradeColor: Record<string, string> = {
  "A+": "text-white",    "A": "text-white",
  "B":  "text-white",    "C": "text-[#0D0D0D]",
  "D":  "text-[#0D0D0D]",
};
const gradeBg: Record<string, string> = {
  "A+": "#3C594E", "A": "#5a8a78",
  "B":  "#73D99F", "C": "#BF8360",
  "D":  "#e8c4a8",
};

export function TeacherAnalytics({ user }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" /> Analytics
        </h1>
        <p className="text-slate-500 font-medium mt-1">Performance insights across Learn Packs and Exams</p>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Learn Pack Avg", value: "74%", sub: "across all packs",       icon: BookOpen,    color: "text-[#3C594E]", bg: "bg-[#eaf1ef]", trend: "+3%", up: true },
          { label: "Exam Avg",       value: "68%", sub: "across all exams",       icon: FileText,    color: "text-[#BF8360]", bg: "bg-[#fdf3ee]", trend: "+1%", up: true },
          { label: "Completion Rate",value: "89%", sub: "packs completed on time",icon: Users,       color: "text-[#3C594E]", bg: "bg-[#e8f9f0]", trend: "-2%", up: false },
          { label: "Students at Risk",value: "5", sub: "scoring below 50%",       icon: AlertTriangle,color: "text-red-500",  bg: "bg-red-50",    trend: "",    up: false },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2.5 rounded-xl", s.bg)}>
                  <s.icon className={cn("h-5 w-5", s.color)} />
                </div>
                {s.trend && (
                  <span className={cn("text-xs font-bold flex items-center gap-0.5", s.up ? "text-[#3C594E]" : "text-red-500")}>
                    {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {s.trend}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weak topics */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#BF8360]" /> Topics Needing Attention
            </CardTitle>
            <p className="text-sm text-slate-500 font-medium">Topics where class average is below 55%</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {WEAK_TOPICS.map((t, i) => (
              <div key={i} className="p-4 bg-[#fdf3ee] rounded-2xl border border-[#e8c4a8]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 text-sm leading-tight">{t.topic}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{t.subject} · {t.class}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-[#BF8360] text-lg">{t.avgScore}%</div>
                    <div className="text-xs text-slate-400">{t.students} students</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="bg-[#e8c4a8]/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#BF8360] h-full rounded-full" style={{ width: `${t.avgScore}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student performance table */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-black text-slate-900">Student Performance</CardTitle>
            <p className="text-sm text-slate-500 font-medium">Combined Learn + Exam averages</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {STUDENT_PERFORMANCE.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-900 text-sm truncate">{s.name}</div>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs font-bold" style={{ color: '#3C594E' }}>Learn: {s.learnAvg}%</span>
                    <span className="text-xs font-bold" style={{ color: '#BF8360' }}>Exam: {s.examAvg}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.trend === "up" && <TrendingUp className="h-4 w-4" style={{ color: '#3C594E' }} />}
                  {s.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                  <span className={cn("text-xs font-black px-2 py-0.5 rounded-lg", gradeColor[s.grade] || "bg-slate-100 text-slate-600")} style={{ backgroundColor: gradeBg[s.grade] || '#e9e9e9' }}>
                    {s.grade}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
