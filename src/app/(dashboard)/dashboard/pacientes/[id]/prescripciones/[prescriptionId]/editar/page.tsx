import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrescription } from "@/server/actions/prescription";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";
import { Button } from "@/components/ui/button";

type EditPrescriptionPageProps = {
  params: Promise<{
    id: string;
    prescriptionId: string;
  }>;
};

export default async function EditPrescriptionPage({
  params,
}: EditPrescriptionPageProps) {
  const { id: patientId, prescriptionId } = await params;

  let prescription;
  try {
    prescription = await getPrescription(prescriptionId);
  } catch {
    notFound();
  }

  if (prescription.patientId !== patientId) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Editar Prescripción</h1>
          <p className="text-sm text-slate-600">
            {prescription.patient.firstName} {prescription.patient.lastName}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link
            href={`/dashboard/pacientes/${patientId}/prescripciones/${prescriptionId}`}
          >
            Cancelar
          </Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PrescriptionForm
          patientId={patientId}
          prescriptionId={prescriptionId}
          initialData={{
            date: prescription.date,
            medications: prescription.medications,
            instructions: prescription.instructions ?? "",
            diagnosis: prescription.diagnosis ?? "",
          }}
        />
      </div>
    </div>
  );
}
