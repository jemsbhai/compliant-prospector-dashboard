"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProspectDetail } from "@/lib/api";
import type { ProspectResult } from "@/lib/types";
import { ComplianceBadge, MethodBadge } from "@/components/shared";
import ComplianceDetail from "@/components/ComplianceDetail";

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const index = Number(params.index);
  const [result, setResult] = useState<ProspectResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<"gemini" | "template" | "corrected">("gemini");

  useEffect(() => {
    async function load() {
      try {
        const data = await getProspectDetail(index);
        setResult(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (!isNaN(index)) load();
  }, [index]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || "Prospect not found"}</p>
        <button onClick={() => router.push("/")} className="mt-4 text-sm text-blue-400 hover:underline">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  const p = result.prospect;
  const activeMessage =
    showMessage === "corrected" && result.correction.corrected_message
      ? result.correction.corrected_message
      : showMessage === "template"
      ? result.template_message
      : result.gemini_message || result.template_message;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        ← Back to dashboard
      </button>

      {/* Prospect header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{p.name}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{p.current_role}</p>
          {p.location && <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.location}</p>}
          <div className="flex items-center gap-3 mt-3">
            <ComplianceBadge level={result.compliance_level} size="md" />
            {result.corrected_compliance_level && result.corrected_compliance_level !== result.compliance_level && (
              <>
                <span className="text-[var(--text-muted)]">→</span>
                <ComplianceBadge level={result.corrected_compliance_level} size="md" />
              </>
            )}
            <MethodBadge method={result.method} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{p.composite_score.toFixed(1)}</div>
            <div className="text-xs text-[var(--text-muted)]">Composite</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{p.icp_match_score}</div>
            <div className="text-xs text-[var(--text-muted)]">ICP Match</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{p.urgency_score}</div>
            <div className="text-xs text-[var(--text-muted)]">Urgency</div>
          </div>
        </div>
      </div>

      {/* Prospect context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Profile</h3>
          <div className="space-y-1 text-xs text-[var(--text-muted)]">
            <div>ICP: <span className="text-[var(--text-primary)]">{p.matched_icp.replace(/_/g, " ")}</span></div>
            {p.match_reasons.slice(0, 3).map((r, i) => (
              <div key={i}>• {r}</div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Why Now</h3>
          <div className="space-y-1 text-xs text-[var(--text-muted)]">
            {p.why_now_reasons.slice(0, 3).map((r, i) => (
              <div key={i}>• {r}</div>
            ))}
            {p.recommended_outreach_angle && (
              <div className="mt-2 text-[var(--text-secondary)]">
                Angle: {p.recommended_outreach_angle.slice(0, 150)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Outreach message */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Outreach Message</h3>
          <div className="flex gap-1">
            {result.gemini_message && (
              <button
                onClick={() => setShowMessage("gemini")}
                className={`px-2 py-0.5 rounded text-xs ${showMessage === "gemini" ? "bg-purple-500/15 text-purple-300" : "text-[var(--text-muted)]"}`}
              >
                ✦ Gemini
              </button>
            )}
            <button
              onClick={() => setShowMessage("template")}
              className={`px-2 py-0.5 rounded text-xs ${showMessage === "template" ? "bg-gray-500/15 text-gray-300" : "text-[var(--text-muted)]"}`}
            >
              Template
            </button>
            {result.correction.corrected_message && result.correction.corrected_message !== (result.gemini_message || result.template_message) && (
              <button
                onClick={() => setShowMessage("corrected")}
                className={`px-2 py-0.5 rounded text-xs ${showMessage === "corrected" ? "bg-emerald-500/15 text-emerald-300" : "text-[var(--text-muted)]"}`}
              >
                ✓ Corrected
              </button>
            )}
          </div>
        </div>
        <div className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed bg-[var(--bg-secondary)] p-4 rounded-lg font-mono text-xs">
          {activeMessage}
        </div>
      </div>

      {/* Template Self-Correction showcase */}
      {result.template_correction && result.template_correction.correction.corrections_applied.length > 0 && (
        <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <h3 className="text-sm font-semibold text-emerald-400 mb-4">
            ✨ Self-Correction Engine — Template Message
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            The compliance algebra detects flagged phrases and the self-correction engine automatically rewrites them to be compliant.
            Below shows the template message corrections with improvement deltas.
          </p>

          {/* Original template message */}
          <div className="mb-4">
            <div className="text-xs text-[var(--text-muted)] mb-1">Original Template Message:</div>
            <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-secondary)] p-3 rounded-lg font-mono">
              {result.template_correction.template_message}
            </div>
          </div>

          {/* Corrections */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                result.template_correction.correction.fully_resolved
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                {result.template_correction.correction.fully_resolved ? "✓ Fully Resolved" : "⚠ Partially Resolved"}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {result.template_correction.correction.corrections_applied.length} corrections · {result.template_correction.correction.iterations} iterations · {result.template_correction.correction.correction_method}
              </span>
            </div>
            {result.template_correction.correction.corrections_applied.map((step, i) => (
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

          {/* Corrected template message */}
          {result.template_correction.correction.corrected_message && (
            <div className="mb-4">
              <div className="text-xs text-emerald-400 mb-1">✓ Corrected Template Message:</div>
              <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-secondary)] p-3 rounded-lg font-mono">
                {result.template_correction.correction.corrected_message}
              </div>
            </div>
          )}

          {/* Improvement delta */}
          {result.template_correction.correction.improvement && (
            <div className="flex gap-4 text-xs font-mono p-2 rounded-lg bg-[var(--bg-secondary)]">
              <span className="text-[var(--text-muted)]">Improvement:</span>
              <span className={result.template_correction.correction.improvement.lawfulness_delta >= 0 ? "text-emerald-400" : "text-red-400"}>
                Δl={result.template_correction.correction.improvement.lawfulness_delta >= 0 ? "+" : ""}{result.template_correction.correction.improvement.lawfulness_delta.toFixed(3)}
              </span>
              <span className={result.template_correction.correction.improvement.violation_delta <= 0 ? "text-emerald-400" : "text-red-400"}>
                Δv={result.template_correction.correction.improvement.violation_delta >= 0 ? "+" : ""}{result.template_correction.correction.improvement.violation_delta.toFixed(3)}
              </span>
              <span className="text-amber-400">
                Δu={result.template_correction.correction.improvement.uncertainty_delta >= 0 ? "+" : ""}{result.template_correction.correction.improvement.uncertainty_delta.toFixed(3)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Full compliance detail */}
      <ComplianceDetail result={result} />

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-subtle)]">
        <span>Method: {result.method}</span>
        {result.gemini_regulations_analyzed && (
          <span>Gemini regs: {result.gemini_regulations_analyzed.join(", ")}</span>
        )}
        {result.gemini_api_calls && <span>API calls: {result.gemini_api_calls}</span>}
        <span>Timestamp: {new Date(result.timestamp * 1000).toLocaleString()}</span>
      </div>
    </div>
  );
}
