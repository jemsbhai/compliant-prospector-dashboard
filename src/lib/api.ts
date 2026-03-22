// ═══════════════════════════════════════════════════════════════
// API Client — talks to the FastAPI backend
// ═══════════════════════════════════════════════════════════════

import type { ProspectSummary, ProspectResult, StatsResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }
  return res.json();
}

export async function getStats(): Promise<StatsResponse> {
  return fetchAPI<StatsResponse>("/api/stats");
}

export async function getProspects(params?: {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: string;
  compliance_filter?: string;
  icp_filter?: string;
  search?: string;
}): Promise<ProspectSummary[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params?.sort_order) searchParams.set("sort_order", params.sort_order);
  if (params?.compliance_filter) searchParams.set("compliance_filter", params.compliance_filter);
  if (params?.icp_filter) searchParams.set("icp_filter", params.icp_filter);
  if (params?.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  return fetchAPI<ProspectSummary[]>(`/api/prospects${qs ? `?${qs}` : ""}`);
}

export async function getProspectDetail(index: number): Promise<ProspectResult> {
  return fetchAPI<ProspectResult>(`/api/prospects/${index}`);
}

export async function getHealth(): Promise<{ status: string; data_source: string; prospects_loaded: number }> {
  return fetchAPI("/api/health");
}
