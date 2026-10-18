"use client";

import Link from "next/link";
import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white dark:bg-teal-500">
            <Route className="h-4 w-4" />
          </span>
          LinkWalker
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex dark:text-zinc-300">
          <a href="#how" className="hover:text-teal-600 dark:hover:text-teal-400">
            Как это работает
          </a>
          <a href="#demo" className="hover:text-teal-600 dark:hover:text-teal-400">
            Демо
          </a>
          <a href="#pricing" className="hover:text-teal-600 dark:hover:text-teal-400">
            Тарифы
          </a>
          <a href="#faq" className="hover:text-teal-600 dark:hover:text-teal-400">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Войти</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Попробовать</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
