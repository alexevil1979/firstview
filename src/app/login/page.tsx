"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("maria.seo@agency.ru");
  const [password, setPassword] = useState("demo");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    toast.success("Вы вошли в аккаунт");
    router.push("/dashboard");
  };

  const loginAdmin = () => {
    login("alex@linkwalker.app", true);
    toast.success("Вход как администратор");
    router.push("/admin");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.15),transparent_50%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 font-display text-lg font-semibold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Route className="h-4 w-4" />
          </span>
          LinkWalker
        </Link>
        <h1 className="font-display text-2xl font-semibold">Вход</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Демо-авторизация без внешнего провайдера. Любой email подойдёт.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
        <Button
          variant="outline"
          className="mt-3 w-full"
          type="button"
          onClick={loginAdmin}
        >
          Войти как админ
        </Button>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-teal-600 hover:underline">
            Регистрация
          </Link>
        </p>
      </div>
    </div>
  );
}
