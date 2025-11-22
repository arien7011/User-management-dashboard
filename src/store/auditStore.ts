import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuditEvent = { ts: number; type: string; payload?: unknown };
type AuditState = { events: AuditEvent[]; log: (e: AuditEvent) => void };

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      events: [],
      log: (e) => set((s) => ({ events: [...s.events, e] })),
    }),
    { name: "audit-store" }
  )
);