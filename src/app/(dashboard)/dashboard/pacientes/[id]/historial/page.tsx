import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { MedicalRecordForm } from "@/components/patients/MedicalRecordForm";
import { Button } from "@/components/ui/button";

type PatientHistoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const consultationTypeLabels: Record<string, string> = {
  prenatal: "Prenatal",
  gynecology: "Ginecología",
  emergency: "Emergencia",
  followup: "Control",
};

export default async function PatientHistoryPage({
  params,
}: PatientHistoryPageProps) {
  const resolvedParams = await params;
  let patient;
  try {
    patient = await getPatient(resolvedParams.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Historial clínico</h1>
          <p className="text-sm text-slate-600">
            {patient.firstName} {patient.lastName}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/pacientes/${resolvedParams.id}`}>Volver</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">
            Registros ({patient.medicalRecords.length})
          </h2>
          <div className="mt-4 space-y-4">
            {patient.medicalRecords.length === 0 ? (
              <p className="text-sm text-slate-600">Aún no hay registros.</p>
            ) : (
              patient.medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          {consultationTypeLabels[record.consultationType] ||
                            record.consultationType}
                        </span>
                        <p className="text-xs text-slate-500">
                          {new Date(record.date).toLocaleString("es-VE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-800">
                        {record.chiefComplaint}
                      </p>
                      {record.diagnosis ? (
                        <p className="mt-1 text-xs text-slate-600">
                          Diagnóstico: {record.diagnosis}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          href={`/dashboard/pacientes/${resolvedParams.id}/historial/${record.id}`}
                        >
                          Ver
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          href={`/dashboard/pacientes/${resolvedParams.id}/historial/${record.id}/editar`}
                        >
                          Editar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Nuevo registro</h2>
          <div className="mt-4">
            <MedicalRecordForm patientId={resolvedParams.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
