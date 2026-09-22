import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  BookOpen,
  Send,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { CURRICULA, SUBJECTS, YEAR_GROUPS, type DovetUser, type LearnPack, type LearnQuestion } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { addLearnPack, updateLearnPack } from "@/lib/learn-pack-store";
import { createLearnPack, generateAiLearnPack, isLearnPackServiceUnavailable, setLearnPackStatus } from "@/lib/learn-pack-api";
import { useAuth } from "@/lib/auth-context";

interface Props {
  user: DovetUser;
}

type QuestionDraft = Omit<LearnQuestion, "isExample" | "exNum" | "clTopic" | "clIdx">;

function buildQuestion(question: QuestionDraft, index: number, topic: string): LearnQuestion {
  return {
    ...question,
    isExample: index === 0,
    exNum: index === 0 ? 1 : 0,
    clTopic: topic,
    clIdx: (index % 4) as 0 | 1 | 2 | 3,
  };
}

function buildChemistrySeparationQuestions(topic: string): LearnQuestion[] {
  const questions: QuestionDraft[] = [
    { text: "Which technique separates an insoluble solid such as sand from water?", hint: "The solid does not dissolve.", opts: ["Filtration", "Distillation", "Chromatography", "Evaporation"], correct: 0, why: "Filtration traps an insoluble solid in filter paper while the liquid passes through.", steps: ["Choose filtration for an insoluble solid and a liquid."] },
    { text: "What is the liquid that passes through filter paper called?", hint: "It is collected underneath the funnel.", opts: ["Residue", "Filtrate", "Solute", "Solvent"], correct: 1, why: "The filtrate is the liquid that passes through the filter paper.", steps: ["Residue stays in the paper; filtrate passes through it."] },
    { text: "Which method obtains salt from a salt-water solution?", hint: "Remove the water, leaving the dissolved solid behind.", opts: ["Evaporation", "Filtration", "Decanting", "Magnetism"], correct: 0, why: "Evaporation removes the water and leaves salt crystals behind.", steps: ["Heat the solution.", "Allow the water to evaporate."] },
    { text: "Why is simple distillation suitable for obtaining pure water from seawater?", hint: "One part evaporates and is then cooled.", opts: ["Salt is magnetic", "Water can be evaporated then condensed", "Sand dissolves", "The filter paper makes water pure"], correct: 1, why: "Water evaporates at a lower temperature than salt and can be condensed into pure water.", steps: ["Evaporate water.", "Condense the vapour."] },
    { text: "What property allows paper chromatography to separate ink dyes?", hint: "Different dyes move different distances.", opts: ["Their different solubilities", "Their magnetism", "Their mass only", "Their boiling points only"], correct: 0, why: "Dyes dissolve and travel at different rates because they have different solubilities and attractions to the paper.", steps: ["Place the sample above the solvent.", "Compare how far the dyes travel."] },
    { text: "Which mixture is best separated with a magnet?", hint: "One material must be magnetic.", opts: ["Iron filings and sulfur", "Salt and water", "Oil and water", "Blue and red ink"], correct: 0, why: "Iron is magnetic, while sulfur is not, so a magnet can remove the iron filings.", steps: ["Bring a magnet close to the mixture.", "Collect the attracted iron filings."] },
    { text: "Which apparatus is essential when filtering a mixture?", hint: "It holds back the insoluble solid.", opts: ["Filter paper", "Condenser", "Bunsen burner only", "Chromatography paper only"], correct: 0, why: "Filter paper has tiny pores that allow liquid through but retain insoluble particles.", steps: ["Fold filter paper into a funnel.", "Pour the mixture through it."] },
    { text: "In chromatography, why must the solvent level start below the ink spot?", hint: "The sample needs to travel with the solvent, not dissolve into the starting pool.", opts: ["To prevent the ink dissolving directly into the solvent", "To make the paper heavier", "To stop evaporation", "To make dyes magnetic"], correct: 0, why: "If the spot starts below the solvent level, the sample dissolves into the solvent instead of separating up the paper.", steps: ["Draw the baseline in pencil.", "Keep the solvent below that line."] },
    { text: "What is the residue in a filtration experiment?", hint: "It is the material left behind.", opts: ["The solid left on the filter paper", "The liquid collected in the beaker", "The water vapour", "The dissolved solid"], correct: 0, why: "The residue is the insoluble solid retained by the filter paper.", steps: ["Identify what remains on the filter paper."] },
    { text: "Which technique is most suitable for separating oil and water?", hint: "The liquids form separate layers.", opts: ["A separating funnel", "Filtration", "Chromatography", "Evaporation to dryness"], correct: 0, why: "Oil and water are immiscible, so a separating funnel lets the denser water layer drain first.", steps: ["Allow the layers to settle.", "Drain the lower layer carefully."] },
  ];

  return [...questions, ...questions.map((question, index) => buildQuestion({
    ...question,
    text: `For a ${topic} investigation: ${question.text}`,
  }, index + questions.length, topic))].map((question, index) =>
    "isExample" in question ? question : buildQuestion(question, index, topic)
  );
}

