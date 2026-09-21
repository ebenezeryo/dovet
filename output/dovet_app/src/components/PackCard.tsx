import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearnPack } from "@/lib/types";

interface PackCardProps {
  pack: LearnPack;
  onOpen?: () => void;
  className?: string;
}

export function PackCard({ pack, onOpen, className }: PackCardProps) {
  return (
    <Card className={cn("border-none shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eaf1ef] p-2.5">
                <BookOpen className="h-5 w-5 text-[#3C594E]" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base leading-tight">{pack.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-0.5">{pack.subject} · {pack.yearGroup}</p>
              </div>
            </div>
            <Badge className="border-none bg-slate-100 text-slate-600 text-xs font-bold">
              {pack.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {pack.days.slice(0, 3).map((day) => (
              <span key={day.day} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">
                {day.day}
              </span>
            ))}
            {pack.days.length > 3 ? <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">+{pack.days.length - 3} more</span> : null}
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {pack.days.length} days</span>
            <span>{pack.curriculum}</span>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={onOpen} className="rounded-xl text-white font-bold gap-1.5" style={{ backgroundColor: '#3C594E' }}>
              Open <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
