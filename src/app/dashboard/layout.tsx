"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useWalkerStore } from "@/stores/walker-store";
import { MOCK_WALKS } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const loadHistory = useWalkerStore((s) => s.loadHistory);
  const history = useWalkerStore((s) => s.history);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      login("maria.seo@agency.ru");
    }
  }, [isAuthenticated, login]);

  useEffect(() => {
    if (history.length === 0) {
      loadHistory(MOCK_WALKS.filter((w) => w.userId === "u1" || w.userId === "u2"));
    }
  }, [history.length, loadHistory]);

  useEffect(() => {
    if (user?.status === "blocked") {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
