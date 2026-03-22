"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProspects, getProspectDetail } from "@/lib/api";
import type { ProspectSummary } from "@/lib/types";
import { useApp } from "@/lib/context";
import { ComplianceBadge } from "@/components/shared";

type SortField = "composite_score" | "icp_match_score" | "urgency_score" | "name";

export default function AdvisorPage() {
  const { role, reviewQueue, submitForReview } = useApp();
  const router = useRouter();
  const [prospects, setProspects] = useState<ProspectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("composite_score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [sendingIndex, setSendingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedData, setExpandedData] = useState<any>(null);

  useEffect(() => {
    if (role !== "advisor") { router.push("/"); return; }
    getProspects({ per_page: 200 })
      .then(setProspects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [role, router]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("desc"); }
  };

  const filtered = prospects.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.current_role.toLowerCase().includes(s);
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = sortBy === "name" ? a.name.toLowerCase() : (a as any)[sortBy] ?? 0;
    const bv = sortBy === "name" ? b.name.toLowerCase() : (b as any)[sortBy] ?? 0;
    if (av < bv) return sortOrder === "asc" ? -1 : 1;
    if (av > bv) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getReviewStatus = (name: string) => {
    const match = reviewQueue.find(r => r.prospectName === name);
    return match || null;
  };

  const handleSendForReview = async (p: ProspectSummary) => {
    setSendingIndex(p.index);
    try {
      const detail = await getProspectDetail(p.index);
      const message = detail.gemini_message || detail.template_message;
      submitForReview({
        prospectIndex: p.index,
        prospectName: p.name,
        prospectRole: p.current_role,
        message,
      });
    } catch (e: any) {
      alert("Failed to load prospect: " + e.message);
    }
    setSendingIndex(null);
  };

  const handleExpand = async (index: number) => {
    if (expandedIndex === index) { setExpandedIndex(null); setExpandedData(null); return; }
    setExpandedIndex(index);
    try {
      const data = await getProspectDetail(index);
      setExpandedData(data);
    } catch { setExpandedData(null); }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    flagged: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        sortBy === field
          ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
          : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
      }`}
    >
      {label} {sortBy === field && (sortOrder === "desc" ? "↓" : "↑")}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-400">{error}</div>;
  }

  const pendingCount = reviewQueue.filter(r => r.status === "pending").length;
  const approvedCount = reviewQueue.filter(r => r.status === "approved").length;
  const flaggedCount = reviewQueue.filter(r => r.status === "flagged").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Prospects</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Rank prospects by fit, review outreach messages, and submit for compliance review.
        </p>
      </div>

      {/* Status summary */}
      <div className="flex gap-4">
        <div className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-center">
          <div className="text-lg font-bold text-[var(--text-primary)]">{prospects.length}</div>
          <div className="text-xs text-[var(--text-muted)]">Prospects</div>
        </div>
        <div className="px-4 py-2 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
          <div className="text-lg font-bold text-amber-400">{pendingCount}</div>
          <div className="text-xs text-[var(--text-muted)]">Pending Review</div>
        </div>
        <div className="px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-lg font-bold text-emerald-400">{approvedCount}</div>
          <div className="text-xs text-[var(--text-muted)]">Approved</div>
        </div>
        {flaggedCount > 0 && (
          <div className="px-4 py-2 rounded-xl border border-orange-500/20 bg-orange-500/5 text-center">
            <div className="text-lg font-bold text-orange-400">{flaggedCount}</div>
            <div className="text-xs text-[var(--text-muted)]">Flagged</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 w-64"
        />
        <span className="text-xs text-[var(--text-muted)]">Rank by:</span>
        <SortBtn field="composite_score" label="Composite" />
        <SortBtn field="icp_match_score" label="ICP Match" />
        <SortBtn field="urgency_score" label="Urgency" />
        <SortBtn field="name" label="Name" />
        <span className="text-xs text-[var(--text-muted)] ml-auto">{filtered.length} prospects</span>
      </div>

      {/* Prospect cards */}
      <div className="space-y-3">
        {sorted.map((p, rank) => {
          const review = getReviewStatus(p.name);
          const isExpanded = expandedIndex === p.index;

          return (
            <div key={p.index} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] card-glow overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-sm font-bold text-[var(--text-muted)] shrink-0">
                  {rank + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleExpand(p.index)}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[var(--text-primary)]">{p.name}</span>
                    <ComplianceBadge level={p.compliance_level} size="sm" />
                    {review && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[review.status]}`}>
                        {review.status === "pending" ? "⏳ Pending" : review.status === "approved" ? "✓ Approved" : review.status === "flagged" ? "⚠ Flagged" : "✕ Rejected"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{p.current_role}</div>
                </div>

                {/* Scores */}
                <div className="flex gap-4 shrink-0">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-400">{p.composite_score.toFixed(1)}</div>
                    <div className="text-xs text-[var(--text-muted)]">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-[var(--text-secondary)]">{p.icp_match_score}</div>
                    <div className="text-xs text-[var(--text-muted)]">ICP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-[var(--text-secondary)]">{p.urgency_score}</div>
                    <div className="text-xs text-[var(--text-muted)]">Urgency</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleExpand(p.index)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {isExpanded ? "Close" : "Preview"}
                  </button>
                  {!review ? (
                    <button
                      onClick={() => handleSendForReview(p)}
                      disabled={sendingIndex === p.index}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
                    >
                      {sendingIndex === p.index ? "..." : "Send for Review"}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/prospect/${p.index}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] text-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      View Detail
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded preview */}
              {isExpanded && expandedData && (
                <div className="border-t border-[var(--border-subtle)] p-4 bg-[var(--bg-secondary)]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-1">ICP Profile</div>
                      <div className="text-xs text-[var(--text-secondary)]">{expandedData.prospect.matched_icp.replace(/_/g, " ")}</div>
                      {expandedData.prospect.match_reasons.slice(0, 2).map((r: string, i: number) => (
                        <div key={i} className="text-xs text-[var(--text-muted)] mt-0.5">• {r}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-1">Outreach Angle</div>
                      <div className="text-xs text-[var(--text-secondary)]">{expandedData.prospect.recommended_outreach_angle?.slice(0, 200)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">Outreach Message</div>
                    <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-primary)] p-3 rounded-lg font-mono">
                      {expandedData.gemini_message || expandedData.template_message}
                    </div>
                  </div>
                  {review?.status !== "pending" && review?.notes && (
                    <div className="mt-3 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                      <div className="text-xs text-[var(--text-muted)] mb-1">Compliance Officer Notes:</div>
                      <div className="text-xs text-[var(--text-primary)]">{review.notes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
