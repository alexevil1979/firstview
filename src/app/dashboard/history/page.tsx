"use client";

import { Badge } from "@/components/ui/badge";
import { useWalkerStore } from "@/stores/walker-store";
import { formatDateTime } from "@/lib/utils";

const statusMap = {
  completed: { label: "Завершён", variant: "success" as const },
  stopped: { label: "Остановлен", variant: "warning" as const },
  failed: { label: "Ошибка", variant: "danger" as const },
  running: { label: "Идёт", variant: "default" as const },
  paused: { label: "Пауза", variant: "secondary" as const },
};

export default function HistoryPage() {
  const history = useWalkerStore((s) => s.history);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          История проходов
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Последние сессии на этом устройстве и демо-данные.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Ссылок</th>
                <th className="px-4 py-3 font-medium">Успешно</th>
                <th className="px-4 py-3 font-medium">Ошибки</th>
                <th className="px-4 py-3 font-medium">Скорость</th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {history.map((walk) => {
                const st = statusMap[walk.status] ?? statusMap.completed;
                return (
                  <tr
                    key={walk.id}
                    className="border-t border-zinc-200/80 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">{formatDateTime(walk.startedAt)}</td>
                    <td className="px-4 py-3">{walk.urls.length}</td>
                    <td className="px-4 py-3 text-emerald-600">
                      {walk.successCount}
                    </td>
                    <td className="px-4 py-3 text-rose-600">{walk.errorCount}</td>
                    <td className="px-4 py-3">{walk.speed}x</td>
                    <td className="px-4 py-3">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    История пока пуста
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
