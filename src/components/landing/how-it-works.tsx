"use client";

import { motion } from "framer-motion";
import { FileUp, Play, Eye, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    title: "Загрузи список ссылок",
    text: "Вставь URL вручную или загрузи .txt / .csv файл.",
  },
  {
    icon: Play,
    title: "Нажми «Старт»",
    text: "Выбери скорость и запусти последовательный проход.",
  },
  {
    icon: Eye,
    title: "Смотри проход",
    text: "Адресная строка и прогресс обновляются в реальном времени.",
  },
  {
    icon: BarChart3,
    title: "Анализируй результат",
    text: "Логи, история и экспорт — всё под рукой.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Как это работает
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Четыре шага от списка URL до понятного результата.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/50"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
              <step.icon className="h-5 w-5" />
            </div>
            <p className="mb-1 text-xs font-medium text-teal-700 dark:text-teal-300">
              Шаг {i + 1}
            </p>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {step.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
