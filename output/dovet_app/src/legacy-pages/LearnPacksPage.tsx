import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssessmentCard } from "@/components/AssessmentCard";
import { ModeToggle } from "@/components/ModeToggle";
import { supabase } from "@/integrations/supabase/client";

const samplePacks = [
  {
    title: "Algorithms & Programming",
    subtitle: "Year 7 · Cambridge Lower Secondary",
    mode: "learn" as const,
    status: "Live",
    path: "/player/learn/algorithms-programming",
  },
  {
    title: "Significant Figures",
    subtitle: "Year 8 · Mathematics",
    mode: "learn" as const,
    status: "New",
    path: "/player/learn/significant-figures",
  },
  {
    title: "Biology Midterm Review",
    subtitle: "Year 9 · Exam prep",
    mode: "exam" as const,
    status: "Ready",
    path: "/player/exam/biology-midterm",
  },
];

interface LearnPackCard {
  title: string;
  subtitle: string;
  mode: "learn" | "exam";
  status: string;
  path: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LearnPacksPage() {
  const [mode, setMode] = useState<"learn" | "exam">("learn");
  const [packs, setPacks] = useState<LearnPackCard[]>(samplePacks);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPacks = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("learn_packs")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(6);

      if (!error && Array.isArray(data) && data.length > 0) {
        setPacks(
          data.map((pack: any) => {
            const title = pack.title || "Untitled pack";
            const subject = pack.subject || "General";
            const yearGroup = pack.yearGroup || pack.year_group || "Year 7";
            const status = pack.status || "Live";
            const modeValue = pack.mode === "exam" ? "exam" : "learn";

            return {
              title,
              subtitle: `${subject} · ${yearGroup}`,
              mode: modeValue,
              status,
              path: `/player/${modeValue}/${slugify(title)}`,
            };
          })
        );
      }
      setIsLoading(false);
    };

    loadPacks();
  }, []);

  const visiblePacks = packs.filter((pack) => pack.mode === mode);

  return (
    <div className="min-h-screen bg-[#F2F2F2] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: '#eaf1ef', color: '#3C594E' }}>
              <Sparkles className="h-4 w-4" /> Guided learning hub
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Explore Dovet Learn Packs</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Move from guided practice to mastery with AI-generated packs and tutor-style feedback.
            </p>
          </div>
          <Link to="/signup">
            <Button className="rounded-xl font-bold">Create a school account</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {samplePacks.map((pack) => (
            <AssessmentCard
              key={pack.title}
              title={pack.title}
              subtitle={pack.subtitle}
              mode={pack.mode}
              status={pack.status}
              actionLabel="Try it"
              onAction={() => window.location.assign(pack.path)}
            />
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Why schools love Dovet</h2>
                <p className="text-sm text-slate-500">Formative practice, exam readiness, and parent visibility in one place.</p>
              </div>
            </div>
            <ModeToggle value={mode} onChange={setMode} />
          </div>
          <div className="mt-6">
            <p className="text-sm text-slate-600">Showing the {mode === "learn" ? "guided practice" : "summative assessment"} experience for schools.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Adaptive practice",
              "Hints and explanations",
              "Real-time analytics",
              "Read-only parent insight",
            ].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Link to="/player/learn/demo" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open demo quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
