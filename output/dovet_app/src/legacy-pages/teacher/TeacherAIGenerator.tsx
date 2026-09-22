import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  BookOpen,
  CheckCircle2,
  Send,
  Eye,
  Edit3,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { CURRICULA, SUBJECTS, YEAR_GROUPS, type DovetUser, type LearnPack } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface Props {
  user: DovetUser;
}

export function TeacherAIGenerator({ user }: Props) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPack, setGeneratedPack] = useState<LearnPack | null>(null);

  const [form, setForm] = useState({
    subject: "ICT / Computer Science",
    topic: "Algorithms & Flowcharts",
    yearGroup: "Year 7",
    curriculum: "Cambridge Lower Secondary",
    difficulty: "Standard",
    tone: "supportive",
    questionsPerPack: "20",
    timerSeconds: "60",
    validityDays: "7",
    notes: "Focus on sequence, selection (IF/ELSE), and flowchart symbols with relatable everyday examples.",
  });

  const setField = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = async () => {
    if (!form.subject || !form.topic || !form.yearGroup || !form.curriculum) {
      toast.error("Please complete subject, topic, year group, and curriculum.");
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const todayStr = new Date().toISOString().split("T")[0];
    const due = new Date();
    due.setDate(due.getDate() + 7);
    const dueDateStr = due.toISOString().split("T")[0];

    const newPack: LearnPack = {
      id: `pack-${Date.now()}`,
      title: `${form.topic} Weekly Practice Pack`,
      subject: form.subject,
      topic: form.topic,
      yearGroup: form.yearGroup,
      curriculum: form.curriculum,
      difficulty: form.difficulty as any,
      teacherName: user.fullName,
      agencyName: user.schoolName,
      weekNumber: 4,
      term: "Term 1",
      createdAt: todayStr,
      publishedAt: todayStr,
      dueDate: dueDateStr,
      durationDays: 7,
      daysRemaining: 7,
      status: "draft",
      completionStatus: "active",
      questionCount: parseInt(form.questionsPerPack) || 20,
      questions: [
        {
          text: "What is an algorithm in computer science?",
          hint: "Think about an unambiguous recipe or guide.",
          opts: [
            "A programming language like Python",
            "A step-by-step set of precise instructions to solve a problem",
            "A computer hardware component",
            "An error found in code",
          ],
          correct: 1,
          why: "An algorithm is an unambiguous, step-by-step procedure designed to perform a specific task or solve a defined problem.",
          steps: [
            "Step 1: Understand problem requirements.",
            "Step 2: Follow sequential instructions to conclusion.",
          ],
          isExample: true,
          exNum: 1,
          clTopic: "Foundations",
          clIdx: 0,
        },
        {
          text: "Which flowchart shape universally represents a Decision / Condition (IF / ELSE)?",
          hint: "Has multiple output branches (True/False).",
          opts: ["Rectangle", "Diamond", "Oval / Terminator", "Parallelogram"],
          correct: 1,
          why: "In standard flowchart notation, a Diamond represents a decision with two or more output branches.",
          steps: ["Step 1: Oval = Start/End.", "Step 2: Diamond = Decision condition."],
          isExample: false,
          exNum: 0,
          clTopic: "Flowcharts",
          clIdx: 1,
        },
        {
          text: "What does a parallelogram represent in a flowchart?",
          hint: "Think about user typing or screen printing.",
          opts: ["Input or Output operation", "Start of the program", "Decision condition", "Loop counter"],
          correct: 0,
          why: "A parallelogram is used whenever data is entered (input) or displayed (output).",
          steps: ["Step 1: Parallelograms indicate data entering or leaving the system."],
          isExample: false,
          exNum: 0,
          clTopic: "Flowcharts",
          clIdx: 2,
        },
        {
          text: "Why must instructions in an algorithm be unambiguous?",
          hint: "Computers do not guess what you mean.",
          opts: [
            "To make the code look longer",
            "Because computers follow commands literally without guessing intent",
            "To increase computer memory usage",
            "To prevent humans from reading them",
          ],
          correct: 1,
          why: "Computers lack human intuition and execute instructions strictly as written; any ambiguity causes unexpected behavior.",
          steps: ["Step 1: Computers execute literally.", "Step 2: Unambiguous instructions guarantee reliability."],
          isExample: false,
          exNum: 0,
          clTopic: "Foundations",
          clIdx: 3,
        },
      ],
    };

    setGeneratedPack(newPack);
    setIsGenerating(false);
    toast.success(`Weekly ${form.subject} pack generated with 7-day validity window!`);
  };

  const handlePublishPack = () => {
    if (!generatedPack) return;
    toast.success(`Weekly ${generatedPack.subject} pack published! Students will receive a 7-day reminder.`);
    navigate("/teacher/learn-packs");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-400">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-slate-900">AI Weekly Pack Generator</h1>
          <Badge className="border-none font-bold text-xs" style={{ backgroundColor: '#e8f9f0', color: '#3C594E' }}>
            7-Day Subject Model
          </Badge>
        </div>
        <p className="text-slate-500 font-medium mt-1">
          Create 1 weekly learning pack per subject with a 7-day rolling deadline and automated student reminders.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Column */}
        <Card className="border-none shadow-sm rounded-3xl bg-white p-6 space-y-5 lg:col-span-1">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Pack Parameters
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-medium">
              1 pack per subject per week
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Subject</Label>
              <Select value={form.subject} onValueChange={(v) => setField("subject", v)}>
                <SelectTrigger className="rounded-xl h-11 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Topic / Focus Unit</Label>
              <Input
                value={form.topic}
                onChange={(e) => setField("topic", e.target.value)}
                placeholder="Enter topic or focus unit"
                className="rounded-xl h-11 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Year Group</Label>
                <Select value={form.yearGroup} onValueChange={(v) => setField("yearGroup", v)}>
                  <SelectTrigger className="rounded-xl h-11 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {YEAR_GROUPS.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setField("difficulty", v)}>
                  <SelectTrigger className="rounded-xl h-11 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Curriculum</Label>
              <Select value={form.curriculum} onValueChange={(v) => setField("curriculum", v)}>
                <SelectTrigger className="rounded-xl h-11 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CURRICULA.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3.5 rounded-2xl text-xs space-y-1" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5', color: '#2a3f38' }}>
              <div className="font-bold flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" style={{ color: '#3C594E' }} /> 7-Day Rolling Validity
              </div>
              <p className="text-[11px] leading-relaxed">
                When published, students will have 7 full days to complete this pack. Automated reminder alerts will fire 48 hours and 24 hours before expiration.
              </p>
            </div>

            <Button
              className="w-full h-12 rounded-2xl font-bold text-white shadow-sm gap-2"
              style={{ backgroundColor: '#3C594E' }}
              onClick={handleGenerate}
              disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating Weekly Pack...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Subject Pack 🚀
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Generated Pack Review Column */}
        <div className="lg:col-span-2 space-y-4">
          {!generatedPack ? (
            <Card className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-white/50 flex flex-col items-center justify-center min-h-[460px]">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Ready to Generate Weekly Pack</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mt-1">
                Select your subject and topic on the left to create a weekly formative module with solved examples, hints, and step-by-step reasoning.
              </p>
            </Card>
          ) : (
            <Card className="border-none shadow-sm rounded-3xl bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-none font-bold text-xs">
                      {generatedPack.subject}
                    </Badge>
                    <Badge className="border-none font-bold text-xs" style={{ backgroundColor: '#eaf1ef', color: '#3C594E' }}>
                      7-Day Validity
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{generatedPack.title}</h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {generatedPack.yearGroup} · {generatedPack.curriculum} · {generatedPack.questionCount} Questions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePublishPack}
                    className="rounded-2xl font-bold text-white shadow-md gap-2 h-11 px-5"
                    style={{ backgroundColor: '#3C594E' }}
                  >
                    <Send className="h-4 w-4" /> Publish to Class
                  </Button>
                </div>
              </div>

              {/* Questions Review */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">
                      Weekly Focus Topic
                    </div>
                    <div className="text-base font-black text-slate-900">
                      {generatedPack.topic}
                    </div>
                  </div>
                  <Badge className="bg-slate-200 text-slate-700 border-none font-bold text-xs">
                    {generatedPack.questionCount} Questions
                  </Badge>
                </div>

                <div className="space-y-3">
                  {generatedPack.questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {q.isExample ? "⭐ Solved Walkthrough Example" : `Practice Question ${idx + 1}`}
                        </span>
                        {q.isExample && (
                          <Badge className="bg-[#fdf3ee] text-[#BF8360] border-none text-[10px] font-bold">
                            Walkthrough
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-slate-800 text-sm">{q.text}</p>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {q.opts.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl font-medium text-xs ${
                              oIdx === q.correct
                                ? "font-bold border"
                                : "bg-white text-slate-600 border border-slate-100"
                            }`}
                            style={oIdx === q.correct ? { backgroundColor: '#e8f9f0', color: '#1f6040', borderColor: '#b2eccf' } : {}}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl text-xs space-y-1" style={{ backgroundColor: '#eaf1ef', border: '1px solid #c8dcd5', color: '#2a3f38' }}>
                        <div className="font-bold">Explanation & Steps:</div>
                        <p>{q.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
