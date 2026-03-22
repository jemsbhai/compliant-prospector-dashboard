"use client";

import type { StatsResponse } from "@/lib/types";
import { StatCard, ComplianceBadge } from "./shared";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PIE_COLORS: Record<string, string> = {
  HIGH_CONFIDENCE_COMPLIANT: "#10b981",
  LIKELY_COMPLIANT: "#22c55e",
  NEEDS_REVIEW: "#f59e0b",
  INSUFFICIENT_EVIDENCE: "#f97316",
  NON_COMPLIANT: "#ef4444",
  UNKNOWN: "#6b7280",
};

export default function StatsOverview({ stats }: { stats: StatsResponse }) {
  const distData = Object.entries(stats.compliance_distribution).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
    fill: PIE_COLORS[name] || "#6b7280",
  }));

  const correctedData = stats.corrected_distribution
    ? Object.entries(stats.corrected_distribution).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
        fill: PIE_COLORS[name] || "#6b7280",
      }))
    : null;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Prospects" value={stats.total_prospects} sub={stats.data_source} />
        <StatCard label="Avg Composite Score" value={stats.avg_composite_score} color="text-blue-400" />
        <StatCard
          label="Needs Review"
          value={stats.needs_review_count}
          sub={`${((stats.needs_review_count / stats.total_prospects) * 100).toFixed(0)}% of total`}
          color="text-amber-400"
        />
        <StatCard
          label="Regulations"
          value={stats.regulations_available.length}
          sub={`${stats.combos_available.length} combos`}
        />
      </div>

      {/* Distribution charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original distribution */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">Original Compliance Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" strokeWidth={0}>
                    {distData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1a2235", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "#f3f4f6" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {distData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm" style={{ background: d.fill }} />
                  <span className="text-[var(--text-secondary)]">{d.name}</span>
                  <span className="font-semibold text-[var(--text-primary)] ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Corrected distribution */}
        {correctedData && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
              After Self-Correction
              <span className="ml-2 text-xs text-emerald-400 font-normal">✓ Corrected</span>
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={correctedData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" strokeWidth={0}>
                      {correctedData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1a2235", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }}
                      itemStyle={{ color: "#f3f4f6" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                {correctedData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm" style={{ background: d.fill }} />
                    <span className="text-[var(--text-secondary)]">{d.name}</span>
                    <span className="font-semibold text-[var(--text-primary)] ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
