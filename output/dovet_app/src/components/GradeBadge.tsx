import { cn } from "@/lib/utils";
import type { GradeResult } from "@/lib/types";

interface Props {
  grade: GradeResult;
  score?: string;
  className?: string;
}

const gradeConfig: Record<GradeResult, { bg: string; text: string; label: string }> = {
  "A+": { bg: "bg-[#3C594E]", text: "text-white", label: "Outstanding" },
  "A":  { bg: "bg-[#73D99F]", text: "text-[#0D0D0D]", label: "Excellent" },
  "B":  { bg: "bg-[#5a8a78]", text: "text-white", label: "Good" },
  "C":  { bg: "bg-[#BF8360]", text: "text-white", label: "Satisfactory" },
  "D":  { bg: "bg-[#a8714f]", text: "text-white", label: "Needs Work" },
  "F":  { bg: "bg-[#0D0D0D]", text: "text-white", label: "Below Pass" },
};

export function GradeBadge({ grade, score, className }: Props) {
  const cfg = gradeConfig[grade];
  return (
    <div className={cn("inline-flex flex-col items-center justify-center rounded-2xl px-4 py-2 min-w-[64px]", cfg.bg, cfg.text, className)}>
      <span className="text-2xl font-extrabold leading-none">{grade}</span>
      {score && <span className="text-xs opacity-90 mt-0.5 font-medium">{score}</span>}
      <span className="text-xs opacity-75 mt-0.5">{cfg.label}</span>
    </div>
  );
}
