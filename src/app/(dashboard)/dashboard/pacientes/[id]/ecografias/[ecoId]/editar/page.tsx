import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getUltrasound } from "@/server/actions/ultrasound";
import { Button } from "@/components/ui/button";
import { UltrasoundForm } from "@/components/ultrasound";
import { pregnancyStatusLabels } from "@/lib/validators/ultrasound";

type EditUltrasoundPageProps = {
  params: Promise<{
    id: string;
    ecoId: string;
  }>;
};

export default async function EditUltrasoundPage({
  params,
}: EditUltrasoundPageProps) {
  const { id: patientId, ecoId } = await params;

  let patient;
  let ultrasound;

  try {
    [patient, ultrasound] = await Promise.all([
      getPatient(patientId),
      getUltrasound(ecoId),
    ]);
  } catch {
    notFound();
  }

  if (ultrasound.patientId !== patientId) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Editar Ecografía</h1>
            <p className="text-sm text-slate-600">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias/${ecoId}`}>
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
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <UltrasoundForm
          patientId={patientId}
          pregnancyStatus={patient.pregnancyStatus}
          ultrasoundId={ecoId}
          initialData={{
            date: ultrasound.date,
            type: ultrasound.type,
            gestationalAge: ultrasound.gestationalAge,
            reasonForStudy: ultrasound.reasonForStudy,
            lastMenstrualPeriod: ultrasound.lastMenstrualPeriod,
            estimatedDueDate: ultrasound.estimatedDueDate,
            weight: ultrasound.weight,
            height: ultrasound.height,
            bloodPressure: ultrasound.bloodPressure,
            measurements: ultrasound.measurements as Record<string, unknown>,
            findings: ultrasound.findings as Record<string, unknown>,
            otherFindings: ultrasound.otherFindings,
            diagnoses: ultrasound.diagnoses,
            recommendations: ultrasound.recommendations,
          }}
        />
      </div>
    </div>
  );
}
