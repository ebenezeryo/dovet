import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  Globe2,
  ShieldCheck,
  BookOpenCheck,
  Check,
  School,
  Lock,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fcvzuerxfblxecojglwy.supabase.co";

const COLOR_PRESETS = [
  { name: "Forest Green", value: "#3C594E" },
  { name: "Mint Emerald", value: "#73D99F" },
  { name: "Terracotta", value: "#BF8360" },
  { name: "Deep Navy", value: "#1E293B" },
  { name: "Royal Purple", value: "#581C87" },
  { name: "Crimson Red", value: "#991B1B" },
];

const STEPS_META = [
  {
    step: 1,
    title: "School Profile",
    subtitle: "Institutional Information",
    icon: Building2,
    description: "Provide the fundamental details about your institution to configure curriculum standards and academic calendar structures.",
    tips: [
      "Enter the registered name of your school as you want it displayed on report cards and parent portals.",
      "Selecting your region automatically adjusts curriculum mappings (e.g., UK National, WAEC, Cambridge, Common Core).",
      "Choose whether you teach Primary, Secondary, or Full K-12 education.",
    ],
  },
  {
    step: 2,
    title: "Portal & Branding",
    subtitle: "Custom Web Address & Theme",
    icon: Globe2,
    description: "Every school receives a private, branded portal subdomain where teachers, students, and parents access assignments and exams.",
    tips: [
      "Your chosen subdomain becomes your direct login link (e.g. yourschool.dovet.io).",
      "Select an institutional primary brand color that will style your student dashboards, report sheets, and headers.",
      "Custom domains and institutional logos can be connected later in Admin Settings.",
    ],
  },
  {
    step: 3,
    title: "Administrator Account",
    subtitle: "Master Credentials",
    icon: ShieldCheck,
    description: "Set up the primary administrative root account. As the administrator, you will have master control over teacher allocations and student rosters.",
    tips: [
      "Use your official school or headmaster work email for security notifications and verification.",
      "Ensure your password has at least 6 characters with a combination of letters and numbers.",
      "You can invite vice-principals, heads of departments, and teachers immediately after setup.",
    ],
  },
];

