import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    per: "Free forever",
    description: "Perfect for a single teacher or small tutoring centre getting started.",
    features: [
      "Up to 50 students",
      "5 Learn Packs per month (AI-generated)",
      "3 Summative exams per month",
      "Basic reporting",
      "Student & parent portals",
      "Community support",
    ],
    cta: "Start for Free",
    href: "/signup",
    popular: false,
    ctaBg: "#ffffff",
    ctaColor: "#3C594E",
    ctaBorder: "#c8dcd5",
  },
  {
    name: "School",
    price: "$29",
    per: "per month",
    description: "For departments or whole schools that need unlimited assessment power.",
    features: [
      "Up to 500 students",
      "Unlimited AI Learn Packs",
      "Unlimited Summative exams",
      "Question bank import (CSV / DOCX)",
      "Full analytics dashboard",
      "Custom school branding",
      "Parent portal",
      "Priority support",
    ],
    cta: "Get Started",
    href: "/signup",
    popular: true,
    ctaBg: "#3C594E",
    ctaColor: "#ffffff",
    ctaBorder: "#3C594E",
  },
  {
    name: "District",
    price: "Custom",
    per: "contact us",
    description: "Multi-school districts, international schools, and exam boards.",
    features: [
      "Unlimited students across schools",
      "Multi-school admin console",
      "LMS integration (Google Classroom, Canvas)",
      "SSO / SAML",
      "SLA-backed uptime",
      "Dedicated onboarding manager",
      "Custom AI curriculum ingestion",
      "On-premise option available",
    ],
    cta: "Talk to Sales",
    href: "mailto:hello@dovet.io?subject=Dovet District Plan",
    popular: false,
    ctaBg: "#ffffff",
    ctaColor: "#3C594E",
    ctaBorder: "#c8dcd5",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24" style={{ backgroundColor: "#F2F2F2" }}>
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "#0D0D0D", fontFamily: "var(--font-display)" }}
          >
            Transparent Pricing
          </h2>
          <p className="mx-auto max-w-[600px] text-base leading-relaxed" style={{ color: "#5a6a65" }}>
            Start free. Scale when you're ready. No hidden fees, no per-student charges on the paid plans.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3 items-start max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-8 transition-shadow hover:shadow-lg ${tier.popular ? "shadow-xl" : "shadow-sm"}`}
              style={{
                backgroundColor: "#ffffff",
                borderColor: tier.popular ? "#3C594E" : "#e4e8e7",
                outline: tier.popular ? "2px solid #3C594E" : "none",
                outlineOffset: "2px",
              }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                  style={{ backgroundColor: "#3C594E" }}
                >
                  <Zap className="h-3 w-3" /> Most Popular
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4" style={{ color: "#0D0D0D" }}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: "#0D0D0D", fontFamily: "var(--font-display)" }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "#5a6a65" }}>
                    {tier.per}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#5a6a65" }}>
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: "#0D0D0D" }}>
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "#3C594E" }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.href.startsWith("mailto") ? (
                <a
                  href={tier.href}
                  className="w-full text-center py-3 rounded-2xl text-sm font-semibold border transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: tier.ctaBg,
                    color: tier.ctaColor,
                    borderColor: tier.ctaBorder,
                  }}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  to={tier.href}
                  className="w-full text-center py-3 rounded-2xl text-sm font-semibold border transition-opacity hover:opacity-90 block"
                  style={{
                    backgroundColor: tier.ctaBg,
                    color: tier.ctaColor,
                    borderColor: tier.ctaBorder,
                  }}
                >
                  {tier.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm mt-10" style={{ color: "#5a6a65" }}>
          Questions? Email us at{" "}
          <a href="mailto:hello@dovet.io" style={{ color: "#3C594E", fontWeight: 600 }}>
            hello@dovet.io
          </a>
        </p>
      </div>
    </section>
  );
}
