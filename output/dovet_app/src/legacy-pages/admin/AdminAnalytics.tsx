import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, FileText, TrendingUp } from "lucide-react";

const metrics = [
  { label: "Learn Pack Avg", value: "78%", icon: BookOpen, color: "text-[#3C594E]", bg: "bg-[#eaf1ef]" },
  { label: "Exam Avg", value: "72%", icon: FileText, color: "text-[#BF8360]", bg: "bg-[#fdf3ee]" },
  { label: "Completion Rate", value: "89%", icon: TrendingUp, color: "text-[#3C594E]", bg: "bg-[#e8f9f0]" },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">School Analytics</h1>
        <p className="text-slate-500 font-medium mt-1">Performance snapshots for both Learn and Exam modes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex rounded-2xl p-2.5 ${metric.bg}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
              <p className="text-3xl font-black text-slate-900">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-black text-slate-900">
            <BarChart3 className="h-5 w-5 text-primary" /> School performance overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>Teachers have published 8 learn packs and 3 exams this term.</p>
          <p>Students are showing stronger engagement in learn mode than in exam mode, suggesting a need for more guided review before major assessments.</p>
        </CardContent>
      </Card>
    </div>
  );
}
