"use client";

import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PlanId } from "@/types";

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const updatePlan = useAuthStore((s) => s.updatePlan);
  const current = user?.planId ?? "free";

  const choose = (planId: PlanId) => {
    updatePlan(planId);
    toast.success(
      planId === "free"
        ? "Переключено на Free"
        : `Подписка ${planId.toUpperCase()} активирована (демо Stripe)`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Подписка
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Текущий план:{" "}
          <Badge className="ml-1 align-middle">{current}</Badge>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "rounded-2xl border p-5",
              plan.id === current
                ? "border-teal-500/50 bg-teal-500/5"
                : "border-zinc-200/80 dark:border-zinc-800",
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">{plan.name}</h2>
              {plan.id === current && <Badge>Текущий</Badge>}
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">
              {plan.price === 0 ? "0 ₽" : formatCurrency(plan.price)}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={plan.id === current ? "secondary" : "default"}
              disabled={plan.id === current}
              onClick={() => choose(plan.id)}
            >
              {plan.id === current ? "Активен" : "Выбрать план"}
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-500 dark:border-zinc-700">
        Интеграция Stripe готова к подключению: Checkout Session + Webhooks.
        Сейчас смена тарифа работает в демо-режиме без реальных платежей.
      </div>
    </div>
  );
}
