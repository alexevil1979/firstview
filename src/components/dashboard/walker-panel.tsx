"use client";

import { useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Upload,
  Gauge,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrowserFrame } from "@/components/walker/browser-frame";
import { useWalkerStore } from "@/stores/walker-store";
import { useAuthStore } from "@/stores/auth-store";
import { getPlan } from "@/lib/plans";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function WalkerPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((s) => s.user);
  const plan = getPlan(user?.planId ?? "free");

  const {
    urlsText,
    urls,
    status,
    currentIndex,
    speed,
    logs,
    setUrlsText,
    setSpeed,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useWalkerStore();

  const total = urls.length || 0;
  const progress = total ? Math.round((currentIndex / total) * 100) : 0;
  const currentUrl =
    status === "idle"
      ? "about:blank"
      : urls[Math.min(currentIndex, Math.max(urls.length - 1, 0))] ??
        "about:blank";
  const loading = status === "running";

  const onFile = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    setUrlsText(text);
    toast.success(`Файл «${file.name}» загружен`);
  };

  const handleStart = () => {
    const count = urlsText
      .split(/[\n,;]+/)
      .map((u) => u.trim())
      .filter(Boolean).length;
    if (count === 0) {
      toast.error("Добавьте хотя бы одну ссылку");
      return;
    }
    if (count > plan.limits.linksPerWalk) {
      toast.error(
        `Лимит тарифа ${plan.name}: ${plan.limits.linksPerWalk} ссылок за проход`,
      );
      return;
    }
    start();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Новый проход
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Тариф {plan.name}: до {plan.limits.linksPerWalk} ссылок · скорость до{" "}
          {plan.limits.maxSpeed}x
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium">Список ссылок</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={status === "running"}
            >
              <Upload className="h-4 w-4" />
              .txt / .csv
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.csv,text/plain,text/csv"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
          <Textarea
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            placeholder={"https://example.com\nhttps://github.com\nhttps://nextjs.org"}
            disabled={status === "running" || status === "paused"}
            className="min-h-[200px] font-mono text-xs"
          />

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <Gauge className="h-4 w-4 text-teal-600" />
              <span className="text-sm">Скорость</span>
              <input
                type="range"
                min={1}
                max={plan.limits.maxSpeed}
                step={1}
                value={Math.min(speed, plan.limits.maxSpeed)}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={status === "running"}
                className="w-24 accent-teal-600"
              />
              <span className="text-sm font-medium">{speed}x</span>
            </div>
            <Badge variant="secondary">
              Статус:{" "}
              {status === "idle"
                ? "ожидание"
                : status === "running"
                  ? "идёт"
                  : status === "paused"
                    ? "пауза"
                    : status === "completed"
                      ? "завершён"
                      : "остановлен"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {status === "paused" ? (
              <Button onClick={resume}>
                <Play className="h-4 w-4" />
                Продолжить
              </Button>
            ) : (
              <Button
                onClick={handleStart}
                disabled={status === "running"}
              >
                <Play className="h-4 w-4" />
                Начать проход
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={pause}
              disabled={status !== "running"}
            >
              <Pause className="h-4 w-4" />
              Пауза
            </Button>
            <Button
              variant="outline"
              onClick={stop}
              disabled={status !== "running" && status !== "paused"}
            >
              <Square className="h-4 w-4" />
              Стоп
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Сброс
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <BrowserFrame
            url={currentUrl}
            loading={loading}
            progressLabel={
              total ? `${Math.min(currentIndex, total)}/${total}` : "0/0"
            }
          />
          <div>
            <div className="mb-2 flex justify-between text-xs text-zinc-500">
              <span>Прогресс</span>
              <span>
                {Math.min(currentIndex, total)}/{total || 0}
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
        <h2 className="mb-3 text-sm font-medium">Лог действий</h2>
        <div className="max-h-64 space-y-1.5 overflow-auto rounded-xl bg-zinc-50 p-3 font-mono text-xs dark:bg-zinc-900">
          {logs.length === 0 && (
            <p className="text-zinc-400">Лог пуст — запустите проход</p>
          )}
          {logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "flex flex-wrap gap-2",
                log.status === "error" && "text-rose-600 dark:text-rose-400",
                log.status === "success" &&
                  "text-emerald-700 dark:text-emerald-400",
                log.status === "loading" && "text-teal-700 dark:text-teal-300",
              )}
            >
              <span className="text-zinc-400">
                {new Date(log.timestamp).toLocaleTimeString("ru-RU")}
              </span>
              <span className="uppercase">{log.status}</span>
              <span className="truncate">{log.url}</span>
              <span className="text-zinc-500">— {log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
