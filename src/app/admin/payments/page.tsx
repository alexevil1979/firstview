"use client";

import { useMemo, useState } from "react";
import { MOCK_PAYMENTS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { PaymentStatus, PlanId } from "@/types";

const statusVariant: Record<
  PaymentStatus,
  "success" | "danger" | "warning" | "secondary"
> = {
  succeeded: "success",
  failed: "danger",
  refunded: "warning",
  pending: "secondary",
};

export default function AdminPaymentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");
  const [plan, setPlan] = useState<"all" | PlanId>("all");

  const filtered = useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        p.userName.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.stripeId.toLowerCase().includes(q);
      return (
        matchQ &&
        (status === "all" || p.status === status) &&
        (plan === "all" || p.planId === plan)
      );
    });
  }, [query, status, plan]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Платежи
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          История Stripe-платежей (демо-данные).
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Пользователь или Stripe ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | PaymentStatus)}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="all">Все статусы</option>
          <option value="succeeded">Успешно</option>
          <option value="failed">Ошибка</option>
          <option value="refunded">Возврат</option>
          <option value="pending">Ожидание</option>
        </select>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as "all" | PlanId)}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="all">Все тарифы</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Пользователь</th>
                <th className="px-4 py-3">Тариф</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Stripe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-zinc-200/80 dark:border-zinc-800"
                >
                  <td className="px-4 py-3">{formatDateTime(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.userName}</div>
                    <div className="text-xs text-zinc-500">{p.userEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{p.planId}</Badge>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.stripeId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
