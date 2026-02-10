"use client";

import dynamic from "next/dynamic";
import type { User } from "better-auth";

// Dynamic import with ssr: false to prevent hydration mismatch
// Radix UI Sheet/Dialog generates non-deterministic aria-controls IDs
const AppSidebar = dynamic(
  () => import("./AppSidebar").then((mod) => mod.AppSidebar),
  { ssr: false }
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
      <main className="lg:pl-72 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
