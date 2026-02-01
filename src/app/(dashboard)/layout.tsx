import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireDoctor } from "@/server/middleware/auth";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDoctor();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <AppSidebar user={session?.user} />
      <main className="lg:pl-72 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
