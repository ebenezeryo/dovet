import { motion } from "framer-motion";
import { UserPlus, Sparkles, Send, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign up your school",
    description: "Create your school account in 3 steps. Choose your subdomain, set your brand colour, and invite your team. Ready in under 5 minutes.",
    iconBg: "#3C594E", iconColor: "#ffffff",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Generate or build assessments",
    description: "Use the AI Pack Generator to create a full week of guided learning packs, or build a formal summative exam manually with your own question bank.",
    iconBg: "#73D99F", iconColor: "#0D0D0D",
  },
  {
    number: "03",
    icon: Send,
    title: "Assign to students",
    description: "Publish a Learn Pack or Exam to a class or individual students. They receive it instantly in their dashboard — no link-sharing needed.",
    iconBg: "#BF8360", iconColor: "#ffffff",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track results in real time",
    description: "Results flow back automatically. Teachers see question-level analytics. Parents see their child's progress. Everyone stays informed.",
    iconBg: "#3C594E", iconColor: "#ffffff",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" style={{ backgroundColor: "#ffffff" }}>
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "#0D0D0D", fontFamily: "var(--font-display)" }}
          >
            How Dovet Works
          </h2>
          <p className="mx-auto max-w-[560px] text-base leading-relaxed" style={{ color: "#5a6a65" }}>
            From onboarding to results in four straightforward steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 lg:grid-cols-4">
          {/* Connector line */}
          <div
            className="absolute top-8 left-0 right-0 hidden lg:block h-px mx-20 opacity-30"
            style={{ background: "linear-gradient(to right, #3C594E, #73D99F, #BF8360, #3C594E)" }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center gap-4"
            >
              {/* Icon circle */}
              <div
                className="relative h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{ backgroundColor: step.iconBg }}
              >
                <step.icon className="h-7 w-7" style={{ color: step.iconColor }} />
                {/* Step number bubble */}
                <span
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: "#0D0D0D", color: "#ffffff" }}
                >
                  {i + 1}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest block mb-1.5" style={{ color: "#5a6a65" }}>
                  STEP {step.number}
                </span>
                <h3 className="text-base font-semibold mb-2" style={{ color: "#0D0D0D" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a6a65" }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
