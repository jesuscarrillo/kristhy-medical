import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireDoctor } from "@/server/middleware/auth";
import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";

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
    <DashboardLayoutClient user={session?.user ?? null}>
      {children}
    </DashboardLayoutClient>
  );
}
