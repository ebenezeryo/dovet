import type { ReactNode } from "react";
import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Dovet — Formative Learning Packs & Summative Assessment Platform",
  description: "Dovet — Formative Learning Packs & Summative Assessment Platform for Schools.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
