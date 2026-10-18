"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanId, User } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, asAdmin?: boolean) => boolean;
  logout: () => void;
  updatePlan: (planId: PlanId) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email, asAdmin = false) => {
        const found =
          MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase(),
          ) ??
          ({
            ...MOCK_USERS[2],
            id: "demo",
            email,
            name: email.split("@")[0],
            role: asAdmin ? "admin" : "user",
            planId: "free" as PlanId,
          } satisfies User);

        const user = asAdmin ? { ...found, role: "admin" as const } : found;
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updatePlan: (planId) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, planId } });
      },
    }),
    { name: "linkwalker-auth" },
  ),
);
