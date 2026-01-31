import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireDoctor } from "@/server/middleware/auth";
import { UserMenu } from "@/components/dashboard/UserMenu";

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-base font-semibold">
            Dra. Kristhy
          </Link>
          <nav className="flex gap-4 text-sm text-slate-600">
            <Link href="/dashboard">Panel</Link>
            <Link href="/dashboard/pacientes">Pacientes</Link>
            <Link href="/dashboard/citas">Citas</Link>
            <Link href="/dashboard/reportes">Reportes</Link>
            <Link href="/dashboard/auditoria">Auditoría</Link>
          </nav>
          <UserMenu name={session?.user?.name} email={session?.user?.email} />
        </div>
      </header>
      {children}
    </div>
  );
}
