"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

function RegisterForm() {
  const search = useSearchParams();
  const plan = search.get("plan") ?? "free";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const updatePlan = useAuthStore((s) => s.updatePlan);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "new.user@linkwalker.app");
    if (plan === "pro" || plan === "business" || plan === "free") {
      updatePlan(plan);
    }
    toast.success("Аккаунт создан");
    router.push("/dashboard");
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
        <h1 className="font-display text-2xl font-semibold">Регистрация</h1>
        <p className="mt-1 text-sm text-zinc-500">
          План: <span className="font-medium text-teal-600">{plan}</span>
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
            />
          </div>
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
            Создать аккаунт
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-teal-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
