import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const links: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features",     href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Security",     href: "#" },
  ],
  "For Schools": [
    { label: "AI Learn Packs",    href: "#features" },
    { label: "Summative Exams",   href: "#features" },
    { label: "Parent Portal",     href: "#features" },
    { label: "Branding",          href: "#features" },
  ],
  Curricula: [
    { label: "Cambridge",     href: "#" },
    { label: "IB",            href: "#" },
    { label: "US Common Core",href: "#" },
    { label: "WAEC / NECO",   href: "#" },
  ],
  Company: [
    { label: "About",           href: "#" },
    { label: "Contact",         href: "mailto:hello@dovet.io" },
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Service",href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t py-16"
      style={{ backgroundColor: "#ffffff", borderColor: "#e4e8e7" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-5">

          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: "#3C594E" }}
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold" style={{ color: "#0D0D0D" }}>Dovet</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "#5a6a65" }}>
              AI-powered learn packs and summative exams for every school and curriculum.
            </p>
            <a
              href="mailto:hello@dovet.io"
              className="text-sm font-medium"
              style={{ color: "#3C594E" }}
            >
              hello@dovet.io
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#0D0D0D" }}>
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm transition-colors"
                      style={{ color: "#5a6a65" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0D0D0D")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#5a6a65")}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ borderColor: "#e4e8e7", color: "#5a6a65" }}
        >
          <span>© {new Date().getFullYear()} Dovet. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
