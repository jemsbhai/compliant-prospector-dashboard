// ═══════════════════════════════════════════════════════════════
// TypeScript types matching the FastAPI backend data structures
// ═══════════════════════════════════════════════════════════════

export interface Opinion {
  lawfulness: number;
  violation: number;
  uncertainty: number;
  base_rate: number;
  projected_probability?: number;
  compliance_level?: string;
}

export interface RuleOpinion {
  rule_id: string;
  rule_name: string;
  regulation: string;
  severity: string;
  opinion: Opinion;
  explanation: string;
  flagged_phrases: string[];
  suggested_fixes: string[];
  is_gatekeeping: boolean;
}

export interface WeakestLink {
  rule_id: string | null;
  rule_name: string | null;
  opinion: Opinion | null;
  explanation: string | null;
}

export interface RegulationDetail {
  regulation_id: string;
  total_rules: number;
  gatekeeping_rules: number;
  composite_opinion: Opinion;
  weakest_link: WeakestLink;
  binary_result: string;
  binary_failures: string[];
}

export interface JMeetStep {
  step: number;
  operation: string;
  input_a: Opinion | null;
  input_b: Opinion | null;
  result: Opinion;
  properties?: {
    monotonic_restriction: boolean;
    monotonic_violation: boolean;
  };
}

export interface DecaySnapshot {
  label: string;
  hours: number;
  opinion: Opinion;
  freshness: string;
  decay_factor: number;
}

export interface AlgebraShowcase {
  per_rule_opinions: RuleOpinion[];
  regulation_details: Record<string, RegulationDetail>;
  jurisdictional_meet_steps: JMeetStep[];
  algebra_overall: Opinion;
  binary_overall: {
    result: string;
    opinion: { lawfulness: number; violation: number; uncertainty: number };
    failing_regulations: string[];
  };
  temporal_decay: DecaySnapshot[];
  comparison: {
    algebra: { overall: Opinion; compliance_level: string };
    binary: { overall: { lawfulness: number; violation: number; uncertainty: number }; compliance_level: string };
    key_differences: string[];
  };
}

export interface ComboResult {
  regulation_ids: string[];
  compliance_level: string;
  binary_level: string;
  uses_gemini?: boolean;
  algebra_showcase: AlgebraShowcase;
}

export interface CorrectionStep {
  original: string;
  replacement: string;
  rule_id: string;
  rule_name: string;
  method: string;
}

export interface CorrectionResult {
  original_message: string;
  corrected_message: string | null;
  corrections_applied: CorrectionStep[];
  iterations: number;
  fully_resolved: boolean;
  correction_method: string;
  improvement: {
    lawfulness_delta: number;
    violation_delta: number;
    uncertainty_delta: number;
  } | null;
}

export interface Prospect {
  name: string;
  current_role: string;
  location: string;
  linkedin_url: string;
  icp_match_score: number;
  urgency_score: number;
  composite_score: number;
  matched_icp: string;
  recommended_outreach_angle: string;
  match_reasons: string[];
  why_now_reasons: string[];
  concerns: string[];
}

export interface ProspectResult {
  prospect: Prospect;
  template_message: string;
  gemini_message?: string;
  correction: CorrectionResult;
  regulation_combos: Record<string, ComboResult>;
  corrected_regulation_combos?: Record<string, ComboResult> | null;
  compliance_level: string;
  corrected_compliance_level?: string;
  binary_level: string;
  needs_review: boolean;
  corrected_needs_review?: boolean;
  gemini_regulations_analyzed?: string[];
  gemini_api_calls?: number;
  method: string;
  timestamp: number;
}

export interface ProspectSummary {
  index: number;
  name: string;
  current_role: string;
  location: string;
  icp_match_score: number;
  urgency_score: number;
  composite_score: number;
  matched_icp: string;
  compliance_level: string;
  corrected_compliance_level?: string;
  binary_level: string;
  needs_review: boolean;
  method: string;
}

export interface StatsResponse {
  total_prospects: number;
  data_source: string;
  compliance_distribution: Record<string, number>;
  corrected_distribution?: Record<string, number> | null;
  avg_composite_score: number;
  needs_review_count: number;
  method_counts: Record<string, number>;
  regulations_available: string[];
  combos_available: string[];
}

// Compliance level color/badge mapping
export const COMPLIANCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  HIGH_CONFIDENCE_COMPLIANT: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  LIKELY_COMPLIANT: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  NEEDS_REVIEW: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  INSUFFICIENT_EVIDENCE: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  NON_COMPLIANT: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  UNKNOWN: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

export const COMPLIANCE_LABELS: Record<string, string> = {
  HIGH_CONFIDENCE_COMPLIANT: "High Confidence",
  LIKELY_COMPLIANT: "Likely Compliant",
  NEEDS_REVIEW: "Needs Review",
  INSUFFICIENT_EVIDENCE: "Insufficient Evidence",
  NON_COMPLIANT: "Non-Compliant",
  UNKNOWN: "Unknown",
};

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-600",
  major: "text-orange-600",
  minor: "text-yellow-600",
  advisory: "text-blue-600",
};

export const FRESHNESS_COLORS: Record<string, string> = {
  FRESH: "text-emerald-600",
  RECENT: "text-green-600",
  AGING: "text-yellow-600",
  STALE: "text-orange-600",
  EXPIRED: "text-red-600",
};
