import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentMode } from "@/lib/types";

interface AssessmentCardProps {
  title: string;
  subtitle?: string;
  mode: AssessmentMode;
  status?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function AssessmentCard({
  title,
  subtitle,
  mode,
  status,
  actionLabel = "Open",
  onAction,
  className,
}: AssessmentCardProps) {
  const isLearn = mode === "learn";

  return (
    <Card className={cn("border-none shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-2xl p-2.5", isLearn ? "bg-[#eaf1ef]" : "bg-[#fdf3ee]")}>
              {isLearn ? <BookOpen className={cn("h-5 w-5", "text-[#3C594E]")} /> : <FileText className="h-5 w-5 text-[#BF8360]" />}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight">{title}</h3>
              {subtitle ? <p className="text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p> : null}
            </div>
          </div>
          {status ? <Badge className={cn("border-none text-xs font-bold", isLearn ? "bg-[#e8f9f0] text-[#3C594E]" : "bg-[#fdf3ee] text-[#BF8360]")}>{status}</Badge> : null}
        </div>
        <div className="mt-4 flex items-center justify-end">
          <Button size="sm" onClick={onAction} className={cn("rounded-xl font-bold gap-1.5 text-white", isLearn ? "bg-[#3C594E] hover:bg-[#2e4339]" : "bg-[#BF8360] hover:bg-[#a8714f]")}> 
            {actionLabel} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
