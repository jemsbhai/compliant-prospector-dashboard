"use client";

import { useState } from "react";
import type { ProspectSummary } from "@/lib/types";
import { ComplianceBadge, OpinionBar, MethodBadge } from "./shared";

interface ProspectTableProps {
  prospects: ProspectSummary[];
  onSelect: (index: number) => void;
}

export default function ProspectTable({ prospects, onSelect }: ProspectTableProps) {
  const [sortBy, setSortBy] = useState<string>("composite_score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [complianceFilter, setComplianceFilter] = useState<string>("");

  const filtered = prospects.filter((p) => {
    if (complianceFilter && p.compliance_level !== complianceFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!p.name.toLowerCase().includes(s) && !p.current_role.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: number | string, bv: number | string;
    if (sortBy === "name") {
      av = a.name.toLowerCase();
      bv = b.name.toLowerCase();
    } else {
      av = (a as any)[sortBy] ?? 0;
      bv = (b as any)[sortBy] ?? 0;
    }
    if (av < bv) return sortOrder === "asc" ? -1 : 1;
    if (av > bv) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortOrder("desc"); }
  };

  const SortHeader = ({ col, label, className }: { col: string; label: string; className?: string }) => (
    <th
      className={`px-3 py-2.5 text-left text-xs font-medium text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] select-none ${className || ""}`}
      onClick={() => toggleSort(col)}
    >
      {label} {sortBy === col && (sortOrder === "desc" ? "↓" : "↑")}
    </th>
  );

  const complianceLevels = Array.from(new Set(prospects.map(p => p.compliance_level)));

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 w-64"
        />
        <select
          value={complianceFilter}
          onChange={(e) => setComplianceFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
        >
          <option value="">All Compliance Levels</option>
          {complianceLevels.map(l => (
            <option key={l} value={l}>{l.replace(/_/g, " ")}</option>
          ))}
        </select>
        <span className="text-xs text-[var(--text-muted)] self-center ml-2">
          {filtered.length} of {prospects.length} prospects
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <SortHeader col="name" label="Prospect" className="min-w-[200px]" />
                <SortHeader col="composite_score" label="Score" />
                <SortHeader col="compliance_level" label="Compliance" />
                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-muted)]">Corrected</th>
                <SortHeader col="icp_match_score" label="ICP" />
                <SortHeader col="urgency_score" label="Urgency" />
                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-muted)]">ICP Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--text-muted)]">Method</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr
                  key={p.index}
                  onClick={() => onSelect(p.index)}
                  className="border-t border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] cursor-pointer transition-colors"
                >
                  <td className="px-3 py-3">
                    <div className="font-medium text-sm text-[var(--text-primary)]">{p.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5 truncate max-w-[250px]">{p.current_role}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-semibold text-blue-400">{p.composite_score.toFixed(1)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <ComplianceBadge level={p.compliance_level} size="sm" />
                  </td>
                  <td className="px-3 py-3">
                    {p.corrected_compliance_level ? (
                      <ComplianceBadge level={p.corrected_compliance_level} size="sm" />
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-[var(--text-secondary)]">{p.icp_match_score}</td>
                  <td className="px-3 py-3 text-sm text-[var(--text-secondary)]">{p.urgency_score}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-[var(--text-muted)]">{p.matched_icp.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-3 py-3">
                    <MethodBadge method={p.method} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