function buildTopicQuestions(subject: string, topic: string, count: number): LearnQuestion[] {
  if (/chemistry/i.test(subject) && /separat|filtrat|distill|chromatograph|mixture/i.test(topic)) {
    return buildChemistrySeparationQuestions(topic).slice(0, count);
  }

  const stems = [
    ["What is the best description of", `A clear explanation of ${topic}`, "An unrelated fact", "A piece of equipment only", "A random guess"],
    ["Which example best applies", `${topic} in a familiar context`, "Ignoring the topic", "Changing to another subject", "Using no evidence"],
    ["Why is it useful to check your understanding of", `It helps you apply ${topic} accurately`, "It makes the work longer", "It removes the need to learn", "It guarantees every answer is correct"],
    ["What should you do first when solving a problem about", `Identify the important information about ${topic}`, "Choose an answer at random", "Skip the question", "Copy an unrelated example"],
  ] as const;

  return Array.from({ length: count }, (_, index) => {
    const [starter, correctAnswer, ...distractors] = stems[index % stems.length];
    return buildQuestion({
      text: `${starter} ${topic}?`,
      hint: `Use the key ideas from ${topic}.`,
      opts: [correctAnswer, ...distractors],
      correct: 0,
      why: `The correct choice uses the central ideas of ${topic} in ${subject}.`,
      steps: [`Read the question carefully.`, `Connect the evidence to ${topic}.`],
    }, index, topic);
  });
}

export function TeacherAIGenerator({ user }: Props) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPack, setGeneratedPack] = useState<LearnPack | null>(null);

  const [form, setForm] = useState({
    subject: "",
    topic: "",
    yearGroup: "",
    curriculum: "Cambridge Lower Secondary",
    difficulty: "Standard",
    tone: "supportive",
    questionsPerPack: "20",
    timerSeconds: "60",
    validityDays: "7",
    notes: "",
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

    let questions: LearnQuestion[];
    try {
      questions = !token || token.startsWith("demo-token-")
        ? buildTopicQuestions(form.subject, form.topic, parseInt(form.questionsPerPack) || 20)
        : await generateAiLearnPack(token, {
          subject: form.subject, topic: form.topic, yearGroup: form.yearGroup, curriculum: form.curriculum,
          difficulty: form.difficulty, questionCount: parseInt(form.questionsPerPack) || 20, notes: form.notes,
        });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate learning-pack questions.");
      setIsGenerating(false);
      return;
    }

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
      questions,
    };

    setGeneratedPack(newPack);
    const packSummary = {
      id: newPack.id,
      title: newPack.title,
      subject: newPack.subject,
      topic: newPack.topic,
      yearGroup: newPack.yearGroup,
      curriculum: newPack.curriculum,
      difficulty: newPack.difficulty,
      status: "draft",
      days: 7,
      createdAt: newPack.createdAt,
      assignedCount: 0,
      completions: 0,
      questions: newPack.questions,
    };
    try {
      if (!token || token.startsWith("demo-token-")) {
        addLearnPack(packSummary);
      } else {
        const savedPack = await createLearnPack(token, packSummary, {
          timerSeconds: Number(form.timerSeconds) || 0,
          validityDays: Number(form.validityDays) || 7,
          notes: form.notes,
          questionsPerPack: Number(form.questionsPerPack) || 20,
          questions: newPack.questions,
        });
        setGeneratedPack({ ...newPack, id: savedPack.id });
      }
      toast.success(`Weekly ${form.subject} pack generated and saved as a draft.`);
    } catch (error) {
      if (isLearnPackServiceUnavailable(error)) {
        addLearnPack(packSummary);
        toast.warning("Learning-pack service is unavailable. The draft was saved locally on this device.");
      } else {
        setGeneratedPack(null);
        toast.error(error instanceof Error ? error.message : "Could not save the learning pack.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishPack = async () => {
    if (!generatedPack) return;
    try {
      if (!token || token.startsWith("demo-token-")) {
        updateLearnPack(generatedPack.id, { status: "published" });
      } else {
        await setLearnPackStatus(token, generatedPack.id, "published");
      }
      toast.success(`Weekly ${generatedPack.subject} pack published! Students will receive a 7-day reminder.`);
      navigate("/teacher/learn-packs");
    } catch (error) {
      if (isLearnPackServiceUnavailable(error)) {
        updateLearnPack(generatedPack.id, { status: "published" });
        toast.warning("Learning-pack service is unavailable. The publish status was saved locally.");
      } else {
        toast.error(error instanceof Error ? error.message : "Could not publish the learning pack.");
      }
    }
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
