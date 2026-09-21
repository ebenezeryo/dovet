import { BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentMode } from "@/lib/types";

interface Props {
  mode: AssessmentMode;
  size?: "sm" | "md";
  className?: string;
}

export function AssessmentModeBadge({ mode, size = "md", className }: Props) {
  const isLearn = mode === "learn";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        isLearn
          ? "bg-[#e8f9f0] text-[#3C594E]"
          : "bg-[#fdf3ee] text-[#BF8360]",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className
      )}
    >
      {isLearn ? (
        <BookOpen className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      ) : (
        <BarChart3 className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      )}
      {isLearn ? "Learn Pack" : "Exam"}
    </span>
  );
}
