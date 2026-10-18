"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Route,
  LayoutDashboard,
  History,
  CreditCard,
  BarChart3,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Проход", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "История", icon: History },
  { href: "/dashboard/stats", label: "Статистика", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Подписка", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return (
    <aside className="flex w-full flex-col border-b border-zinc-200 bg-white/80 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Route className="h-4 w-4" />
          </span>
          LinkWalker
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition",
                active
                  ? "bg-teal-500/10 font-medium text-teal-700 dark:text-teal-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <Shield className="h-4 w-4" />
            Админка
          </Link>
        )}
      </nav>

      <div className="mt-auto border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-3">
          <p className="truncate text-sm font-medium">{user?.name ?? "Гость"}</p>
          <p className="truncate text-xs text-zinc-500">{user?.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  );
}
