import { ArrowRight, BookOpen, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section style={{ backgroundColor: "#ffffff" }} className="relative overflow-hidden py-20 lg:py-32">
      {/* Subtle background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #3C594E, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #73D99F, transparent 70%)" }} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

          {/* ── Left copy ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-7"
          >
            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
              style={{ color: "#0D0D0D", fontFamily: "var(--font-display)" }}
            >
              From first practice{" "}
              <br className="hidden sm:block" />
              to final assessment,{" "}
              <br className="hidden sm:block" />
              every student deserves a{" "}
              <span style={{ color: "#3C594E" }}>guided learning journey</span>
            </h1>

            {/* Sub-copy */}
            <p className="max-w-[520px] text-base sm:text-lg leading-relaxed" style={{ color: "#5a6a65" }}>
              Dovet combines AI-generated learn packs, live tutor-style practice, and formal exams in one school platform — built for teachers, students, and parents across every curriculum.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#3C594E" }}
              >
                Start for Free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold border transition-colors hover:bg-[#eaf1ef]"
                style={{ backgroundColor: "#ffffff", borderColor: "#c8dcd5", color: "#3C594E" }}
              >
                <BookOpen className="h-4 w-4" /> See How It Works
              </a>
            </div>
          </motion.div>

          {/* ── Right image ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border"
              style={{ borderColor: "#e4e8e7" }}
            >
              <img
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/19dcf09f-c4a2-4918-856d-7b9957aa384c/hero-section-background-6f5919bd-1782337814239.webp"
                alt="Students learning with Dovet"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Learn Mode card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="absolute -bottom-5 -left-5 rounded-2xl border shadow-xl p-3.5 flex items-center gap-3"
              style={{ backgroundColor: "#ffffff", borderColor: "#e4e8e7" }}
            >
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#e8f9f0" }}>
                <BookOpen className="h-5 w-5" style={{ color: "#3C594E" }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Learn Mode</div>
                <div className="text-xs" style={{ color: "#5a6a65" }}>Formative · guided packs</div>
              </div>
            </motion.div>

            {/* Exam Mode card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="absolute -top-5 -right-5 rounded-2xl border shadow-xl p-3.5 flex items-center gap-3"
              style={{ backgroundColor: "#ffffff", borderColor: "#e4e8e7" }}
            >
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#fdf3ee" }}>
                <BarChart3 className="h-5 w-5" style={{ color: "#BF8360" }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Exam Mode</div>
                <div className="text-xs" style={{ color: "#5a6a65" }}>Summative · full analytics</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
