"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { CommandMenu } from "./components/CommandMenu";
import { WifiOff, Wifi } from "lucide-react";

// Route-level lazy loading so Next.js only compiles the current page on demand
const LoginPage = lazy(() => import("./legacy-pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignUpPage = lazy(() => import("./legacy-pages/SignUpPage").then(m => ({ default: m.SignUpPage })));
const AdminDashboard = lazy(() => import("./legacy-pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const TeacherDashboard = lazy(() => import("./legacy-pages/TeacherDashboard").then(m => ({ default: m.TeacherDashboard })));
const StudentDashboard = lazy(() => import("./legacy-pages/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const ParentDashboard = lazy(() => import("./legacy-pages/ParentDashboard").then(m => ({ default: m.ParentDashboard })));
const QuizPlayer = lazy(() => import("./components/QuizPlayer").then(m => ({ default: m.QuizPlayer })));
const LearnPacksPage = lazy(() => import("./legacy-pages/LearnPacksPage").then(m => ({ default: m.LearnPacksPage })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-sm text-slate-500 font-medium">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#3C594E]" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

// ── Offline / reconnecting banner ─────────────────────────────────────────────
function OfflineBanner() {
  const { isOnline } = useAuth();
  // Keep banner visible for 3 s after reconnecting so user sees the "back online" state
  const [visible, setVisible] = useState(!isOnline);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      setJustReconnected(false);
    } else if (visible) {
      // Was showing the offline banner — briefly show "back online" then hide
      setJustReconnected(true);
      const t = setTimeout(() => {
        setVisible(false);
        setJustReconnected(false);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isOnline]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-3 px-4 py-2 text-xs font-semibold shadow-sm"
      style={{
        backgroundColor: justReconnected ? "#e8f9f0" : "#fff8f0",
        borderBottom: `1px solid ${justReconnected ? "#73D99F" : "#BF8360"}`,
        color: justReconnected ? "#1f6040" : "#7a4f30",
      }}
      role="status"
      aria-live="polite"
    >
      {justReconnected ? (
        <>
          <Wifi className="h-4 w-4 shrink-0" style={{ color: "#3C594E" }} />
          <span>Connection restored. You're back online.</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 shrink-0 animate-pulse" style={{ color: "#BF8360" }} />
          <span>
            No internet connection — trying to reconnect
            <span className="inline-flex ml-1 gap-0.5">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
            </span>
          </span>
        </>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

function QuizPlayerRoute() {
  const { mode, packId } = useParams();
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-4 sm:p-6">
      <QuizPlayer mode={mode === "exam" ? "exam" : "learn"} packId={packId} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <OfflineBanner />
        <div className="min-h-screen" style={{ backgroundColor: "#F2F2F2", color: "#0D0D0D" }}>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/teacher/*" element={<TeacherDashboard />} />
              <Route path="/student/*" element={<StudentDashboard />} />
              <Route path="/parent/*" element={<ParentDashboard />} />
              <Route path="/learn-packs" element={<LearnPacksPage />} />
              <Route path="/player/:mode/:packId" element={<QuizPlayerRoute />} />
            </Routes>
          </Suspense>
          <CommandMenu />
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

