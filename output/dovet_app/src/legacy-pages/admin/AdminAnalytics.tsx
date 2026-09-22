import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, FileText, TrendingUp } from "lucide-react";
import { getLearnPacks } from "@/lib/learn-pack-store";

export function AdminAnalytics() {
  const packs = getLearnPacks();
  const publishedPacks = packs.filter((pack) => pack.status === "published");
  const metrics = [
    { label: "Published packs", value: String(publishedPacks.length), icon: BookOpen, color: "text-[#3C594E]", bg: "bg-[#eaf1ef]" },
    { label: "Draft packs", value: String(packs.filter((pack) => pack.status === "draft").length), icon: FileText, color: "text-[#BF8360]", bg: "bg-[#fdf3ee]" },
    { label: "Assigned students", value: String(publishedPacks.reduce((sum, pack) => sum + pack.assignedCount, 0)), icon: TrendingUp, color: "text-[#3C594E]", bg: "bg-[#e8f9f0]" },
  ];
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
          <p>Analytics will populate as students complete published packs and submit assessments.</p>
        </CardContent>
      </Card>
    </div>
  );
}
