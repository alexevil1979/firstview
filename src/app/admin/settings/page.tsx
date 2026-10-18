"use client";

import { useState } from "react";
import { MOCK_PROMOS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [serviceName, setServiceName] = useState("LinkWalker");
  const [supportEmail, setSupportEmail] = useState("support@linkwalker.app");
  const [maintenance, setMaintenance] = useState(false);
  const [notifySignup, setNotifySignup] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(true);
  const [promos, setPromos] = useState(MOCK_PROMOS);
  const [newCode, setNewCode] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Настройки
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Общие параметры сервиса, промокоды и уведомления.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Общие настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm">Название сервиса</label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm">Email поддержки</label>
              <Input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                className="accent-teal-600"
              />
              Режим обслуживания
            </label>
            <Button
              onClick={() => toast.success("Настройки сохранены")}
            >
              Сохранить
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifySignup}
                onChange={(e) => setNotifySignup(e.target.checked)}
                className="accent-teal-600"
              />
              Письмо при регистрации
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyPayment}
                onChange={(e) => setNotifyPayment(e.target.checked)}
                className="accent-teal-600"
              />
              Письмо при успешной оплате
            </label>
            <Button
              variant="outline"
              onClick={() => toast.success("Настройки уведомлений сохранены")}
            >
              Сохранить уведомления
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Промокоды</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="НОВЫЙКОД"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              className="max-w-xs"
            />
            <Button
              onClick={() => {
                if (!newCode.trim()) return;
                setPromos((prev) => [
                  {
                    id: `pr-${Date.now()}`,
                    code: newCode.trim(),
                    discountPercent: 20,
                    maxUses: 50,
                    used: 0,
                    active: true,
                    expiresAt: new Date(
                      Date.now() + 90 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  },
                  ...prev,
                ]);
                setNewCode("");
                toast.success("Промокод создан");
              }}
            >
              Создать
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr>
                  <th className="py-2">Код</th>
                  <th className="py-2">Скидка</th>
                  <th className="py-2">Использовано</th>
                  <th className="py-2">До</th>
                  <th className="py-2">Статус</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-zinc-200/80 dark:border-zinc-800"
                  >
                    <td className="py-3 font-mono">{p.code}</td>
                    <td className="py-3">{p.discountPercent}%</td>
                    <td className="py-3">
                      {p.used}/{p.maxUses}
                    </td>
                    <td className="py-3">{formatDate(p.expiresAt)}</td>
                    <td className="py-3">
                      <Badge variant={p.active ? "success" : "secondary"}>
                        {p.active ? "active" : "off"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setPromos((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, active: !x.active } : x,
                            ),
                          )
                        }
                      >
                        {p.active ? "Выключить" : "Включить"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
