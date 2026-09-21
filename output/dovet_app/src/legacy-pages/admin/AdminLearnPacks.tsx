import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Archive, BarChart3 } from "lucide-react";

const packs = [
  { title: "Algorithms & Programming", subject: "ICT", status: "Published", students: 28, completions: 82 },
  { title: "Significant Figures", subject: "Mathematics", status: "Draft", students: 0, completions: 0 },
  { title: "Biology Midterm Review", subject: "Biology", status: "Archived", students: 34, completions: 91 },
];

export function AdminLearnPacks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Learn Pack Library</h1>
          <p className="text-slate-500 font-medium mt-1">Overview of formative content across your school.</p>
        </div>
        <Button className="rounded-xl gap-2 font-bold">
          <Sparkles className="h-4 w-4" /> Create new pack
        </Button>
      </div>

      <div className="grid gap-4">
        {packs.map((pack) => (
          <Card key={pack.title} className="border-none shadow-sm">
            <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#eaf1ef] p-2.5">
                  <BookOpen className="h-5 w-5 text-[#3C594E]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{pack.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{pack.subject} · {pack.students} assigned students</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="border-none bg-slate-100 text-slate-600 text-xs font-bold">{pack.status}</Badge>
                <div className="text-right">
                  <div className="font-black text-slate-900">{pack.completions}%</div>
                  <div className="text-xs text-slate-400 font-medium">completion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
