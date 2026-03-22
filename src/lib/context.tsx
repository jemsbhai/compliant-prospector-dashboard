"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "advisor" | "compliance" | null;

export interface ReviewRequest {
  id: string;
  prospectIndex: number;
  prospectName: string;
  prospectRole: string;
  message: string;
  status: "pending" | "approved" | "flagged" | "rejected";
  submittedAt: number;
  reviewedAt?: number;
  notes?: string;
  complianceLevel?: string;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  reviewQueue: ReviewRequest[];
  submitForReview: (req: Omit<ReviewRequest, "id" | "status" | "submittedAt">) => void;
  updateReview: (id: string, status: ReviewRequest["status"], notes?: string, complianceLevel?: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewRequest[]>([]);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("clearpath_role");
    if (saved === "advisor" || saved === "compliance") setRoleState(saved);
    const savedQueue = localStorage.getItem("clearpath_review_queue");
    if (savedQueue) {
      try { setReviewQueue(JSON.parse(savedQueue)); } catch {}
    }
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    if (r) localStorage.setItem("clearpath_role", r);
    else localStorage.removeItem("clearpath_role");
  };

  const submitForReview = (req: Omit<ReviewRequest, "id" | "status" | "submittedAt">) => {
    const newReq: ReviewRequest = {
      ...req,
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: "pending",
      submittedAt: Date.now(),
    };
    setReviewQueue(prev => {
      const updated = [newReq, ...prev];
      localStorage.setItem("clearpath_review_queue", JSON.stringify(updated));
      return updated;
    });
  };

  const updateReview = (id: string, status: ReviewRequest["status"], notes?: string, complianceLevel?: string) => {
    setReviewQueue(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, status, notes, complianceLevel, reviewedAt: Date.now() } : r
      );
      localStorage.setItem("clearpath_review_queue", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{ role, setRole, reviewQueue, submitForReview, updateReview }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
