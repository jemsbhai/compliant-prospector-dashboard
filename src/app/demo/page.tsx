"use client";

import { useState } from "react";
import { ComplianceBadge, OpinionBar, OpinionValues, SeverityBadge } from "@/components/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Pre-loaded non-compliant message — deliberately packed with violations
const SAMPLE_BAD_MESSAGE = `Subject: Re: Exclusive Opportunity — Act Now!

Hi John,

Congratulations! You've been selected for an exclusive opportunity that guarantees exceptional returns on your investment portfolio. Our proven strategy has never failed — clients who act now can expect to double their money within 12 months, risk-free.

I know your current advisor hasn't delivered the best results. Leave your current advisor and switch to our revolutionary system. This is a once in a lifetime chance — don't miss out!

Other clients have seen incredible performance, and I promise you will too. This is a safe bet — a sure thing that will set you for life.

Text me on my personal email to get started before it's too late. Limited spots available — hurry!

Best regards,
Financial Advisor`;

const SAMPLE_CLEAN_MESSAGE = `Given your role as Senior VP of Finance at Meridian Capital, I wanted to share a tax-advantaged strategy designed for high-income professionals in your industry. This is designed as an ancillary opportunity to optimize your overall tax efficiency without replacing your current advisory team. Would you be open to a brief conversation about how this could complement your existing planning?

The Fortis Advisory Team | Fortis Wealth Management
250 Park Avenue, Suite 1200, New York, NY 10177
If you prefer not to receive future communications, reply STOP or click here to unsubscribe.`;

const REGULATION_PRESETS = [
  { label: "FINRA + SEC + CAN-SPAM", ids: ["FINRA", "SEC", "CAN_SPAM_TCPA"] },
  { label: "FINRA Only", ids: ["FINRA"] },
  { label: "SEC Only", ids: ["SEC"] },
  { label: "All 7 Regulations", ids: ["FINRA", "SEC", "CAN_SPAM_TCPA", "MiFID_II", "NY_State", "NASAA", "SOX"] },
];

