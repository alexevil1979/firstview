"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  url?: string;
  loading?: boolean;
  progressLabel?: string;
  className?: string;
  compact?: boolean;
};

export function BrowserFrame({
  url = "about:blank",
  loading = false,
  progressLabel,
  className,
  compact = false,
}: BrowserFrameProps) {
  const hostname = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-teal-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-zinc-200/80 bg-zinc-50/90 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
          <Lock className="h-3 w-3 shrink-0 text-teal-600 dark:text-teal-400" />
          <AnimatePresence mode="wait">
            <motion.span
              key={url}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="truncate font-mono"
            >
              {url}
            </motion.span>
          </AnimatePresence>
          {loading && (
            <Loader2 className="ml-auto h-3.5 w-3.5 shrink-0 animate-spin text-teal-500" />
          )}
        </div>
        {progressLabel && (
          <span className="hidden shrink-0 rounded-md bg-teal-500/10 px-2 py-1 text-[11px] font-medium text-teal-700 sm:inline dark:text-teal-300">
            {progressLabel}
          </span>
        )}
      </div>

      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-teal-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-teal-950/30",
          compact ? "h-48" : "h-64 sm:h-80",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.1),transparent_35%)]" />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <motion.div
            key={hostname}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-500/10"
          >
            <Globe className="h-7 w-7 text-teal-600 dark:text-teal-400" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {hostname || "Ожидание ссылки"}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {loading
                ? "Загрузка страницы…"
                : url === "about:blank"
                  ? "Готов к проходу"
                  : "Страница отображена (клиентская симуляция)"}
            </p>
          </div>
          {loading && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
