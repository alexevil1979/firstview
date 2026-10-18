import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "RUB") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function parseUrlList(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((u) => u.trim())
    .filter((u) => {
      if (!u) return false;
      try {
        const withProtocol = /^https?:\/\//i.test(u) ? u : `https://${u}`;
        new URL(withProtocol);
        return true;
      } catch {
        return false;
      }
    })
    .map((u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`));
}
