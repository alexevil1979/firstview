"use client";

import { useState } from "react";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mock-data";
import { PLANS } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState(MOCK_SUBSCRIPTIONS);
  const [plans, setPlans] = useState(PLANS.map((p) => ({ ...p })));

  const extend = (id: string) => {
    setSubs((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "active",
              expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            }
          : s,
      ),
    );
    toast.success("Подписка продлена на 30 дней");
  };

  const cancel = (id: string) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "canceled" } : s)),
    );
    toast.message("Подписка отменена");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Подписки и тарифы
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Управление лимитами и активными подписками.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.archived && <Badge variant="warning">Архив</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-zinc-500">Цена, ₽</label>
                <Input
                  type="number"
                  value={plan.price}
                  onChange={(e) => {
                    const next = [...plans];
                    next[idx] = { ...plan, price: Number(e.target.value) };
                    setPlans(next);
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">
                  Ссылок за проход
                </label>
                <Input
                  type="number"
                  value={plan.limits.linksPerWalk}
                  onChange={(e) => {
                    const next = [...plans];
                    next[idx] = {
                      ...plan,
                      limits: {
                        ...plan.limits,
                        linksPerWalk: Number(e.target.value),
                      },
                    };
                    setPlans(next);
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Проходов в день</label>
                <Input
                  type="number"
                  value={plan.limits.walksPerDay}
                  onChange={(e) => {
                    const next = [...plans];
                    next[idx] = {
                      ...plan,
                      limits: {
                        ...plan.limits,
                        walksPerDay: Number(e.target.value),
                      },
                    };
                    setPlans(next);
                  }}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => toast.success(`Тариф ${plan.name} сохранён`)}
                >
                  Сохранить
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const next = [...plans];
                    next[idx] = { ...plan, archived: !plan.archived };
                    setPlans(next);
                  }}
                >
                  {plan.archived ? "Разархив." : "В архив"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Пользователь</th>
                <th className="px-4 py-3">Тариф</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">До</th>
                <th className="px-4 py-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-zinc-200/80 dark:border-zinc-800"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{s.userName}</div>
                    <div className="text-xs text-zinc-500">{s.userEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{s.planId}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        s.status === "active"
                          ? "success"
                          : s.status === "past_due"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(s.amount)}</td>
                  <td className="px-4 py-3">{formatDate(s.expiresAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => extend(s.id)}>
                        Продлить
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => cancel(s.id)}
                      >
                        Отменить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
