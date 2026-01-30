import Link from "next/link";
import { getPatients } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PatientsPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams?.q === "string" ? resolvedParams.q : undefined;
  const patients = await getPatients(query);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <p className="text-sm text-slate-600">
            Administra la lista de pacientes y sus datos clínicos.
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
      </form>

      <div className="mt-6 grid gap-4">
        {patients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            No hay pacientes registrados. Crea el primero para empezar.
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
    </div>
  );
}
