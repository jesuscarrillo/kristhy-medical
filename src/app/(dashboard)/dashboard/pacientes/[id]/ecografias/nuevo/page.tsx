import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { UltrasoundForm } from "@/components/ultrasound";
import { pregnancyStatusLabels } from "@/lib/validators/ultrasound";

type NewUltrasoundPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewUltrasoundPage({
  params,
}: NewUltrasoundPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  // Only female patients can have ultrasounds
  if (patient.gender !== "female") {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Nueva Ecografía</h1>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            Las ecografías solo están disponibles para pacientes femeninos.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/dashboard/pacientes/${patientId}`}>Volver</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Nueva Ecografía</h1>
            <p className="text-sm text-slate-600">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias`}>
              Cancelar
            </Link>
          </Button>
        </div>

        {/* Pregnancy Status Info */}
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Estado de embarazo actual:</strong>{" "}
            {pregnancyStatusLabels[patient.pregnancyStatus]}
          </p>
          <p className="mt-1 text-xs text-blue-600">
            Los tipos de ecografía disponibles dependen del estado de embarazo.
            Para cambiar el estado, edita el perfil de la paciente.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <UltrasoundForm
          patientId={patientId}
          pregnancyStatus={patient.pregnancyStatus}
        />
      </div>
    </div>
  );
}
