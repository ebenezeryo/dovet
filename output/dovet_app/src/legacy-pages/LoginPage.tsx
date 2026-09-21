import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, UserCheck, BookOpen, Users, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fcvzuerxfblxecojglwy.supabase.co";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();

  const [subdomain, setSubdomain] = useState("");
  const [rememberSchool, setRememberSchool] = useState(true);
  const [step, setStep] = useState<"subdomain" | "credentials">("subdomain");
  const [authTab, setAuthTab] = useState<"staff" | "student">("staff");

  // Staff Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Student Credentials
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [studentSurname, setStudentSurname] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    const savedSubdomain = localStorage.getItem("dovet_remembered_subdomain");
    if (savedSubdomain) {
      setSubdomain(savedSubdomain);
    }
  }, []);

  const handleSubdomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain.trim()) {
      toast.error("Please enter your school subdomain");
      return;
    }

    if (rememberSchool) {
      localStorage.setItem("dovet_remembered_subdomain", subdomain.trim().toLowerCase());
    } else {
      localStorage.removeItem("dovet_remembered_subdomain");
    }

    // If offline, skip the server check and go straight to credentials
    if (!navigator.onLine) {
      setStep("credentials");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/onboarding-check-subdomain?subdomain=${encodeURIComponent(subdomain.trim())}`,
        { method: "GET", signal: AbortSignal.timeout(6000) }
      ).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        if (data.available) {
          toast.error("School subdomain not registered yet. You can sign up or try a demo login below.");
        }
      }
      setStep("credentials");
    } catch {
      setStep("credentials");
    }
    setIsLoading(false);
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    // Hard block when offline — never fall through to a demo account
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network and try again.", { duration: 6000 });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/auth-staff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-subdomain": subdomain.trim().toLowerCase() || "dovet-academy",
          },
          body: JSON.stringify({ email, password }),
          signal: AbortSignal.timeout(10000),
        }
      ).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user.fullName}!`);
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "teacher") navigate("/teacher");
        else if (data.user.role === "parent") navigate("/parent");
        else navigate("/student");
      } else if (response) {
        // Server responded but rejected — wrong credentials or unknown user
        let msg = "Invalid email or password.";
        try { const d = await response.json(); if (d?.message) msg = d.message; } catch {/* */}
        toast.error(msg);
      } else {
        // fetch returned null — network failure mid-request
        toast.error("Could not reach the server. Please check your connection and try again.", { duration: 6000 });
      }
    } catch {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNumber || !studentSurname) {
      toast.error("Please enter your Admission Number and Surname");
      return;
    }

    // Hard block when offline — never fall through to a demo account
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your network and try again.", { duration: 6000 });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/auth-student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-subdomain": subdomain.trim().toLowerCase() || "dovet-academy",
          },
          body: JSON.stringify({ admission_number: admissionNumber, surname: studentSurname }),
          signal: AbortSignal.timeout(10000),
        }
      ).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        toast.success(`Welcome, ${data.user.fullName}!`);
        navigate("/student");
      } else if (response) {
        let msg = "Admission number or surname is incorrect.";
        try { const d = await response.json(); if (d?.message) msg = d.message; } catch {/* */}
        toast.error(msg);
      } else {
        toast.error("Could not reach the server. Please check your connection and try again.", { duration: 6000 });
      }
    } catch {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = (role: UserRole) => {
    switchRole(role);
    if (role === "admin") navigate("/admin");
    else if (role === "teacher") navigate("/teacher");
    else if (role === "parent") navigate("/parent");
    else navigate("/student");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-800 hover:text-[#3C594E] transition-colors">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-semibold shadow-md" style={{ backgroundColor: '#3C594E' }}>
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Dovet</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to your school workspace</h2>
        <p className="text-xs text-slate-500 font-normal">
          AI-driven formative learn packs & summative evaluations
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">

        {/* Offline banner */}
        {!isOnline && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium"
            style={{ backgroundColor: '#fff8f0', borderColor: '#e8c4a8', color: '#7a4f30' }}>
            <WifiOff className="h-4 w-4 shrink-0" style={{ color: '#BF8360' }} />
            <span>
              <strong>You're offline.</strong> Sign-in requires a connection. Demo logins below are still available.
            </span>
          </div>
        )}

        <Card className="border border-slate-200/70 shadow-sm rounded-3xl bg-white overflow-hidden p-2 sm:p-4">
          {step === "subdomain" ? (
            <form onSubmit={handleSubdomainSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">Enter School Domain</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-normal">
                  Type your school's unique sub-portal address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="subdomain" className="text-xs font-semibold text-slate-700">
                    School Subdomain
                  </Label>
                  <div className="flex rounded-xl border border-slate-200 focus-within:ring-2 focus-within:border-[#3C594E] overflow-hidden" style={{ '--tw-ring-color': '#3C594E' } as React.CSSProperties}>
                    <Input
                      id="subdomain"
                      placeholder="Enter school subdomain"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className="border-0 focus-visible:ring-0 rounded-none h-11 text-xs font-semibold"
                      required
                    />
                    <span className="inline-flex items-center px-3.5 bg-slate-50 text-slate-500 text-xs font-medium border-l border-slate-200">
                      .dovet.io
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberSchool}
                      onChange={(e) => setRememberSchool(e.target.checked)}
                      className="rounded border-slate-300 text-[#3C594E] focus:ring-[#3C594E]"
                    />
                    Remember this school
                  </label>
                  <span className="text-[11px] font-semibold cursor-pointer hover:underline" style={{ color: '#3C594E' }} onClick={() => setSubdomain("dovet-academy")}>
                    Demo subdomain
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl h-11 font-semibold text-sm text-white shadow-sm"
                  style={{ backgroundColor: '#3C594E' }}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue to Login →"}
                </Button>
                <div className="text-center text-xs text-slate-500 font-normal">
                  Don't have a school workspace?{" "}
                  <Link to="/signup" className="text-[#3C594E] font-semibold hover:underline">
                    Register School
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <div>
              <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep("subdomain")}
                  className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-900 gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md border" style={{ color: '#3C594E', backgroundColor: '#eaf1ef', borderColor: '#c8dcd5' }}>
                  {subdomain || "dovet-academy"}.dovet.io
                </span>
              </div>

              <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as any)} className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="grid grid-cols-2 w-full rounded-xl bg-slate-100 p-1">
                    <TabsTrigger value="staff" className="rounded-lg text-xs font-semibold">
                      Staff / Teacher
                    </TabsTrigger>
                    <TabsTrigger value="student" className="rounded-lg text-xs font-semibold">
                      Student
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="staff" className="p-6 pt-4 space-y-4">
                  <form onSubmit={handleStaffLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Staff Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl h-11 text-xs font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl h-11 text-xs font-medium pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                <Button
                  type="submit"
                  disabled={isLoading || !isOnline}
                  className="w-full rounded-2xl h-11 font-semibold text-sm text-white shadow-sm"
                  style={{ backgroundColor: '#3C594E' }}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : !isOnline ? "Offline — no connection" : "Sign In to Staff Workspace"}
                </Button>
                  </form>
                </TabsContent>

                <TabsContent value="student" className="p-6 pt-4 space-y-4">
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Admission Number</Label>
                      <Input
                        placeholder="Enter admission number"
                        value={admissionNumber}
                        onChange={(e) => setAdmissionNumber(e.target.value)}
                        className="rounded-xl h-11 text-xs font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Surname / Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter surname or password"
                        value={studentSurname}
                        onChange={(e) => setStudentSurname(e.target.value)}
                        className="rounded-xl h-11 text-xs font-medium"
                        required
                      />
                    </div>
                <Button
                  type="submit"
                  disabled={isLoading || !isOnline}
                  className="w-full rounded-2xl h-11 font-semibold text-sm text-white shadow-sm"
                  style={{ backgroundColor: '#3C594E' }}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : !isOnline ? "Offline — no connection" : "Sign In to Student Portal"}
                </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </Card>

        {/* 1-Click Demo Logins */}
        <div className="mt-6 pt-6 border-t border-slate-200/70 text-center space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Instant Demo Logins (No password needed)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleDemoClick("admin")}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-all text-left flex flex-col justify-between"
            >
              <ShieldCheck className="h-4 w-4 text-slate-700 mb-1" />
              <div>
                <div className="text-xs font-bold text-slate-800">Admin</div>
                <div className="text-[10px] text-slate-400">Principal</div>
              </div>
            </button>
            <button
              onClick={() => handleDemoClick("teacher")}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#c8dcd5] hover:bg-[#eaf1ef]/40 transition-all text-left flex flex-col justify-between"
            >
              <UserCheck className="h-4 w-4 mb-1" style={{ color: '#3C594E' }} />
              <div>
                <div className="text-xs font-bold text-slate-800">Teacher</div>
                <div className="text-[10px] text-slate-400">Faculty</div>
              </div>
            </button>
            <button
              onClick={() => handleDemoClick("student")}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#b2eccf] hover:bg-[#e8f9f0]/40 transition-all text-left flex flex-col justify-between"
            >
              <BookOpen className="h-4 w-4 mb-1" style={{ color: '#73D99F' }} />
              <div>
                <div className="text-xs font-bold text-slate-800">Student</div>
                <div className="text-[10px] text-slate-400">Student</div>
              </div>
            </button>
            <button
              onClick={() => handleDemoClick("parent")}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#e8c4a8] hover:bg-[#fdf3ee]/40 transition-all text-left flex flex-col justify-between"
            >
              <Users className="h-4 w-4 mb-1" style={{ color: '#BF8360' }} />
              <div>
                <div className="text-xs font-bold text-slate-800">Parent</div>
                <div className="text-[10px] text-slate-400">Guardian</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
