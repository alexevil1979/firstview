"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { PLANS } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Тарифы
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Начни бесплатно и масштабируйся, когда списки вырастут.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6",
              plan.highlighted
                ? "border-teal-500/50 bg-gradient-to-b from-teal-500/10 to-white shadow-lg shadow-teal-950/5 dark:to-zinc-950"
                : "border-zinc-200/80 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/50",
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-medium text-white">
                Популярный
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
            <p className="mt-5 font-display text-4xl font-semibold tracking-tight">
              {plan.price === 0 ? "0 ₽" : formatCurrency(plan.price)}
              {plan.price > 0 && (
                <span className="text-sm font-normal text-zinc-500"> / мес</span>
              )}
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-8 w-full"
              variant={plan.highlighted ? "default" : "outline"}
            >
              <Link href={`/register?plan=${plan.id}`}>Выбрать план</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
