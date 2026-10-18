"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ADMIN_STATS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Аналитика
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Проходы, конверсия, retention и география.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Проходов за месяц", value: ADMIN_STATS.walksMonth },
          {
            label: "Среднее ссылок в проходе",
            value: ADMIN_STATS.avgLinksPerWalk,
          },
          {
            label: "Конверсия Free → Paid",
            value: `${ADMIN_STATS.freeToPaidConversion}%`,
          },
          { label: "Retention 30д", value: `${ADMIN_STATS.retention30}%` },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-500">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-3xl font-semibold">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Топ пользователей</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ADMIN_STATS.topUsers.map((u, i) => (
              <div
                key={u.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/15 text-xs font-semibold text-teal-700 dark:text-teal-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <span className="font-medium">{u.walksCount} проходов</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>География</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_STATS.geo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="country" type="category" width={90} fontSize={12} />
                <Tooltip />
                <Bar dataKey="users" fill="#14b8a6" radius={[0, 8, 8, 0]} name="Пользователи" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
