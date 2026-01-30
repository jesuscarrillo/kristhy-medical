import Link from "next/link";
import { notFound } from "next/navigation";
import { getMedicalRecord } from "@/server/actions/medicalRecord";
import { MedicalRecordForm } from "@/components/patients/MedicalRecordForm";
import { Button } from "@/components/ui/button";

type EditMedicalRecordPageProps = {
  params: Promise<{
    id: string;
    recordId: string;
  }>;
};

export default async function EditMedicalRecordPage({
  params,
}: EditMedicalRecordPageProps) {
  const { id: patientId, recordId } = await params;

  let record;
  try {
    record = await getMedicalRecord(recordId);
  } catch {
    notFound();
  }

  if (record.patientId !== patientId) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Editar registro</h1>
          <p className="text-sm text-slate-600">
            {record.patient.firstName} {record.patient.lastName}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/pacientes/${patientId}/historial/${recordId}`}>
            Cancelar
          </Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <MedicalRecordForm
          patientId={patientId}
          recordId={recordId}
          initialData={{
            consultationType: record.consultationType as
              | "prenatal"
              | "gynecology"
              | "emergency"
              | "followup",
            date: record.date,
            chiefComplaint: record.chiefComplaint,
            symptoms: record.symptoms ?? "",
            diagnosis: record.diagnosis ?? "",
            treatment: record.treatment ?? "",
            vitalSigns: record.vitalSigns ?? "",
            personalHistory: record.personalHistory ?? "",
            gynecologicHistory: record.gynecologicHistory ?? "",
            obstetricalHistory: record.obstetricalHistory ?? "",
            physicalExam: record.physicalExam ?? "",
            treatmentPlan: record.treatmentPlan ?? "",
            followUpDate: record.followUpDate,
            notes: record.notes ?? "",
          }}
        />
      </div>
    </div>
  );
}
