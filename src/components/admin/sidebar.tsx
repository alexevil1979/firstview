"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Route,
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/subscriptions", label: "Подписки и тарифы", icon: CreditCard },
  { href: "/admin/payments", label: "Платежи", icon: Wallet },
  { href: "/admin/payment-systems", label: "Платежные системы", icon: Building2 },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return (
    <aside className="flex w-full flex-col border-b border-zinc-200 bg-zinc-950 text-zinc-100 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-zinc-800">
      <div className="flex items-center justify-between px-5 py-4">
        <Link href="/admin" className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-white">
            <Route className="h-4 w-4" />
          </span>
          Admin
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition",
                active
                  ? "bg-teal-500/15 font-medium text-teal-300"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-zinc-800 p-4">
        <Button asChild variant="outline" size="sm" className="w-full border-zinc-700 bg-transparent text-zinc-200">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            В кабинет
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-zinc-400"
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
