import { cn } from "@/lib/utils";
import type { AssessmentMode } from "@/lib/types";
import { BookOpen, FileText } from "lucide-react";

interface ModeToggleProps {
  value: AssessmentMode;
  onChange: (mode: AssessmentMode) => void;
  className?: string;
}

const options: Array<{ value: AssessmentMode; label: string; description: string; icon: typeof BookOpen }> = [
  { value: "learn", label: "Learn", description: "Formative packs", icon: BookOpen },
  { value: "exam", label: "Exam", description: "Summative tests", icon: FileText },
];

export function ModeToggle({ value, onChange, className }: ModeToggleProps) {
  return (
    <div className={cn("inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm", className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
              active ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
