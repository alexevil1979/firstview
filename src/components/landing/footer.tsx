import Link from "next/link";
import { Route } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white dark:bg-teal-500">
            <Route className="h-4 w-4" />
          </span>
          LinkWalker
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
          <Link href="/legal/privacy" className="hover:text-teal-600">
            Политика
          </Link>
          <Link href="/legal/terms" className="hover:text-teal-600">
            Условия
          </Link>
          <Link href="/legal/contacts" className="hover:text-teal-600">
            Контакты
          </Link>
          <Link href="/admin" className="hover:text-teal-600">
            Админка
          </Link>
        </div>
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} LinkWalker. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
