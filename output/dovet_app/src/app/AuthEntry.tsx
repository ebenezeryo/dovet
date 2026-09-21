"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-semibold text-slate-500">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#3C594E]" />
        <span>Loading Dovet...</span>
      </div>
    </div>
  ),
});

export default function AuthEntry() {
  return <App />;
}

