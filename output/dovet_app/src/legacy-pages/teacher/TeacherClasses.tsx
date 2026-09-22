import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, FileText, ChevronRight, TrendingUp, Grid, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DovetUser } from "@/lib/types";

interface Props {
  user: DovetUser;
}

const MOCK_CLASSES = [
  { id: "1", name: "7A — ICT & Computing", year: "Year 7", subject: "ICT",       studentCount: 28, avgScore: 78, activePacks: 1, activeExams: 0, color: "bg-[#e8f9f0]", iconColor: "text-[#3C594E]" },
  { id: "2", name: "8B — Mathematics",     year: "Year 8", subject: "Mathematics",studentCount: 32, avgScore: 68, activePacks: 0, activeExams: 1, color: "bg-[#fdf3ee]", iconColor: "text-[#BF8360]" },
  { id: "3", name: "9A — Biology",          year: "Year 9", subject: "Biology",   studentCount: 30, avgScore: 81, activePacks: 2, activeExams: 0, color: "bg-[#eaf1ef]", iconColor: "text-[#3C594E]" },
  { id: "4", name: "10C — Chemistry",       year: "Year 10",subject: "Chemistry", studentCount: 26, avgScore: 63, activePacks: 0, activeExams: 1, color: "bg-[#F2F2F2]", iconColor: "text-[#3C594E]" },
];

const HEATMAP_TOPICS = [
  "Sequences",
  "Flowcharts",
  "Conditionals (IF)",
  "Loops (FOR)",
  "Trace Tables",
];

const MOCK_HEATMAP_STUDENTS = [
  { name: "Jack Sterling", scores: [94, 88, 85, 90, 78], overall: 87, grade: "A" },
  { name: "Chloe Adeyemi", scores: [90, 92, 88, 80, 84], overall: 86, grade: "A" },
  { name: "James Okonkwo", scores: [65, 58, 62, 54, 48], overall: 57, grade: "C" },
  { name: "Sofia Mensah", scores: [98, 95, 92, 96, 94], overall: 95, grade: "A+" },
  { name: "Kwame Asante", scores: [75, 72, 68, 70, 65], overall: 70, grade: "B" },
  { name: "Amara Diallo", scores: [45, 52, 48, 50, 42], overall: 47, grade: "D" },
];

function getMasteryColor(score: number) {
  if (score >= 80) return "bg-[#e8f9f0] text-[#1f6040] border-[#b2eccf]";
  if (score >= 60) return "bg-[#fdf3ee] text-[#7a4f30] border-[#e8c4a8]";
  return "bg-rose-100 text-rose-800 border-rose-200 font-black";
}

export function TeacherClasses({ user }: Props) {
  const [selectedClass, setSelectedClass] = useState("1");

  return (
    <div className="space-y-8 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Classes & Mastery</h1>
          <p className="text-slate-500 font-medium mt-1">
            Track student performance, attendance, and subtopic mastery heatmaps
          </p>
        </div>
      </div>

      {/* Class Selector Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_CLASSES.map((cls) => (
          <Card
            key={cls.id}
            onClick={() => setSelectedClass(cls.id)}
            className={cn(
              "border-none shadow-sm transition-all cursor-pointer rounded-3xl",
              selectedClass === cls.id
                ? "ring-2 ring-primary shadow-md bg-white scale-[1.02]"
                : "bg-white/80 hover:bg-white hover:shadow-md"
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("inline-flex p-2.5 rounded-2xl", cls.color)}>
                  <Users className={cn("h-5 w-5", cls.iconColor)} />
                </div>
                {selectedClass === cls.id && (
                  <Badge className="text-white border-none text-[10px] font-bold" style={{ backgroundColor: '#3C594E' }}>Active</Badge>
                )}
              </div>
              <h3 className="font-black text-slate-900 text-base leading-tight">{cls.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{cls.studentCount} students</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="font-black text-slate-900 text-base">{cls.avgScore}%</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Score</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="font-black text-slate-900 text-base">{cls.activePacks + cls.activeExams}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Active Packs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Class Topic Mastery Heatmap Matrix */}
      <Card className="border-none shadow-sm rounded-3xl bg-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Grid className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-black text-slate-900">
                Formative Subtopic Mastery Heatmap (7A — ICT)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time diagnostic matrix pinpointing student learning gaps before the midterm exam
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-md inline-block" style={{ backgroundColor: '#e8f9f0', border: '1px solid #73D99F' }} /> ≥80% Mastered</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-md inline-block" style={{ backgroundColor: '#fdf3ee', border: '1px solid #e8c4a8' }} /> 60-79% Review</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-md bg-rose-100 border border-rose-300 inline-block" /> &lt;60% At Risk</span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider">
                <th className="pb-3 px-3">Student</th>
                {HEATMAP_TOPICS.map((topic, i) => (
                  <th key={i} className="pb-3 px-3 text-center">{topic}</th>
                ))}
                <th className="pb-3 px-3 text-center">Class Avg</th>
                <th className="pb-3 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold">
              {MOCK_HEATMAP_STUDENTS.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                  {s.scores.map((sc, scIdx) => (
                    <td key={scIdx} className="py-3 px-3 text-center">
                      <span className={cn("inline-block px-2.5 py-1 rounded-xl text-xs border", getMasteryColor(sc))}>
                        {sc}%
                      </span>
                    </td>
                  ))}
                  <td className="py-3 px-3 text-center font-black text-slate-900">{s.overall}%</td>
                  <td className="py-3 px-3 text-center">
                    <Badge className="bg-slate-900 text-white border-none font-bold text-xs">{s.grade}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actionable Intervention Box */}
        <div className="p-4 rounded-2xl bg-[#fdf3ee]/70 border border-[#e8c4a8] text-xs text-[#7a4f30] flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#BF8360] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Formative Diagnostic Insight:</div>
            <p>
              3 students (<span className="font-semibold">James Okonkwo, Amara Diallo</span>) scored below 60% in <span className="font-semibold">Trace Tables</span> and <span className="font-semibold">Flowchart Branching</span>. We suggest assigning the Wednesday Targeted Review Pack.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
