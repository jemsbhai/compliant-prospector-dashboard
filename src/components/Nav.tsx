"use client";

import { useApp } from "@/lib/context";

export default function Nav() {
  const { role, setRole, reviewQueue } = useApp();
  const pendingCount = reviewQueue.filter(r => r.status === "pending").length;
  const reviewedCount = reviewQueue.filter(r => r.status !== "pending").length;

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
            CP
          </div>
          <span className="font-semibold text-[var(--text-primary)]">ClearPath</span>
        </a>
        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
          {role === "advisor" && (
            <>
              <a href="/advisor" className="text-xs hover:text-[var(--text-primary)] transition-colors">
                My Prospects
              </a>
              {reviewedCount > 0 && (
                <a href="/advisor" className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  {reviewedCount} reviewed
                </a>
              )}
            </>
          )}
          {role === "compliance" && (
            <>
              <a href="/compliance" className="text-xs hover:text-[var(--text-primary)] transition-colors">
                Dashboard
              </a>
              {pendingCount > 0 && (
                <a href="/compliance" className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium animate-pulse">
                  {pendingCount} pending
                </a>
              )}
            </>
          )}
          <a href="/about" className="hover:text-[var(--text-primary)] transition-colors text-xs">
            The Algebra
          </a>
          <a href="/demo" className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
            Live Demo
          </a>
          <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-medium">
            Pulse Miami 2026
          </span>
          {role && (
            <button
              onClick={() => setRole(null)}
              className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors"
            >
              Switch Role
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
