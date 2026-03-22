"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStats, getProspects } from "@/lib/api";
import type { StatsResponse, ProspectSummary } from "@/lib/types";
import { useApp, ReviewRequest } from "@/lib/context";
import StatsOverview from "@/components/StatsOverview";
import ProspectTable from "@/components/ProspectTable";
import { ComplianceBadge } from "@/components/shared";

function ReviewQueue() {
  const { reviewQueue, updateReview } = useApp();
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const pending = reviewQueue.filter(r => r.status === "pending");
  const reviewed = reviewQueue.filter(r => r.status !== "pending");

  if (reviewQueue.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-[var(--border-accent)] bg-[var(--bg-card)] text-center">
        <p className="text-sm text-[var(--text-muted)]">
          No submissions from the Financial Advisor yet.
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          When the advisor submits prospects for review, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  const handleAction = (id: string, status: ReviewRequest["status"]) => {
    const notes = notesMap[id] || "";
    updateReview(id, status, notes);
  };

  return (
    <div className="space-y-4">
      {/* Pending reviews */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-amber-400">
            ⏳ Pending Reviews ({pending.length})
          </h3>
          {pending.map(req => (
            <div key={req.id} className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm text-[var(--text-primary)]">{req.prospectName}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">{req.prospectRole}</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(req.submittedAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-secondary)] p-3 rounded-lg font-mono max-h-40 overflow-y-auto">
                {req.message}
              </div>

              <textarea
                placeholder="Add compliance notes (optional)..."
                value={notesMap[req.id] || ""}
                onChange={(e) => setNotesMap(prev => ({ ...prev, [req.id]: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)] p-2 placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req.id, "approved")}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleAction(req.id, "flagged")}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-600 text-white hover:bg-amber-500 transition-colors"
                >
                  ⚠ Flag for Revision
                </button>
                <button
                  onClick={() => handleAction(req.id, "rejected")}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-red-600/80 text-white hover:bg-red-500 transition-colors"
                >
                  ✕ Reject
                </button>
                <a
                  href={`/prospect/${req.prospectIndex}`}
                  className="ml-auto px-4 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  Full Audit →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">
            Reviewed ({reviewed.length})
          </h3>
          {reviewed.map(req => {
            const colors: Record<string, string> = {
              approved: "border-emerald-500/20 bg-emerald-500/5",
              flagged: "border-orange-500/20 bg-orange-500/5",
              rejected: "border-red-500/20 bg-red-500/5",
            };
            const labels: Record<string, string> = {
              approved: "✓ Approved",
              flagged: "⚠ Flagged",
              rejected: "✕ Rejected",
            };
            return (
              <div key={req.id} className={`p-3 rounded-xl border ${colors[req.status] || ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{req.prospectName}</span>
                    <span className={`text-xs font-medium ${req.status === "approved" ? "text-emerald-400" : req.status === "flagged" ? "text-orange-400" : "text-red-400"}`}>
                      {labels[req.status]}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {req.reviewedAt ? new Date(req.reviewedAt).toLocaleTimeString() : ""}
                  </span>
                </div>
                {req.notes && (
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Notes: {req.notes}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CompliancePage() {
  const { role } = useApp();
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [prospects, setProspects] = useState<ProspectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "reviews">("reviews");

  useEffect(() => {
    if (role !== "compliance") { router.push("/"); return; }
    Promise.all([getStats(), getProspects({ per_page: 200 })])
      .then(([s, p]) => { setStats(s); setProspects(p); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [role, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <p className="text-xs text-[var(--text-muted)] mt-2">Backend: {process.env.NEXT_PUBLIC_API_URL}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Compliance Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            FINRA/SEC-compliant prospecting powered by the Compliance Algebra.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-[var(--border-subtle)] overflow-hidden">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "reviews"
                ? "bg-amber-500/15 text-amber-300"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Advisor Submissions
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-blue-500/15 text-blue-300"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Full Dashboard
          </button>
        </div>
      </div>

      {activeTab === "reviews" ? (
        <ReviewQueue />
      ) : (
        <>
          {stats && <StatsOverview stats={stats} />}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">All Prospects</h2>
            <ProspectTable
              prospects={prospects}
              onSelect={(index) => router.push(`/prospect/${index}`)}
            />
          </div>
        </>
      )}
    </div>
  );
}
