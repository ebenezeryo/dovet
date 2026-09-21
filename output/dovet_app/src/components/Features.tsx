import {
  BookOpen, School, Palette, Brain, BarChart3, Globe,
  Clock, Shield, Users,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Learn Packs",
    description: "Generate a full week of guided learning: solved examples, practice questions, hints, and solutions — tailored to any topic, year group, and curriculum.",
    icon: Brain,
    iconBg: "#e8f9f0", iconColor: "#3C594E",
    tag: "Formative", tagBg: "#e8f9f0", tagColor: "#3C594E",
  },
  {
    title: "Summative Exams",
    description: "Build, schedule, and deliver formal timed assessments with automatic marking, question banks, and tamper-proof result storage.",
    icon: BarChart3,
    iconBg: "#fdf3ee", iconColor: "#BF8360",
    tag: "Summative", tagBg: "#fdf3ee", tagColor: "#BF8360",
  },
  {
    title: "Any Curriculum",
    description: "Cambridge, IB, US Common Core, CBSE, WAEC, local national curricula — Dovet adapts to your school's academic requirements.",
    icon: Globe,
    iconBg: "#eaf1ef", iconColor: "#3C594E",
    tag: "Global", tagBg: "#eaf1ef", tagColor: "#3C594E",
  },
  {
    title: "Any School Level",
    description: "From kindergarten to A-level. Primary assessments, secondary mid-terms, national exam prep — all on one platform that scales with your students.",
    icon: School,
    iconBg: "#fdf3ee", iconColor: "#BF8360",
    tag: "Flexible", tagBg: "#fdf3ee", tagColor: "#BF8360",
  },
  {
    title: "Your Branding",
    description: "Custom subdomain, logo, and brand colour. Students and parents see your school's identity everywhere — not Dovet's.",
    icon: Palette,
    iconBg: "#e8f9f0", iconColor: "#3C594E",
    tag: "White-label", tagBg: "#e8f9f0", tagColor: "#3C594E",
  },
  {
    title: "Real-time Analytics",
    description: "Live dashboards for admins, teachers, students, and parents. Track scores, progress, streaks, weak topics, and class averages at a glance.",
    icon: BarChart3,
    iconBg: "#eaf1ef", iconColor: "#3C594E",
    tag: "Insights", tagBg: "#eaf1ef", tagColor: "#3C594E",
  },
  {
    title: "Instant Feedback",
    description: "Students see why they got something wrong the moment they answer. Step-by-step explanations, hints, and warm encouragement — not just a red cross.",
    icon: Clock,
    iconBg: "#fdf3ee", iconColor: "#BF8360",
    tag: "Learn Mode", tagBg: "#fdf3ee", tagColor: "#BF8360",
  },
  {
    title: "Parent Portal",
    description: "Parents get a read-only window into their child's results, progress over time, and upcoming assessments — no separate app needed.",
    icon: Users,
    iconBg: "#e8f9f0", iconColor: "#3C594E",
    tag: "Transparency", tagBg: "#e8f9f0", tagColor: "#3C594E",
  },
  {
    title: "Secure by Design",
    description: "Role-based access, school-isolated data, JWT-authenticated APIs. GDPR-conscious and built to meet the data protection needs of international schools.",
    icon: Shield,
    iconBg: "#F2F2F2", iconColor: "#3C594E",
    tag: "Security", tagBg: "#F2F2F2", tagColor: "#5a6a65",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24" style={{ backgroundColor: "#F2F2F2" }}>
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "#0D0D0D", fontFamily: "var(--font-display)" }}
          >
            One platform. Two modes. Every school.
          </h2>
          <p className="mx-auto max-w-[640px] text-base leading-relaxed" style={{ color: "#5a6a65" }}>
            Dovet brings together formative learning and summative assessment so teachers spend less time preparing materials and more time teaching.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border p-6 flex flex-col gap-4 transition-shadow hover:shadow-md"
              style={{ backgroundColor: "#ffffff", borderColor: "#e4e8e7" }}
            >
              {/* Icon + tag row */}
              <div className="flex items-center justify-between">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: f.iconBg }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.iconColor }} />
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: f.tagBg, color: f.tagColor }}
                >
                  {f.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: "#0D0D0D" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a6a65" }}>
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
