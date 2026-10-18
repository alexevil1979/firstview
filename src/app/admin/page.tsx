"use client";

import {
  Area,
  AreaChart,
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
import { formatCurrency } from "@/lib/utils";
import { Users, CreditCard, Wallet, Activity } from "lucide-react";

const kpis = [
  {
    title: "Пользователи",
    value: ADMIN_STATS.usersTotal,
    icon: Users,
  },
  {
    title: "Активные подписки",
    value: ADMIN_STATS.activeSubscriptions,
    icon: CreditCard,
  },
  {
    title: "Выручка за месяц",
    value: formatCurrency(ADMIN_STATS.revenueMonth),
    icon: Wallet,
  },
  {
    title: "Проходы сегодня",
    value: ADMIN_STATS.walksToday,
    icon: Activity,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Обзор сервиса · сегодня / неделя / месяц
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 text-sm text-zinc-500 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            Проходы за неделю:{" "}
            <span className="font-semibold text-foreground">
              {ADMIN_STATS.walksWeek}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            Проходы за месяц:{" "}
            <span className="font-semibold text-foreground">
              {ADMIN_STATS.walksMonth}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            Конверсия Free → Paid:{" "}
            <span className="font-semibold text-foreground">
              {ADMIN_STATS.freeToPaidConversion}%
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Пользователи</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_STATS.chartUsers}>
                <defs>
                  <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#14b8a6"
                  fill="url(#users)"
                  name="Пользователи"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Выручка</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_STATS.chartRevenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22d3ee"
                  fill="url(#rev)"
                  name="Выручка"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Активность за неделю</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_STATS.chartActivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="walks" fill="#0d9488" radius={[8, 8, 0, 0]} name="Проходы" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