export default function DemoPage() {
  const [message, setMessage] = useState(SAMPLE_BAD_MESSAGE);
  const [selectedRegs, setSelectedRegs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [useAlgebra, setUseAlgebra] = useState(true);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({
        message: message,
        prospect_name: "John Smith",
        prospect_role: "Senior VP of Finance at Meridian Capital",
        use_gemini: "false",
        use_algebra: String(useAlgebra),
      });
      REGULATION_PRESETS[selectedRegs].ids.forEach(id => {
        params.append("regulation_ids", id);
      });

      const res = await fetch(`${API_URL}/api/check?${params}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (type: "bad" | "clean") => {
    setMessage(type === "bad" ? SAMPLE_BAD_MESSAGE : SAMPLE_CLEAN_MESSAGE);
    setResult(null);
  };

  const audit = result?.audit;
  const correction = result?.correction;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        ← Back to dashboard
      </a>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Live Compliance Demo</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Paste any outreach message and watch the compliance algebra analyze it in real-time — regex engine, zero API cost.
        </p>
      </div>

      {/* Input area */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Outreach Message</h3>
          <div className="flex gap-2">
            <button
              onClick={() => loadSample("bad")}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Load Non-Compliant Sample
            </button>
            <button
              onClick={() => loadSample("clean")}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              Load Compliant Sample
            </button>
          </div>
        </div>
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); setResult(null); }}
          rows={12}
          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] p-4 font-mono focus:outline-none focus:border-blue-500 resize-y"
          placeholder="Paste your outreach message here..."
        />

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Regulation preset */}
          <div className="flex gap-2">
            {REGULATION_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => { setSelectedRegs(i); setResult(null); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  i === selectedRegs
                    ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                    : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Algebra toggle */}
          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={useAlgebra}
              onChange={(e) => { setUseAlgebra(e.target.checked); setResult(null); }}
              className="rounded"
            />
            Compliance Algebra (SL opinions)
          </label>

          {/* Run button */}
          <button
            onClick={runCheck}
            disabled={loading || !message.trim()}
            className="ml-auto px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Run Compliance Check"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall verdict */}
          <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">Original Message</h3>
                <ComplianceBadge level={result.compliance_level} size="lg" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                {useAlgebra ? "Compliance Algebra" : "Binary Pass/Fail"} · {REGULATION_PRESETS[selectedRegs].label}
              </span>
            </div>
            {audit?.overall && (
              <>
                <OpinionBar l={audit.overall.lawfulness} v={audit.overall.violation} u={audit.overall.uncertainty} height={12} />
                <div className="mt-2">
                  <OpinionValues l={audit.overall.lawfulness} v={audit.overall.violation} u={audit.overall.uncertainty} />
                </div>
              </>
            )}
          </div>

          {/* Per-rule breakdown */}
          {audit?.rule_results && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                Per-Rule Audit Trail ({audit.rule_results.length} rules)
              </h3>
              <div className="space-y-2">
                {audit.rule_results.map((rr: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <SeverityBadge severity={rr.severity || "major"} />
                        <span className="text-xs font-medium text-[var(--text-primary)] truncate">{rr.rule_name}</span>
                        <span className="text-xs text-[var(--text-muted)]">{rr.regulation}</span>
                      </div>
                      <OpinionValues l={rr.opinion.lawfulness} v={rr.opinion.violation} u={rr.opinion.uncertainty} />
                    </div>
                    <OpinionBar l={rr.opinion.lawfulness} v={rr.opinion.violation} u={rr.opinion.uncertainty} height={4} />
                    {rr.flagged_phrases && rr.flagged_phrases.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rr.flagged_phrases.map((p: string, j: number) => (
                          <span key={j} className="inline-block bg-red-500/10 text-red-300 text-xs px-1.5 py-0.5 rounded">
                            &quot;{p}&quot;
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-[var(--text-muted)]">{rr.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Self-Correction */}
          {correction && correction.corrections_applied && correction.corrections_applied.length > 0 && (
            <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-emerald-400">✨ Self-Correction Engine</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    correction.fully_resolved
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {correction.fully_resolved ? "✓ Fully Resolved" : "⚠ Partially Resolved"}
                  </span>
                </div>
                <ComplianceBadge level={result.corrected_compliance_level} size="md" />
              </div>

              <p className="text-xs text-[var(--text-secondary)] mb-4">
                {correction.corrections_applied.length} phrase{correction.corrections_applied.length !== 1 ? "s" : ""} automatically
                rewritten to be compliant in {correction.iterations} iteration{correction.iterations !== 1 ? "s" : ""}.
              </p>

              {/* Correction steps */}
              <div className="space-y-2 mb-4">
                {correction.corrections_applied.map((step: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs">
                        <span className="diff-removed">{step.original}</span>
                        <span className="mx-2 text-[var(--text-muted)]">→</span>
                        <span className="diff-added">{step.replacement}</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        {step.rule_id} · {step.method}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Corrected message */}
              {correction.corrected_message && (
                <div className="mb-4">
                  <div className="text-xs text-emerald-400 mb-1">✓ Corrected Message:</div>
                  <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-secondary)] p-4 rounded-lg font-mono">
                    {correction.corrected_message}
                  </div>
                </div>
              )}

              {/* Improvement delta */}
              {correction.improvement && (
                <div className="flex gap-4 text-xs font-mono p-2 rounded-lg bg-[var(--bg-secondary)]">
                  <span className="text-[var(--text-muted)]">Improvement:</span>
                  <span className={correction.improvement.lawfulness_delta >= 0 ? "text-emerald-400" : "text-red-400"}>
                    Δl={correction.improvement.lawfulness_delta >= 0 ? "+" : ""}{correction.improvement.lawfulness_delta.toFixed(3)}
                  </span>
                  <span className={correction.improvement.violation_delta <= 0 ? "text-emerald-400" : "text-red-400"}>
                    Δv={correction.improvement.violation_delta >= 0 ? "+" : ""}{correction.improvement.violation_delta.toFixed(3)}
                  </span>
                  <span className="text-amber-400">
                    Δu={correction.improvement.uncertainty_delta >= 0 ? "+" : ""}{correction.improvement.uncertainty_delta.toFixed(3)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