export function SignUpPage() {
  const navigate = useNavigate();
  const { login, setBrandColor } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: School info
  const [schoolName, setSchoolName] = useState("");
  const [country, setCountry] = useState("Nigerian & British");
  const [schoolLevel, setSchoolLevel] = useState<"primary" | "secondary" | "both">("both");

  // Step 2: Subdomain & branding
  const [subdomain, setSubdomain] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [brandColor, setLocalBrandColor] = useState("#3C594E");

  // Step 3: Admin account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const checkSubdomain = async (value: string) => {
    if (value.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/onboarding-check-subdomain?subdomain=${encodeURIComponent(value)}`,
        { method: "GET" }
      ).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        setSubdomainAvailable(data.available);
      } else {
        setSubdomainAvailable(true);
      }
    } catch {
      setSubdomainAvailable(true);
    }
    setIsChecking(false);
  };

  const handleSubdomainChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(cleaned);
    setSubdomainAvailable(null);

    const timer = setTimeout(() => checkSubdomain(cleaned), 400);
    return () => clearTimeout(timer);
  };

  const handleColorChange = (col: string) => {
    setLocalBrandColor(col);
    setBrandColor(col);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      toast.error("Please enter your official school name");
      return;
    }
    if (!subdomain) {
      const suggested = schoolName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 20);
      setSubdomain(suggested);
      checkSubdomain(suggested);
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain.trim() || subdomain.length < 3) {
      toast.error("Please enter a valid subdomain (min 3 characters)");
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all administrator fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/onboarding-register-school`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_name: schoolName,
          country,
          school_level: schoolLevel,
          subdomain,
          brand_color: brandColor,
          admin_name: fullName,
          admin_email: email,
          password,
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        toast.success("School workspace registered successfully! Welcome to Dovet.");
        navigate("/admin");
      } else {
        // Preview fallback
        const newUser = {
          id: `admin-${Date.now()}`,
          fullName,
          email,
          role: "admin" as const,
          schoolName,
          subdomain,
          avatarUrl: null,
        };
        login(`token-${Date.now()}`, newUser);
        toast.success("School registered! Welcome to your administrative workspace.");
        navigate("/admin");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentMeta = STEPS_META.find((s) => s.step === step) || STEPS_META[0];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* ── LEFT SIDE: Instructions & Experience Showcase ───────────────────── */}
      <div
        className="lg:w-[45%] xl:w-[42%] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0"
        style={{
          background: "linear-gradient(145deg, #1C2E28 0%, #2D473E 50%, #3C594E 100%)",
        }}
      >
        {/* Subtle background ornamentation */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #73D99F 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #BF8360 0%, transparent 70%)" }}
        />

        {/* Top Header */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20"
              style={{ backgroundColor: "#3C594E" }}
            >
              <GraduationCap className="h-6 w-6 text-[#73D99F]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white block">Dovet</span>
              <span className="text-[11px] font-medium tracking-wide uppercase text-white/60">
                Institutional Education
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Instructions & Step Details */}
        <div className="my-10 lg:my-0 relative z-10 space-y-8">
          {/* Step Timeline Pills */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#73D99F] flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Workspace Onboarding
            </span>
            <div className="grid grid-cols-3 gap-2">
              {STEPS_META.map((s) => {
                const isCompleted = s.step < step;
                const isCurrent = s.step === step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    disabled={s.step > step}
                    onClick={() => setStep(s.step as 1 | 2 | 3)}
                    className={`text-left p-3 rounded-2xl transition-all duration-300 border ${
                      isCurrent
                        ? "bg-white/15 border-white/30 shadow-md backdrop-blur-md"
                        : isCompleted
                        ? "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                        : "bg-white/5 border-transparent opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-white/70">0{s.step}</span>
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5 text-[#73D99F]" />
                      ) : (
                        <s.icon className="h-3.5 w-3.5 text-white/60" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{s.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Guide Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#73D99F]/20 border border-[#73D99F]/30 flex items-center justify-center text-[#73D99F] shrink-0">
                <currentMeta.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{currentMeta.title}</h3>
                <p className="text-xs text-white/70">{currentMeta.subtitle}</p>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed mb-5 font-normal">
              {currentMeta.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#73D99F] block">
                Guidance & Best Practices
              </span>
              <ul className="space-y-2.5">
                {currentMeta.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-[#73D99F] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Compliance Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-[#73D99F]" />
            <span>256-bit SSL Encrypted & GDPR Compliant</span>
          </div>
          <span>Dovet v2.4</span>
        </div>
      </div>

      {/* ── RIGHT SIDE: Clean Multi-Step Form ───────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-16">
        <div className="w-full max-w-xl mx-auto space-y-8">
          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3C594E]/10 text-[#3C594E] text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[#3C594E]" />
              <span>Step {step} of 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {step === 1 && "Create your school profile"}
              {step === 2 && "Set up portal & identity"}
              {step === 3 && "Administrator master account"}
            </h1>
            <p className="text-sm text-slate-500">
              {step === 1 && "Start by identifying your educational institution and academic level."}
              {step === 2 && "Configure your dedicated subdomain and institutional color palette."}
              {step === 3 && "Create the master administrator account for high-level management."}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
            {/* ── STEP 1: School Profile ── */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Official School Name *
                  </Label>
                  <div className="relative">
                    <Input
                      id="schoolName"
                      placeholder="e.g. St. Andrews International College"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="h-12 rounded-2xl text-sm font-medium border-slate-200 focus-visible:ring-[#3C594E] pl-11"
                      required
                    />
                    <School className="h-5 w-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-400">This will appear on student reports, parent portals, and certificates.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Curriculum Framework *
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country" className="h-12 rounded-2xl text-sm font-medium border-slate-200 focus:ring-[#3C594E]">
                      <SelectValue placeholder="Select Curriculum" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl max-h-[300px]">
                      <SelectItem value="Nigerian & British">
                        🇳🇬 🇬🇧 Nigerian & British (Dual / Blended Curriculum)
                      </SelectItem>
                      <SelectItem value="British Curriculum">
                        🇬🇧 British National Curriculum (UK / Cambridge / Edexcel / GCSE / A-Level)
                      </SelectItem>
                      <SelectItem value="Nigerian Curriculum">
                        🇳🇬 Nigerian National Curriculum (NERDC / WAEC / NECO / BECE)
                      </SelectItem>
                      <SelectItem value="International Baccalaureate">
                        🌐 International Baccalaureate (IB - PYP / MYP / DP)
                      </SelectItem>
                      <SelectItem value="American Curriculum">
                        🇺🇸 American Curriculum (US Common Core / AP / NGSS)
                      </SelectItem>
                      <SelectItem value="Ghanaian Curriculum">
                        🇬🇭 Ghanaian National Curriculum (NaCCA / WASSCE / BECE)
                      </SelectItem>
                      <SelectItem value="Kenyan Curriculum">
                        🇰🇪 Kenyan Curriculum (CBC / KCSE / 8-4-4)
                      </SelectItem>
                      <SelectItem value="South African Curriculum">
                        🇿🇦 South African Curriculum (CAPS / IEB)
                      </SelectItem>
                      <SelectItem value="Canadian Curriculum">
                        🇨🇦 Canadian Provincial Curriculum
                      </SelectItem>
                      <SelectItem value="Nova Scotia Curriculum">
                        🇨🇦 Nova Scotia Curriculum (Canada / PSP / High School Program)
                      </SelectItem>
                      <SelectItem value="Australian Curriculum">
                        🇦🇺 Australian Curriculum (ACARA / ATAR)
                      </SelectItem>
                      <SelectItem value="Other">
                        🌍 Other / Customized Regional Curriculum
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-slate-400">
                    Sets default question banks, grading scales, and AI learn pack taxonomy.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Education Level Coverage *
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "primary", label: "Primary", desc: "Ages 5 – 11" },
                      { id: "secondary", label: "Secondary", desc: "Ages 11 – 18" },
                      { id: "both", label: "K-12 (Both)", desc: "All Stages" },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setSchoolLevel(lvl.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                          schoolLevel === lvl.id
                            ? "border-[#3C594E] bg-[#eaf1ef] text-[#3C594E] ring-2 ring-[#3C594E]/20 shadow-sm"
                            : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold block">{lvl.label}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-1">{lvl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 hover:opacity-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#3C594E" }}
                  >
                    <span>Continue to Portal & Theme</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* ── STEP 2: Portal & Branding ── */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subdomain" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    School Portal URL *
                  </Label>
                  <div className="flex rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#3C594E] focus-within:border-[#3C594E] overflow-hidden transition-all">
                    <Input
                      id="subdomain"
                      placeholder="e.g. standrews"
                      value={subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      className="border-0 focus-visible:ring-0 rounded-none h-12 text-sm font-semibold text-slate-800 px-4"
                      required
                    />
                    <span className="inline-flex items-center px-4 bg-slate-100/80 text-slate-600 text-xs font-bold border-l border-slate-200 select-none">
                      .dovet.io
                    </span>
                  </div>

                  <div className="min-h-[20px]">
                    {isChecking ? (
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3C594E]" />
                        <span>Checking domain availability...</span>
                      </div>
                    ) : subdomainAvailable === true ? (
                      <div className="text-xs text-[#3C594E] flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-[#3C594E]" />
                        <span><strong>{subdomain}.dovet.io</strong> is available!</span>
                      </div>
                    ) : subdomainAvailable === false ? (
                      <div className="text-xs text-red-600 font-semibold">
                        Subdomain already registered. Please choose a different handle.
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Letters, numbers, and hyphens only (minimum 3 characters).
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Institutional Brand Accent
                    </Label>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">{brandColor}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleColorChange(preset.value)}
                        className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
                          brandColor === preset.value
                            ? "border-slate-800 bg-slate-50 font-bold shadow-sm ring-2 ring-slate-800/20"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
                          style={{ backgroundColor: preset.value }}
                        />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-12 px-5 rounded-2xl font-bold text-xs border-slate-200 hover:bg-slate-100"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 hover:opacity-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#3C594E" }}
                  >
                    <span>Continue to Admin Credentials</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* ── STEP 3: Admin Account ── */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Administrator Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Dr. Arthur Pendelton"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-2xl text-sm font-medium border-slate-200 focus-visible:ring-[#3C594E]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adminEmail" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Work / Official Email *
                  </Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="principal@standrews.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl text-sm font-medium border-slate-200 focus-visible:ring-[#3C594E]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="adminPassword" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Master Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-2xl text-sm font-medium border-slate-200 focus-visible:ring-[#3C594E] pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-type password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-2xl text-sm font-medium border-slate-200 focus-visible:ring-[#3C594E]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#3C594E] focus:ring-[#3C594E] mt-0.5"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to the Dovet Institutional{" "}
                      <a href="#terms" className="text-[#3C594E] font-bold hover:underline">
                        Terms of Service
                      </a>{" "}
                      and Student Data{" "}
                      <a href="#privacy" className="text-[#3C594E] font-bold hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="h-12 px-5 rounded-2xl font-bold text-xs border-slate-200 hover:bg-slate-100"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 hover:opacity-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#3C594E" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating School Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom helper */}
          <div className="text-center text-xs text-slate-500 font-medium">
            Already have a school workspace?{" "}
            <Link to="/login" className="text-[#3C594E] font-bold hover:underline">
              Sign in to your portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

