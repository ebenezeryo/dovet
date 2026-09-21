import { GraduationCap, Menu, X, BookOpen, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 backdrop-blur-xl"
      style={{ backgroundColor: "rgba(255,255,255,0.97)" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: "#3C594E" }}
          >
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: "#0D0D0D" }}>
            Dovet
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {[
            { label: "Platform",     href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Pricing",      href: "#pricing" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium transition-colors"
              style={{ color: "#5a6a65" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0D0D0D")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#5a6a65")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            style={{ color: "#3C594E" }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#3C594E" }}
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "#0D0D0D" }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="border-b border-slate-200 p-4 md:hidden" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex flex-col gap-1">
            <a href="#features" className="flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-[#eaf1ef]" style={{ color: "#0D0D0D" }} onClick={() => setIsMenuOpen(false)}>
              <BookOpen className="h-4 w-4" style={{ color: "#3C594E" }} /> Platform
            </a>
            <a href="#how-it-works" className="flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-[#eaf1ef]" style={{ color: "#0D0D0D" }} onClick={() => setIsMenuOpen(false)}>
              <BarChart3 className="h-4 w-4" style={{ color: "#3C594E" }} /> How It Works
            </a>
            <a href="#pricing" className="flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-[#eaf1ef]" style={{ color: "#0D0D0D" }} onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
            <div className="flex gap-2 pt-3 mt-1 border-t border-slate-100">
              <Link to="/login" className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border border-slate-200" style={{ color: "#3C594E", backgroundColor: "#ffffff" }} onClick={() => setIsMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/signup" className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl text-white" style={{ backgroundColor: "#3C594E" }} onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
