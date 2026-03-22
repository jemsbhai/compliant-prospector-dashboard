"use client";

import { useState } from "react";
import type { ProspectResult, ComboResult, AlgebraShowcase } from "@/lib/types";
import { ComplianceBadge, OpinionBar, OpinionValues, SeverityBadge, FreshnessBadge } from "./shared";

// ═══════════════════════════════════════════════════════════════
// REGULATION COMBO SELECTOR
// ═══════════════════════════════════════════════════════════════

function ComboSelector({
  combos,
  selected,
  onSelect,
}: {
  combos: Record<string, ComboResult>;
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(combos).map(([name, combo]) => {
        const isActive = name === selected;
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isActive
                ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
            }`}
          >
            <span>{name.replace(/_/g, " ")}</span>
            <span className="ml-2 opacity-60">({combo.regulation_ids.length})</span>
            {combo.uses_gemini && <span className="ml-1 text-purple-400">✦</span>}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PER-RULE AUDIT TRAIL
// ═══════════════════════════════════════════════════════════════

function RuleCard({ rule }: { rule: any }) {
  const [expanded, setExpanded] = useState(false);
  const o = rule.opinion;
  const isGemini = rule.explanation?.startsWith("[Gemini]");

  return (
    <div
      className="border border-[var(--border-subtle)] rounded-lg p-3 card-glow cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <SeverityBadge severity={rule.severity} />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{rule.rule_name}</span>
          {isGemini && <span className="text-xs text-purple-400">✦</span>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <OpinionValues l={o.lawfulness} v={o.violation} u={o.uncertainty} />
          <span className="text-[var(--text-muted)] text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      <div className="mt-2">
        <OpinionBar l={o.lawfulness} v={o.violation} u={o.uncertainty} height={4} />
      </div>
      {expanded && (
        <div className="mt-3 space-y-2 text-xs">
          <div className="text-[var(--text-secondary)] leading-relaxed">{rule.explanation}</div>
          {rule.flagged_phrases.length > 0 && (
            <div>
              <span className="text-red-400 font-medium">Flagged: </span>
              {rule.flagged_phrases.map((p: string, i: number) => (
                <span key={i} className="inline-block bg-red-500/10 text-red-300 px-1.5 py-0.5 rounded mr-1 mb-1">
                  &quot;{p}&quot;
                </span>
              ))}
            </div>
          )}
          {rule.suggested_fixes.length > 0 && (
            <div>
              <span className="text-emerald-400 font-medium">Fixes: </span>
              {rule.suggested_fixes.map((f: string, i: number) => (
                <span key={i} className="inline-block bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded mr-1 mb-1">
                  {f}
                </span>
              ))}
            </div>
          )}
          <div className="text-[var(--text-muted)]">
            Rule: {rule.rule_id} · Regulation: {rule.regulation} · Gatekeeping: {rule.is_gatekeeping ? "Yes" : "No"}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// J⊓ STEP-BY-STEP VISUALIZATION
// ═══════════════════════════════════════════════════════════════

function JMeetVisualization({ showcase }: { showcase: AlgebraShowcase }) {
  const steps = showcase.jurisdictional_meet_steps;
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-[var(--text-secondary)]">
        Jurisdictional Meet J⊓ — Step by Step
      </h4>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.step} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-secondary)]">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
              {step.step}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-[var(--text-muted)] mb-1 font-mono">{step.operation}</div>
              <OpinionBar l={step.result.lawfulness} v={step.result.violation} u={step.result.uncertainty} height={4} />
            </div>
            <div className="shrink-0">
              <OpinionValues l={step.result.lawfulness} v={step.result.violation} u={step.result.uncertainty} />
            </div>
            {step.properties && (
              <div className="shrink-0 flex gap-1">
                {step.properties.monotonic_restriction && (
                  <span className="text-xs px-1 rounded bg-emerald-500/10 text-emerald-400" title="Monotonic restriction satisfied">✓ MR</span>
                )}
                {step.properties.monotonic_violation && (
                  <span className="text-xs px-1 rounded bg-emerald-500/10 text-emerald-400" title="Monotonic violation satisfied">✓ MV</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ALGEBRA vs BINARY COMPARISON
// ═══════════════════════════════════════════════════════════════

function AlgebraVsBinary({ showcase }: { showcase: AlgebraShowcase }) {
  const comp = showcase.comparison;
  const algebraO = comp.algebra.overall;
  const binaryO = comp.binary.overall;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border border-blue-500/20 rounded-xl p-4 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-blue-400 uppercase">Compliance Algebra</span>
          <ComplianceBadge level={comp.algebra.compliance_level} size="sm" />
        </div>
        <OpinionBar l={algebraO.lawfulness} v={algebraO.violation} u={algebraO.uncertainty} height={10} />
        <div className="mt-2">
          <OpinionValues l={algebraO.lawfulness} v={algebraO.violation} u={algebraO.uncertainty} />
        </div>
      </div>

      <div className="border border-gray-500/20 rounded-xl p-4 bg-gray-500/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase">Binary Pass/Fail</span>
          <ComplianceBadge level={comp.binary.compliance_level === "COMPLIANT" ? "HIGH_CONFIDENCE_COMPLIANT" : "NON_COMPLIANT"} size="sm" />
        </div>
        <OpinionBar l={binaryO.lawfulness} v={binaryO.violation} u={0} height={10} />
        <div className="mt-2 text-xs font-mono text-[var(--text-muted)]">
          {comp.binary.compliance_level} — no uncertainty dimension
        </div>
      </div>

      {comp.key_differences.length > 0 && (
        <div className="md:col-span-2 text-xs text-[var(--text-secondary)] space-y-1">
          {comp.key_differences.map((diff, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-amber-400">⚡</span>
              <span>{diff}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEMPORAL DECAY
// ═══════════════════════════════════════════════════════════════

function TemporalDecay({ showcase }: { showcase: AlgebraShowcase }) {
  const snapshots = showcase.temporal_decay;
  if (!snapshots || snapshots.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-[var(--text-secondary)]">Temporal Decay (§8 of Algebra)</h4>
      <div className="grid grid-cols-5 gap-2">
        {snapshots.map((s) => (
          <div key={s.label} className="p-2 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs font-medium text-[var(--text-primary)] mb-1">{s.label}</div>
            <OpinionBar l={s.opinion.lawfulness} v={s.opinion.violation} u={s.opinion.uncertainty} height={4} />
            <div className="mt-1">
              <FreshnessBadge freshness={s.freshness} />
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
              λ={s.decay_factor.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CORRECTION DIFF VIEW
// ═══════════════════════════════════════════════════════════════

function CorrectionDiff({ correction }: { correction: ProspectResult["correction"] }) {
  if (!correction.corrections_applied || correction.corrections_applied.length === 0) {
    return (
      <div className="text-sm text-[var(--text-muted)] italic">
        No corrections needed — message is already compliant.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          correction.fully_resolved
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}>
          {correction.fully_resolved ? "✓ Fully Resolved" : "⚠ Partially Resolved"}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {correction.corrections_applied.length} corrections · {correction.iterations} iterations · {correction.correction_method}
        </span>
      </div>

      {/* Correction steps */}
      <div className="space-y-2">
        {correction.corrections_applied.map((step, i) => (
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
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPLIANCE DETAIL PANEL
// ═══════════════════════════════════════════════════════════════

export default function ComplianceDetail({ result }: { result: ProspectResult }) {
  const [selectedCombo, setSelectedCombo] = useState("FINRA_SEC_CANSPAM");
  const [showCorrected, setShowCorrected] = useState(false);

  const combos = showCorrected && result.corrected_regulation_combos
    ? result.corrected_regulation_combos
    : result.regulation_combos;

  const currentCombo = combos[selectedCombo];
  const showcase = currentCombo?.algebra_showcase;

  if (!currentCombo || !showcase) {
    return <div className="text-[var(--text-muted)]">No data for combo: {selectedCombo}</div>;
  }

  // Group rules by regulation
  const rulesByReg: Record<string, any[]> = {};
  for (const rule of showcase.per_rule_opinions) {
    if (!rulesByReg[rule.regulation]) rulesByReg[rule.regulation] = [];
    rulesByReg[rule.regulation].push(rule);
  }

  return (
    <div className="space-y-6">
      {/* Toggle: Original vs Corrected */}
      {result.corrected_regulation_combos && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <span className="text-xs text-[var(--text-muted)]">Viewing:</span>
          <button
            onClick={() => setShowCorrected(false)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              !showCorrected ? "bg-blue-500/15 text-blue-300 border border-blue-500/40" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Original Message
          </button>
          <button
            onClick={() => setShowCorrected(true)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              showCorrected ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            ✓ Corrected Message
          </button>
        </div>
      )}

      {/* Regulation combo selector */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Regulation Combination</h3>
        <ComboSelector combos={combos} selected={selectedCombo} onSelect={setSelectedCombo} />
      </div>

      {/* Overall result */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <ComplianceBadge level={currentCombo.compliance_level} size="lg" />
            <span className="text-sm text-[var(--text-muted)]">
              {currentCombo.regulation_ids.join(" + ")}
            </span>
          </div>
        </div>
        <OpinionBar
          l={showcase.algebra_overall.lawfulness}
          v={showcase.algebra_overall.violation}
          u={showcase.algebra_overall.uncertainty}
          height={12}
        />
        <div className="mt-2">
          <OpinionValues
            l={showcase.algebra_overall.lawfulness}
            v={showcase.algebra_overall.violation}
            u={showcase.algebra_overall.uncertainty}
          />
        </div>
      </div>

      {/* Algebra vs Binary */}
      <AlgebraVsBinary showcase={showcase} />

      {/* J⊓ Steps */}
      <JMeetVisualization showcase={showcase} />

      {/* Regulation breakdown with weakest link */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--text-secondary)]">Per-Regulation Breakdown</h4>
        {Object.entries(showcase.regulation_details).map(([regId, detail]) => (
          <div key={regId} className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--text-primary)]">{regId}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${detail.binary_result === "PASS" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  Binary: {detail.binary_result}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {detail.gatekeeping_rules}/{detail.total_rules} gatekeeping
                </span>
              </div>
            </div>
            <OpinionBar l={detail.composite_opinion.lawfulness} v={detail.composite_opinion.violation} u={detail.composite_opinion.uncertainty} height={6} />
            {detail.weakest_link.rule_id && (
              <div className="mt-2 text-xs text-amber-400">
                ⚠ Weakest link: {detail.weakest_link.rule_name} ({detail.weakest_link.rule_id})
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Per-rule audit trail */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--text-secondary)]">Per-Rule Audit Trail</h4>
        {Object.entries(rulesByReg).map(([regId, rules]) => (
          <div key={regId}>
            <h5 className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">{regId}</h5>
            <div className="space-y-2">
              {rules.map((rule) => (
                <RuleCard key={rule.rule_id} rule={rule} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Temporal decay */}
      <TemporalDecay showcase={showcase} />

      {/* Self-correction diff */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--text-secondary)]">Self-Correction</h4>
        <CorrectionDiff correction={result.correction} />
      </div>
    </div>
  );
}
