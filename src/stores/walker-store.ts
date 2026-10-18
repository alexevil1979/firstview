"use client";

import { create } from "zustand";
import type { WalkLogEntry, WalkSession, WalkStatus } from "@/types";

type WalkerState = {
  urlsText: string;
  urls: string[];
  status: WalkStatus | "idle";
  currentIndex: number;
  speed: number;
  logs: WalkLogEntry[];
  history: WalkSession[];
  startedAt?: string;
  timerId?: ReturnType<typeof setTimeout>;
  setUrlsText: (text: string) => void;
  setSpeed: (speed: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  loadHistory: (sessions: WalkSession[]) => void;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function delayForSpeed(speed: number) {
  return Math.max(400, 2200 / speed);
}

export const useWalkerStore = create<WalkerState>((set, get) => {
  const clearTimer = () => {
    const { timerId } = get();
    if (timerId) clearTimeout(timerId);
    set({ timerId: undefined });
  };

  const step = () => {
    const state = get();
    if (state.status !== "running") return;

    const index = state.currentIndex;
    if (index >= state.urls.length) {
      clearTimer();
      const finishedAt = new Date().toISOString();
      const successCount = state.logs.filter((l) => l.status === "success").length;
      const errorCount = state.logs.filter((l) => l.status === "error").length;
      const session: WalkSession = {
        id: makeId(),
        userId: "current",
        urls: state.urls,
        status: "completed",
        startedAt: state.startedAt ?? finishedAt,
        finishedAt,
        currentIndex: index,
        speed: state.speed,
        avgDurationMs: delayForSpeed(state.speed),
        successCount,
        errorCount,
        logs: state.logs,
      };
      set({
        status: "completed",
        history: [session, ...state.history].slice(0, 50),
      });
      return;
    }

    const url = state.urls[index];
    const loadingEntry: WalkLogEntry = {
      id: makeId(),
      url,
      status: "loading",
      message: "Открываем страницу…",
      timestamp: new Date().toISOString(),
    };

    set({ logs: [...state.logs, loadingEntry] });

    const duration = delayForSpeed(state.speed) + Math.random() * 400;
    const fail = Math.random() < 0.08;

    const timerId = setTimeout(() => {
      const current = get();
      if (current.status !== "running") return;

      const result: WalkLogEntry = {
        ...loadingEntry,
        status: fail ? "error" : "success",
        message: fail
          ? "Не удалось загрузить (симуляция ошибки)"
          : "Страница открыта",
        durationMs: Math.round(duration),
        timestamp: new Date().toISOString(),
      };

      const logs = current.logs.map((l) =>
        l.id === loadingEntry.id ? result : l,
      );

      set({ logs, currentIndex: index + 1 });
      step();
    }, duration);

    set({ timerId });
  };

  return {
    urlsText: "",
    urls: [],
    status: "idle",
    currentIndex: 0,
    speed: 1,
    logs: [],
    history: [],
    setUrlsText: (text) => set({ urlsText: text }),
    setSpeed: (speed) => set({ speed }),
    loadHistory: (sessions) => set({ history: sessions }),
    start: () => {
      const { urlsText, speed } = get();
      const urls = urlsText
        .split(/[\n,;]+/)
        .map((u) => u.trim())
        .filter(Boolean)
        .map((u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`));

      if (!urls.length) return;

      clearTimer();
      set({
        urls,
        status: "running",
        currentIndex: 0,
        logs: [],
        speed,
        startedAt: new Date().toISOString(),
      });
      step();
    },
    pause: () => {
      clearTimer();
      if (get().status === "running") set({ status: "paused" });
    },
    resume: () => {
      if (get().status !== "paused") return;
      set({ status: "running" });
      step();
    },
    stop: () => {
      const state = get();
      clearTimer();
      if (state.status === "idle") return;

      const finishedAt = new Date().toISOString();
      const successCount = state.logs.filter((l) => l.status === "success").length;
      const errorCount = state.logs.filter((l) => l.status === "error").length;
      const session: WalkSession = {
        id: makeId(),
        userId: "current",
        urls: state.urls,
        status: "stopped",
        startedAt: state.startedAt ?? finishedAt,
        finishedAt,
        currentIndex: state.currentIndex,
        speed: state.speed,
        avgDurationMs: delayForSpeed(state.speed),
        successCount,
        errorCount,
        logs: state.logs,
      };

      set({
        status: "stopped",
        history: [session, ...state.history].slice(0, 50),
      });
    },
    reset: () => {
      clearTimer();
      set({
        status: "idle",
        currentIndex: 0,
        logs: [],
        urls: [],
        startedAt: undefined,
      });
    },
  };
});
