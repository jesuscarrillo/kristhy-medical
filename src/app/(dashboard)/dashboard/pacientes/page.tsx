import Link from "next/link";
import { getPatients } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const { patients, total, totalPages } = await getPatients(query, page);

  const buildUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (newPage > 1) params.set("page", String(newPage));
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <p className="text-sm text-slate-600">
            {total} paciente{total !== 1 ? "s" : ""} registrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pacientes/nuevo">Nuevo paciente</Link>
        </Button>
      </div>

      <form className="mt-6 flex gap-2" method="get">
        <Input
          name="q"
          placeholder="Buscar por nombre o apellido"
          defaultValue={query ?? ""}
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
        {query && (
          <Button asChild variant="ghost">
            <Link href="/dashboard/pacientes">Limpiar</Link>
          </Button>
        )}
      </form>

      <div className="mt-6 grid gap-4">
        {patients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            {query
              ? `No se encontraron pacientes con "${query}"`
              : "No hay pacientes registrados. Crea el primero para empezar."}
          </div>
        ) : (
          patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/dashboard/pacientes/${patient.id}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-slate-600">
                    Cédula: {patient.cedula}
                  </p>
                </div>
                <p className="text-sm text-slate-500">{patient.phone}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
          >
            <Link
              href={buildUrl(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          </Button>
          <span className="text-sm text-slate-600">
            Página {page} de {totalPages}
          </span>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link
              href={buildUrl(page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
