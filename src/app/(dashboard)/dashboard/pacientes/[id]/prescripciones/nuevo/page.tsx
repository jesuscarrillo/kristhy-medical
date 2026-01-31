import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";
import { Button } from "@/components/ui/button";

type NewPrescriptionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewPrescriptionPage({
  params,
}: NewPrescriptionPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Nueva Prescripción</h1>
          <p className="text-sm text-slate-600">
            {patient.firstName} {patient.lastName}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/pacientes/${patientId}/prescripciones`}>
            Cancelar
          </Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PrescriptionForm patientId={patientId} />
      </div>
    </div>
  );
}
