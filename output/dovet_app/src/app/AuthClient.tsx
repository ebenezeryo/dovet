"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/App"), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">Loading Dovet...</div>,
});

export default function AuthClient() {
  return <App />;
}
