import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Sparkles } from "lucide-react";

export function StudentProgress() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Progress</h1>
        <p className="text-slate-500 font-medium mt-1">See how your learning and exam confidence are growing over time.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Learning momentum</h3>
              <p className="text-sm text-slate-500">Your consistency is improving. Keep going and your next exam should feel far more manageable.</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Learn mode completion is up 14% compared with last month, and your exam readiness score now sits at 76%.
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl p-2.5" style={{ backgroundColor: '#eaf1ef', color: '#3C594E' }}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Next recommended action</h3>
              <p className="text-sm text-slate-500">Try the next pack in your queue to strengthen the topics you missed in your last assessment.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
