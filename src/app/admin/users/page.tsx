"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_USERS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { PlanId, UserStatus } from "@/types";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<"all" | PlanId>("all");
  const [status, setStatus] = useState<"all" | UserStatus>("all");
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchPlan = plan === "all" || u.planId === plan;
      const matchStatus = status === "all" || u.status === status;
      return matchQ && matchPlan && matchStatus;
    });
  }, [users, query, plan, status]);

  const toggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "blocked" ? "active" : "blocked",
            }
          : u,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Пользователи
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Поиск, фильтры, блокировка и управление тарифами.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Поиск по имени или email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as "all" | PlanId)}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="all">Все тарифы</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | UserStatus)}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Пользователь</th>
                <th className="px-4 py-3">Тариф</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Регистрация</th>
                <th className="px-4 py-3">Проходы</th>
                <th className="px-4 py-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-zinc-200/80 dark:border-zinc-800"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-zinc-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{u.planId}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={u.status === "active" ? "success" : "danger"}
                    >
                      {u.status === "active" ? "active" : "blocked"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">{u.walksCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/users/${u.id}`}>Профиль</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant={u.status === "blocked" ? "default" : "destructive"}
                        onClick={() => toggleBlock(u.id)}
                      >
                        {u.status === "blocked" ? "Разблок." : "Блок"}
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
