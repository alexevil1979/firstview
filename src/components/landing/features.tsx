"use client";

import { motion } from "framer-motion";
import {
  MonitorSmartphone,
  History,
  Download,
  Code2,
  Shield,
  Zap,
} from "lucide-react";

const items = [
  {
    icon: MonitorSmartphone,
    title: "Без установки",
    text: "Открой браузер — и можно работать. Никаких расширений.",
  },
  {
    icon: Zap,
    title: "Работает в браузере",
    text: "Проход выполняется на клиенте: быстрее и приватнее.",
  },
  {
    icon: History,
    title: "История проходов",
    text: "Возвращайся к прошлым сессиям и сравнивай результаты.",
  },
  {
    icon: Download,
    title: "Экспорт результатов",
    text: "Выгружай логи в CSV/JSON на Pro и Business.",
  },
  {
    icon: Code2,
    title: "API для Business",
    text: "Встраивай проходы в свои пайплайны и внутренние панели.",
  },
  {
    icon: Shield,
    title: "Контроль доступа",
    text: "Тарифы, роли и админка для управления командой.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Преимущества
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Всё, что нужно для быстрой и наглядной работы со списками ссылок.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/50"
          >
            <item.icon className="mb-3 h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
