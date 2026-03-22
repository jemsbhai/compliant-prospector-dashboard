import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClearPath",
  description: "ClearPath — Compliance algebra-powered prospecting for financial advisors, powered by the Compliance Algebra. Pulse Miami 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                CP
              </div>
              <span className="font-semibold text-[var(--text-primary)]">
                ClearPath
              </span>
            </a>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <a
                href="/demo"
                className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                Live Demo
              </a>
              <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-medium">
                Pulse Miami 2026
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-[1400px] mx-auto px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
