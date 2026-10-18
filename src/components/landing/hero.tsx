"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/walker/browser-frame";
import { useEffect, useState } from "react";
import { DEMO_URLS } from "@/lib/mock-data";

export function Hero() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setLoading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % DEMO_URLS.length);
        setLoading(false);
      }, 700);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.18),transparent_55%)]" />
        <div className="grid-fade absolute inset-0 opacity-40 dark:opacity-20" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Клиентский проход ссылок в реальном времени
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1] dark:text-white"
          >
            Смотри, как браузер проходит по твоим ссылкам
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400"
          >
            Загрузи список URL и наблюдай последовательный проход в реальном
            времени — без установки, прямо в браузере.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href="/register">Попробовать бесплатно</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#demo">
                <Play className="h-4 w-4" />
                Смотреть демо
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <BrowserFrame
            url={DEMO_URLS[index]}
            loading={loading}
            progressLabel={`${index + 1}/${DEMO_URLS.length}`}
          />
        </motion.div>
      </div>
    </section>
  );
}
