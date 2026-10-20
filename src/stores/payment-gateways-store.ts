"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_PAYMENT_GATEWAYS,
  type PaymentGatewayDef,
} from "@/lib/payment-gateways";

type State = {
  gateways: PaymentGatewayDef[];
  updateGateway: (code: string, patch: Partial<PaymentGatewayDef>) => void;
  setConfigValue: (
    code: string,
    key: string,
    value: string | number | boolean,
  ) => void;
  setEnabled: (code: string, enabled: boolean) => void;
  setTestMode: (code: string, testMode: boolean) => void;
  bulkEnable: (codes: string[], enabled: boolean) => void;
  resetDefaults: () => void;
};

function mergeWithDefaults(stored: PaymentGatewayDef[]): PaymentGatewayDef[] {
  const byCode = new Map(stored.map((g) => [g.code, g]));
  return DEFAULT_PAYMENT_GATEWAYS.map((def) => {
    const existing = byCode.get(def.code);
    if (!existing) return { ...def, config: { ...def.config } };
    return {
      ...def,
      ...existing,
      config: { ...def.config, ...existing.config },
    };
  });
}

export const usePaymentGatewaysStore = create<State>()(
  persist(
    (set, get) => ({
      gateways: DEFAULT_PAYMENT_GATEWAYS.map((g) => ({
        ...g,
        config: { ...g.config },
      })),
      updateGateway: (code, patch) =>
        set({
          gateways: get().gateways.map((g) =>
            g.code === code ? { ...g, ...patch } : g,
          ),
        }),
      setConfigValue: (code, key, value) =>
        set({
          gateways: get().gateways.map((g) =>
            g.code === code
              ? { ...g, config: { ...g.config, [key]: value } }
              : g,
          ),
        }),
      setEnabled: (code, enabled) =>
        set({
          gateways: get().gateways.map((g) =>
            g.code === code ? { ...g, enabled } : g,
          ),
        }),
      setTestMode: (code, testMode) =>
        set({
          gateways: get().gateways.map((g) =>
            g.code === code ? { ...g, testMode } : g,
          ),
        }),
      bulkEnable: (codes, enabled) =>
        set({
          gateways: get().gateways.map((g) =>
            codes.includes(g.code) ? { ...g, enabled } : g,
          ),
        }),
      resetDefaults: () =>
        set({
          gateways: DEFAULT_PAYMENT_GATEWAYS.map((g) => ({
            ...g,
            config: { ...g.config },
          })),
        }),
    }),
    {
      name: "linkwalker-payment-gateways",
      merge: (persisted, current) => {
        const p = persisted as Partial<State> | undefined;
        return {
          ...current,
          ...p,
          gateways: mergeWithDefaults(p?.gateways ?? current.gateways),
        };
      },
    },
  ),
);
