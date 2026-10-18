"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MOCK_ACTIVITIES, MOCK_USERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import type { PlanId } from "@/types";
import { toast } from "sonner";

export default function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const initial = MOCK_USERS.find((u) => u.id === id);
  const [user, setUser] = useState(initial);
  const activities = MOCK_ACTIVITIES.filter((a) => a.userId === id);

  if (!user) {
    return (
      <div>
        <p>Пользователь не найден</p>
        <Button asChild className="mt-4">
          <Link href="/admin/users">Назад</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/users"
            className="text-sm text-teal-600 hover:underline"
          >
            ← К списку
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold">
            {user.name}
          </h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={user.status === "active" ? "success" : "danger"}>
            {user.status}
          </Badge>
          <Badge variant="secondary">{user.planId}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">Проходы</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-semibold">
            {user.walksCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">Ссылки</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-semibold">
            {user.linksProcessed}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">Страна</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-2xl font-semibold">
            {user.country ?? "—"}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Смена тарифа</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(["free", "pro", "business"] as PlanId[]).map((plan) => (
            <Button
              key={plan}
              variant={user.planId === plan ? "default" : "outline"}
              onClick={() => {
                setUser({ ...user, planId: plan });
                toast.success(`Тариф изменён на ${plan}`);
              }}
            >
              {plan}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История действий</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(activities.length ? activities : [
            {
              id: "x",
              userId: id,
              action: "Нет записей в демо-данных",
              createdAt: new Date().toISOString(),
            },
          ]).map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2 text-sm last:border-0 dark:border-zinc-800"
            >
              <div>
                <p className="font-medium">{a.action}</p>
                {"meta" in a && a.meta && (
                  <p className="text-xs text-zinc-500">{a.meta}</p>
                )}
              </div>
              <span className="text-xs text-zinc-400">
                {formatDateTime(a.createdAt)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
