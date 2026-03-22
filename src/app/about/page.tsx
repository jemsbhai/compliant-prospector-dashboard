"use client";

import { OpinionBar, OpinionValues } from "@/components/shared";

const EXAMPLE_OPINIONS = {
  highConfidence: { l: 0.82, v: 0.08, u: 0.10, label: "Strong evidence of compliance, minor concern" },
  uncertain: { l: 0.30, v: 0.00, u: 0.70, label: "Weak evidence, mostly uncertain — NOT a violation" },
  violation: { l: 0.10, v: 0.70, u: 0.20, label: "Strong evidence of violation" },
  vacuous: { l: 0.00, v: 0.00, u: 1.00, label: "No evidence either way — vacuous opinion" },
};

function OpinionExample({ l, v, u, label }: { l: number; v: number; u: number; label: string }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
      <OpinionBar l={l} v={v} u={u} height={8} />
      <div className="flex items-center justify-between mt-2">
        <OpinionValues l={l} v={v} u={u} />
        <span className="text-xs text-[var(--text-muted)] italic">{label}</span>
      </div>
    </div>
  );
}

function JMeetDemo() {
  // FINRA: l=0.80, v=0.05, u=0.15
  // SEC: l=0.60, v=0.10, u=0.30
  // J⊓: l=0.48, v=0.145, u=0.375
  const finra = { l: 0.80, v: 0.05, u: 0.15 };
  const sec = { l: 0.60, v: 0.10, u: 0.30 };
  const meet = {
    l: finra.l * sec.l,
    v: finra.v + sec.v - finra.v * sec.v,
    u: (1 - finra.v) * (1 - sec.v) - finra.l * sec.l,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--text-muted)] w-16 shrink-0">FINRA</span>
        <div className="flex-1"><OpinionBar l={finra.l} v={finra.v} u={finra.u} height={6} /></div>
        <OpinionValues l={finra.l} v={finra.v} u={finra.u} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--text-muted)] w-16 shrink-0">SEC</span>
        <div className="flex-1"><OpinionBar l={sec.l} v={sec.v} u={sec.u} height={6} /></div>
        <OpinionValues l={sec.l} v={sec.v} u={sec.u} />
      </div>
      <div className="text-center text-xs text-blue-400 font-mono">J⊓(FINRA, SEC)</div>
      <div className="flex items-center gap-3 p-2 rounded-lg border border-blue-500/20 bg-blue-500/5">
        <span className="text-xs text-blue-400 w-16 shrink-0 font-medium">Result</span>
        <div className="flex-1"><OpinionBar l={meet.l} v={meet.v} u={meet.u} height={8} /></div>
        <OpinionValues l={meet.l} v={meet.v} u={meet.u} />
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Back */}
      <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        ← Back to dashboard
      </a>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">The Compliance Algebra</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Modeling Regulatory Uncertainty with Subjective Logic
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Syed, Silaghi, Abujar, Alssadi (2026) · Florida Institute of Technology
        </p>
      </div>

      {/* The Problem */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">The Problem: Binary Compliance is a Lie</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Regulatory compliance is conventionally modeled as binary: an outreach message either complies with FINRA Rule 2210 or it doesn&apos;t.
          But compliance officers know this is a simplification. A message might be &ldquo;probably compliant&rdquo; with one regulation but
          &ldquo;deeply uncertain&rdquo; about another. Binary models collapse these critical distinctions into a flat PASS/FAIL.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-500/20 bg-gray-500/5">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Binary System</h3>
            <div className="space-y-2 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>PASS — no uncertainty dimension</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-red-500" />
                <span>FAIL — no uncertainty dimension</span>
              </div>
              <p className="mt-2 italic">&ldquo;Probably compliant&rdquo; and &ldquo;no evidence&rdquo; both collapse to PASS.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <h3 className="text-xs font-bold text-blue-400 uppercase mb-2">Compliance Algebra</h3>
            <div className="space-y-2 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>Lawfulness (l) — evidence FOR compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-red-500" />
                <span>Violation (v) — evidence AGAINST compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span>Uncertainty (u) — what we DON&apos;T know</span>
              </div>
              <p className="mt-2 font-mono text-[var(--text-secondary)]">l + v + u = 1</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjective Logic */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Foundation: Subjective Logic</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The algebra is grounded in Jøsang&apos;s Subjective Logic (2016), which represents beliefs as
          <em> opinions</em> ω = (b, d, u, a) where belief + disbelief + uncertainty = 1. We relabel
          these for the compliance domain: <strong>l</strong> (lawfulness), <strong>v</strong> (violation),
          <strong>u</strong> (uncertainty), and <strong>a</strong> (base rate / prior probability of compliance).
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The key insight: uncertainty is not a failure of the model — it is <em>honest epistemic humility</em>.
          A compliance officer who says &ldquo;I&apos;m not sure&rdquo; is more informative than one who guesses PASS.
        </p>
        <div className="space-y-3">
          {Object.entries(EXAMPLE_OPINIONS).map(([key, op]) => (
            <OpinionExample key={key} l={op.l} v={op.v} u={op.u} label={op.label} />
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] italic">
          Notice: the second and fourth opinions would both be &ldquo;PASS&rdquo; in a binary system, but they represent
          fundamentally different epistemic states.
        </p>
      </section>

      {/* Five Operators */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Five Operators</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The algebra defines five domain-specific operators, each formally motivated by specific regulatory provisions:
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Jurisdictional Meet (J⊓)",
              desc: "Conjunction of compliance across multiple regulations. When a message must satisfy FINRA AND SEC AND CAN-SPAM simultaneously, J⊓ computes the composite opinion. Lawfulness multiplies (both must be lawful), violation accumulates (either can violate), uncertainty compounds.",
              section: "§5",
              used: true,
            },
            {
              name: "Compliance Propagation",
              desc: "How compliance uncertainty propagates through data derivation chains. If input data has uncertain compliance, derived outputs inherit that uncertainty via trust discounting.",
              section: "§6",
              used: false,
            },
            {
              name: "Consent Assessment",
              desc: "Composed operation for consent validity. Models the six conditions of valid consent as a conjunction, with withdrawal acting as an override that produces disbelief regardless of prior evidence.",
              section: "§7",
              used: false,
            },
            {
              name: "Temporal Decay",
              desc: "Compliance assessments grow stale over time. The decay function λ(t) = 2^(-t/half_life) shifts the opinion toward vacuity (pure uncertainty), modeling that old assessments carry less epistemic weight.",
              section: "§8",
              used: true,
            },
            {
              name: "Erasure Propagation",
              desc: "Scope and completeness of erasure across data lineage graphs. Models how deletion confidence propagates through derived datasets.",
              section: "§9",
              used: false,
            },
          ].map((op) => (
            <div key={op.name} className={`p-4 rounded-xl border ${op.used ? "border-blue-500/20 bg-blue-500/5" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"}`}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{op.name}</h3>
                <span className="text-xs text-[var(--text-muted)]">{op.section}</span>
                {op.used && (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">Used in ClearPath</span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{op.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* J⊓ Demo */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Jurisdictional Meet in Action</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          When a message is checked against both FINRA and SEC, the jurisdictional meet J⊓ computes the composite:
        </p>
        <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <JMeetDemo />
        </div>
        <div className="text-xs text-[var(--text-secondary)] space-y-1">
          <p><strong>Key properties (proven in the paper):</strong></p>
          <p>• <em>Monotonic restriction</em>: l_result ≤ min(l_FINRA, l_SEC) — adding regulations can only decrease lawfulness</p>
          <p>• <em>Monotonic violation</em>: v_result ≥ max(v_FINRA, v_SEC) — adding regulations can only increase violation evidence</p>
          <p>• <em>Uncertainty compounds</em>: the combined uncertainty reflects gaps in BOTH regulatory assessments</p>
        </div>
      </section>

      {/* How ClearPath Uses It */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">How ClearPath Uses the Algebra</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          ClearPath implements a two-level aggregation strategy:
        </p>
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <h3 className="text-xs font-bold text-emerald-400 uppercase mb-2">Within a Regulation: Weakest Link</h3>
            <p className="text-xs leading-relaxed">
              Each regulation has multiple rules (FINRA has 8, SEC has 6). Within a single regulation,
              compliance is determined by the <em>weakest gatekeeping rule</em> — you&apos;re only as compliant
              as your worst critical/major rule violation.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <h3 className="text-xs font-bold text-blue-400 uppercase mb-2">Across Regulations: Jurisdictional Meet J⊓</h3>
            <p className="text-xs leading-relaxed">
              When a message must comply with multiple regulations (FINRA + SEC + CAN-SPAM), the algebra&apos;s
              jurisdictional meet operator computes the composite opinion. The dashboard lets you toggle
              regulations on/off to see exactly how each one affects the composite.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <h3 className="text-xs font-bold text-amber-400 uppercase mb-2">Temporal Decay: Assessments Go Stale</h3>
            <p className="text-xs leading-relaxed">
              Every compliance check has a timestamp. Over time, the opinion decays toward pure uncertainty
              via λ(t) = 2^(-t/half_life). The dashboard shows freshness badges (FRESH → AGING → EXPIRED)
              and visualizes how the opinion bar shifts toward yellow over time.
            </p>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Citation</h2>
        <div className="text-xs text-[var(--text-muted)] font-mono leading-relaxed bg-[var(--bg-secondary)] p-3 rounded-lg">
          Syed, M., Silaghi, M., Abujar, S., & Alssadi, R. (2026). A Compliance Algebra: Modeling
          Regulatory Uncertainty with Subjective Logic. Florida Institute of Technology.
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          The algebra is implemented as part of <a href="https://github.com" className="text-blue-400 hover:underline">jsonld-ex</a>,
          an open-source Python library extending JSON-LD with assertion-level confidence grounded in Subjective Logic.
        </p>
      </section>
    </div>
  );
}
