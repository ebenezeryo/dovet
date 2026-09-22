import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Clock,
  HelpCircle,
  Flame,
  ArrowLeft,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import type { AssessmentMode, GradeResult, LearnQuestion } from "@/lib/types";
import { getAllQuestionsForPack, getPackById } from "@/lib/learn-packs-data";
import { sound } from "@/lib/audio";
import { GradeBadge } from "@/components/GradeBadge";

interface QuizPlayerProps {
  packId?: string;
  mode?: AssessmentMode;
}

function computeGrade(pct: number): GradeResult {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export function QuizPlayer({ packId = "pack-ict-w4", mode = "learn" }: QuizPlayerProps) {
  const navigate = useNavigate();
  const pack = useMemo(() => getPackById(packId), [packId]);
  const questions: LearnQuestion[] = useMemo(() => getAllQuestionsForPack(packId), [packId]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);

  // Question log for final review
  const [answersLog, setAnswersLog] = useState<
    Array<{ q: LearnQuestion; chosen: number | null; isCorrect: boolean }>
  >([]);

  const currentQ: LearnQuestion | undefined = questions[step];

  if (!pack || !currentQ) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="text-2xl font-black text-slate-900">This learning pack is unavailable</h1>
        <p className="mt-2 text-slate-500">Ask your teacher to generate and publish the pack again.</p>
        <Button className="mt-6 rounded-xl" onClick={() => navigate("/student")}>Return to dashboard</Button>
      </div>
    );
  }

  // Timer logic (only active on practice questions, not on walkthroughs, and not when explanation is showing)
  useEffect(() => {
    if (!currentQ || currentQ.isExample || showExplanation || !timerActive) return;

    setTimeLeft(60);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        if (prev <= 6 && !isMuted) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, showExplanation, timerActive, currentQ]);

  const handleTimeOut = () => {
    if (!currentQ) return;
    sound.playIncorrect();
    setSelected(-1);
    setShowExplanation(true);
    setAnswersLog((prev) => [...prev, { q: currentQ, chosen: -1, isCorrect: false }]);
  };

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelected(index);
  };

  const handleSubmitAnswer = () => {
    if (selected === null || !currentQ) return;

    const isCorrect = selected === currentQ.correct;
    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
    } else {
      sound.playIncorrect();
    }

    setAnswersLog((prev) => [...prev, { q: currentQ, chosen: selected, isCorrect }]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (step >= questions.length - 1) {
      sound.playFanfare();
      setStep(questions.length);
      return;
    }
    setStep((prev) => prev + 1);
    setSelected(null);
    setShowExplanation(false);
    setShowHint(false);
    setTimeLeft(60);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.isMuted = nextMuted;
  };

  const restartQuiz = () => {
    setStep(0);
    setSelected(null);
    setShowExplanation(false);
    setShowHint(false);
    setScore(0);
    setAnswersLog([]);
    setTimeLeft(60);
  };

  // Completion Screen
  if (step >= questions.length || !currentQ) {
    const finalPct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const finalGrade = computeGrade(finalPct);

    return (
      <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-400">
        <Card className="border-none shadow-2xl rounded-3xl bg-white overflow-hidden text-center p-8 sm:p-12 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e8f9f0] text-[#3C594E] shadow-inner">
            <Trophy className="h-10 w-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-[#e8f9f0] text-[#3C594E] border-none font-bold text-xs">
              Weekly Pack Completed! 🎉
            </Badge>
            <h2 className="text-3xl font-black text-slate-900">
              {pack?.subject || "Subject"} Pack Complete!
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              You submitted your weekly practice pack for <span className="text-primary font-bold">{pack?.title}</span>.
            </p>
          </div>

          {/* Score & Grade Display */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                {score} / {questions.length}
              </div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                Score ({finalPct}%)
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <GradeBadge grade={finalGrade} score={`${finalPct}%`} className="text-base" />
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                Letter Grade
              </div>
            </div>
          </div>

          {/* Question Review Drawer */}
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Question Summary Review
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {answersLog.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                    item.isCorrect
                      ? "bg-[#e8f9f0]/80 border-[#b2eccf] text-[#0D0D0D]"
                      : "bg-rose-50/50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-[#3C594E] shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-semibold truncate">{item.q.text}</span>
                  </div>
                  <span className="font-bold shrink-0">
                    {item.isCorrect ? "+1 Mark" : "0 Marks"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={restartQuiz}
              className="rounded-2xl font-bold h-12 flex-1 gap-2 border-slate-200"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
            <Button
              onClick={() => navigate("/student")}
              className="rounded-2xl font-bold h-12 flex-[2] bg-primary text-white shadow-lg shadow-primary/20"
            >
              Back to Dashboard →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progressPct = ((step + (showExplanation ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/student")}
          className="rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Exit to Dashboard
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleMute}
            className="rounded-xl text-slate-500 hover:text-slate-900"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-500" /> : <Volume2 className="h-4 w-4 text-[#3C594E]" />}
          </Button>

          {!currentQ.isExample && !showExplanation && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                timeLeft <= 10
                  ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                  : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
        {/* Progress bar */}
        <div className="h-2 w-full bg-slate-100">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <CardHeader className="p-6 sm:p-8 pb-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none font-bold text-xs">
                {pack?.subject || "Subject"} · Week {pack?.weekNumber || 4}
              </Badge>
              {currentQ.isExample && (
                <Badge className="bg-[#fdf3ee] text-[#BF8360] border-none font-bold text-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Solved Example Walkthrough
                </Badge>
              )}
            </div>
            <span className="text-xs font-black text-slate-400">
              Question {step + 1} of {questions.length}
            </span>
          </div>

          <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {currentQ.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
          {/* Options Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {currentQ.opts.map((option, idx) => {
              const isChosen = selected === idx;
              const isCorrectOpt = idx === currentQ.correct;

              let btnStyle = "border-slate-200 bg-white hover:border-primary hover:bg-primary/5 text-slate-850";
              if (showExplanation) {
                if (isCorrectOpt) {
                  btnStyle = "border-[#73D99F] bg-[#e8f9f0] text-[#1f6040] font-bold ring-2 ring-[#73D99F]/30";
                } else if (isChosen && !isCorrectOpt) {
                  btnStyle = "border-rose-400 bg-rose-50 text-rose-950 opacity-90";
                } else {
                  btnStyle = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                }
              } else if (isChosen) {
                btnStyle = "border-[#3C594E] bg-[#eaf1ef] text-[#3C594E] font-bold ring-2 ring-[#3C594E]/20";
              }

              return (
                <button
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 text-sm font-semibold cursor-pointer ${btnStyle}`}
                >
                  <span className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 mt-0.5 leading-tight">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Hint Drawer */}
          {currentQ.hint && !showExplanation && (
            <div>
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Need a hint?
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl border text-xs animate-in fade-in" style={{ backgroundColor: '#fdf3ee', borderColor: '#e8c4a8', color: '#7a4f30' }}>
                  <span className="font-bold">💡 Hint: </span>
                  {currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Step-by-Step Explanation Banner */}
          {showExplanation && (
            <div className="p-5 rounded-3xl text-xs sm:text-sm space-y-3 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: '#e8f9f0', borderWidth: 1, borderStyle: 'solid', borderColor: '#b2eccf', color: '#0D0D0D' }}>
              <div className="font-semibold text-sm flex items-center gap-2" style={{ color: '#3C594E' }}>
                <Sparkles className="h-4 w-4" style={{ color: '#3C594E' }} /> Explanation & Step-by-Step Solution:
              </div>
              <p className="font-normal leading-relaxed" style={{ color: '#2a3f38' }}>{currentQ.why}</p>
              {currentQ.steps && currentQ.steps.length > 0 && (
                <div className="space-y-1 pt-1 border-t" style={{ borderColor: '#b2eccf' }}>
                  {currentQ.steps.map((st, i) => (
                    <div key={i} className="text-xs font-normal" style={{ color: '#3C594E' }}>
                      • {st}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-2">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selected === null}
                className="rounded-2xl font-bold h-12 px-8 bg-primary text-white shadow-lg shadow-primary/20"
              >
                Confirm Answer →
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="rounded-2xl font-bold h-12 px-8 text-white shadow-lg gap-2"
                style={{ backgroundColor: '#3C594E' }}
              >
                {step >= questions.length - 1 ? "Finish Weekly Pack 🎉" : "Next Question →"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
