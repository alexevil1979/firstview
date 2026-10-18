"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Отзывы
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Команды SEO, QA и growth уже используют LinkWalker каждый день.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.blockquote
            key={t.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/50"
          >
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              «{t.text}»
            </p>
            <footer className="mt-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/15 text-sm font-semibold text-teal-700 dark:text-teal-300">
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-zinc-500">{t.role}</div>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}
