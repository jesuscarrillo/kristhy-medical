import { Suspense } from "react";
import Link from "next/link";
import { getPatients } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientTable } from "@/components/patients/PatientTable";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Users,
} from "lucide-react";

type PatientsPageProps = {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams?.q === "string" ? resolvedParams.q : undefined;
  const page = parseInt(resolvedParams?.page || "1");

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Pacientes</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Gestiona los expedientes y datos de tus pacientes.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
          <Link href="/dashboard/pacientes/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo paciente
          </Link>
        </Button>
      </div>

      <Suspense fallback={<PatientsTableSkeleton />}>
        <PatientsContent query={query} page={page} />
      </Suspense>
    </div>
  );
}

async function PatientsContent({ query, page }: { query?: string; page: number }) {
  const { patients, total, totalPages } = await getPatients(query, page);

  const buildUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Listado de Pacientes
            </CardTitle>
            <CardDescription>
              Mostrando {patients.length} de {total} pacientes registrados
            </CardDescription>
          </div>
          <form className="relative w-full max-w-sm" method="get">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              name="q"
              placeholder="Buscar por nombre, apellido o cédula..."
              defaultValue={query ?? ""}
              className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
            />
          </form>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <PatientTable patients={patients} query={query} />
      </CardContent>
      {totalPages > 1 && (
        <div className="flex items-center justify-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 p-4">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page <= 1}
              className="h-8 w-8 p-0"
            >
              <Link
                href={buildUrl(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 tabular-nums">
              Página {page} de {totalPages}
            </span>
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              className="h-8 w-8 p-0"
            >
              <Link
                href={buildUrl(page + 1)}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function PatientsTableSkeleton() {
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-9 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ))}
      </CardContent>
    </Card>
  );
}
