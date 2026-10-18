"use client";

import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      login("alex@linkwalker.app", true);
    }
  }, [user, login]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
