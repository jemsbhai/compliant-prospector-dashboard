"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStats, getProspects } from "@/lib/api";
import type { StatsResponse, ProspectSummary } from "@/lib/types";
import StatsOverview from "@/components/StatsOverview";
import ProspectTable from "@/components/ProspectTable";

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [prospects, setProspects] = useState<ProspectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, p] = await Promise.all([
          getStats(),
          getProspects({ per_page: 200 }),
        ]);
        setStats(s);
        setProspects(p);
      } catch (e: any) {
        setError(e.message || "Failed to connect to API");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--text-muted)]">Loading prospect data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto text-xl">
            ✕
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Connection Error</h2>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
          <p className="text-xs text-[var(--text-muted)]">
            Make sure the FastAPI backend is running at {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Compliance Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          FINRA/SEC-compliant prospecting powered by the Compliance Algebra — Subjective Logic opinions, jurisdictional meet J⊓, and temporal decay.
        </p>
      </div>

      {/* Stats */}
      {stats && <StatsOverview stats={stats} />}

      {/* Prospect table */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Prospects</h2>
        <ProspectTable
          prospects={prospects}
          onSelect={(index) => router.push(`/prospect/${index}`)}
        />
      </div>
    </div>
  );
}
