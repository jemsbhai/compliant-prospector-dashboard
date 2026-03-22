"use client";

import { COMPLIANCE_COLORS, COMPLIANCE_LABELS } from "@/lib/types";

export function ComplianceBadge({ level, size = "md" }: { level: string; size?: "sm" | "md" | "lg" }) {
  const colors = COMPLIANCE_COLORS[level] || COMPLIANCE_COLORS.UNKNOWN;
  const label = COMPLIANCE_LABELS[level] || level;
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}

export function OpinionBar({ l, v, u, height = 8 }: { l: number; v: number; u: number; height?: number }) {
  const total = l + v + u;
  const lPct = total > 0 ? (l / total) * 100 : 0;
  const vPct = total > 0 ? (v / total) * 100 : 0;
  const uPct = total > 0 ? (u / total) * 100 : 100;

  return (
    <div className="w-full rounded-full overflow-hidden flex" style={{ height }}>
      {lPct > 0 && (
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${lPct}%` }}
          title={`Lawfulness: ${(l * 100).toFixed(1)}%`}
        />
      )}
      {vPct > 0 && (
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${vPct}%` }}
          title={`Violation: ${(v * 100).toFixed(1)}%`}
        />
      )}
      {uPct > 0 && (
        <div
          className="bg-amber-500/60 transition-all"
          style={{ width: `${uPct}%` }}
          title={`Uncertainty: ${(u * 100).toFixed(1)}%`}
        />
      )}
    </div>
  );
}

export function OpinionValues({ l, v, u }: { l: number; v: number; u: number }) {
  return (
    <div className="flex gap-4 text-xs font-mono">
      <span className="text-emerald-400">l={l.toFixed(2)}</span>
      <span className="text-red-400">v={v.toFixed(2)}</span>
      <span className="text-amber-400">u={u.toFixed(2)}</span>
    </div>
  );
}

export function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 card-glow">
      <div className="text-xs text-[var(--text-muted)] mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color || "text-[var(--text-primary)]"}`}>{value}</div>
      {sub && <div className="text-xs text-[var(--text-secondary)] mt-1">{sub}</div>}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    major: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    minor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    advisory: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`inline-flex text-xs px-1.5 py-0.5 rounded border font-medium ${colors[severity] || colors.advisory}`}>
      {severity}
    </span>
  );
}

export function MethodBadge({ method }: { method: string }) {
  const isGemini = method.includes("gemini");
  return (
    <span className={`inline-flex text-xs px-2 py-0.5 rounded font-medium ${
      isGemini
        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
    }`}>
      {isGemini ? "✦ Gemini" : "Regex"}
    </span>
  );
}

export function FreshnessBadge({ freshness }: { freshness: string }) {
  const colors: Record<string, string> = {
    FRESH: "text-emerald-400",
    RECENT: "text-green-400",
    AGING: "text-yellow-400",
    STALE: "text-orange-400",
    EXPIRED: "text-red-400",
  };
  return <span className={`text-xs font-medium ${colors[freshness] || "text-gray-400"}`}>{freshness}</span>;
}
