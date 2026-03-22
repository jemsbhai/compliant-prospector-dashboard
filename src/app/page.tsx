"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { useEffect } from "react";

export default function HomePage() {
  const { role, setRole } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (role === "advisor") router.push("/advisor");
    else if (role === "compliance") router.push("/compliance");
  }, [role, router]);

  if (role) return null; // redirecting

  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
            CP
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome to ClearPath</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Compliance algebra-powered prospecting for financial advisors.
            <br />
            Select your role to get started.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Advisor */}
          <button
            onClick={() => { setRole("advisor"); router.push("/advisor"); }}
            className="group p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Financial Advisor</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Browse and rank prospects by ICP score, urgency, and composite fit.
              Review AI-generated outreach messages and submit them for compliance review.
              Track the status of your submissions.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-blue-400 font-medium">
              <span>Enter as Advisor</span>
              <span>→</span>
            </div>
          </button>

          {/* Compliance Officer */}
          <button
            onClick={() => { setRole("compliance"); router.push("/compliance"); }}
            className="group p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Compliance Officer</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Review compliance audit results across 7 regulations and 36 rules.
              Examine Subjective Logic opinions, jurisdictional meet calculations,
              and approve or flag advisor submissions.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>Enter as Compliance</span>
              <span>→</span>
            </div>
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Powered by the Compliance Algebra (Syed, Silaghi, Abujar, Alssadi 2026) · Gemini 2.5 Flash · 36 rules across 7 regulations
        </p>
      </div>
    </div>
  );
}
