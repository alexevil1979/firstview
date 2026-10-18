"use client";

import { useMemo, useState } from "react";
import { Play, RotateCcw, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BrowserFrame } from "@/components/walker/browser-frame";
import { Progress } from "@/components/ui/progress";
import { parseUrlList } from "@/lib/utils";
import { DEMO_URLS } from "@/lib/mock-data";

export function DemoSection() {
  const [text, setText] = useState(DEMO_URLS.slice(0, 4).join("\n"));
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const urls = useMemo(() => parseUrlList(text), [text]);

  const reset = () => {
    setRunning(false);
    setPaused(false);
    setIndex(0);
    setLoading(false);
    setLogs([]);
  };

  const tick = (i: number, list: string[]) => {
    if (i >= list.length) {
      setRunning(false);
      setLoading(false);
      setLogs((prev) => [...prev, "Проход завершён"]);
      return;
    }
    setLoading(true);
    setLogs((prev) => [...prev, `Открываем ${list[i]}`]);
    window.setTimeout(() => {
      setLoading(false);
      setIndex(i + 1);
      setLogs((prev) => [...prev, `Готово: ${list[i]}`]);
      window.setTimeout(() => tick(i + 1, list), 500);
    }, 1200);
  };

  const start = () => {
    if (!urls.length) return;
    setRunning(true);
    setPaused(false);
    setIndex(0);
    setLogs(["Старт демо-прохода"]);
    tick(0, urls);
  };

  const currentUrl =
    running || index > 0
      ? urls[Math.min(index, urls.length - 1)] ?? "about:blank"
      : "about:blank";

  const progress = urls.length ? Math.round((index / urls.length) * 100) : 0;

  return (
    <section id="demo" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Попробуй прямо сейчас
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Вставь 3–5 ссылок и запусти мини-визуализацию. Всё происходит только в
          твоём браузере.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
          <label className="mb-2 block text-sm font-medium">Список URL</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com&#10;https://github.com"
            disabled={running}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={start} disabled={running || !urls.length}>
              <Play className="h-4 w-4" />
              Старт
            </Button>
            <Button
              variant="secondary"
              disabled={!running}
              onClick={() => setPaused((p) => !p)}
            >
              <Pause className="h-4 w-4" />
              {paused ? "Пауза (демо)" : "Пауза"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Сброс
            </Button>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Найдено ссылок: {urls.length}
          </p>
          <div className="mt-4 max-h-36 space-y-1 overflow-auto rounded-xl bg-zinc-50 p-3 font-mono text-xs dark:bg-zinc-900">
            {logs.length === 0 && (
              <p className="text-zinc-400">Лог появится после старта…</p>
            )}
            {logs.map((log, i) => (
              <p key={`${log}-${i}`} className="text-zinc-600 dark:text-zinc-300">
                {log}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <BrowserFrame
            url={currentUrl}
            loading={loading && running}
            progressLabel={
              urls.length ? `${Math.min(index, urls.length)}/${urls.length}` : "0/0"
            }
          />
          <Progress value={progress} />
        </div>
      </div>
    </section>
  );
}
