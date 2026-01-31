import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getPrescriptions } from "@/server/actions/prescription";
import { Button } from "@/components/ui/button";

type PrescriptionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrescriptionsPage({
  params,
}: PrescriptionsPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const prescriptions = await getPrescriptions(patientId);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prescripciones</h1>
          <p className="text-sm text-slate-600">
            {patient.firstName} {patient.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}`}>Volver</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/pacientes/${patientId}/prescripciones/nuevo`}>
              Nueva prescripción
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {prescriptions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              No hay prescripciones registradas.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard/pacientes/${patientId}/prescripciones/nuevo`}>
                Crear primera prescripción
              </Link>
            </Button>
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <Link
              key={prescription.id}
              href={`/dashboard/pacientes/${patientId}/prescripciones/${prescription.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(prescription.date).toLocaleDateString("es-VE", {
                        dateStyle: "long",
                      })}
                    </p>
                    {prescription.diagnosis && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                        {prescription.diagnosis}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {prescription.medications}
                  </p>
                </div>
                <span className="text-xs text-slate-400">Ver →</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
