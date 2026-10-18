"use client";

import { useMemo } from "react";
import { useWalkerStore } from "@/stores/walker-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsPage() {
  const history = useWalkerStore((s) => s.history);

  const stats = useMemo(() => {
    const walks = history.length;
    const links = history.reduce((s, w) => s + w.urls.length, 0);
    const success = history.reduce((s, w) => s + w.successCount, 0);
    const errors = history.reduce((s, w) => s + w.errorCount, 0);
    const avgTime =
      walks === 0
        ? 0
        : Math.round(
            history.reduce((s, w) => s + w.avgDurationMs, 0) / walks / 1000,
          );
    return { walks, links, success, errors, avgTime };
  }, [history]);

  const cards = [
    { title: "Проходов", value: stats.walks },
    { title: "Ссылок обработано", value: stats.links },
    { title: "Успешных", value: stats.success },
    { title: "Ошибок", value: stats.errors },
    { title: "Среднее время / ссылка", value: `${stats.avgTime} с` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Статистика
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Сводка по вашим проходам.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-500">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
