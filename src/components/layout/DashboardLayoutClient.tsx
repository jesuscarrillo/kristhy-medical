"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { User } from "better-auth";

// Dynamic import with ssr: false to prevent hydration mismatch
// Radix UI Sheet/Dialog generates non-deterministic aria-controls IDs
const AppSidebar = dynamic(
  () => import("./AppSidebar").then((mod) => mod.AppSidebar),
  {
    ssr: false,
    loading: () => <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
  }
);

type DashboardLayoutClientProps = {
  user: User | null;
  children: React.ReactNode;
};

export function DashboardLayoutClient({
  user,
  children,
}: DashboardLayoutClientProps) {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <AppSidebar user={user ?? undefined} />
      <Suspense fallback={<div className="lg:pl-72" />}>
        <main className="lg:pl-72 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </Suspense>
    </div>
  );
}
