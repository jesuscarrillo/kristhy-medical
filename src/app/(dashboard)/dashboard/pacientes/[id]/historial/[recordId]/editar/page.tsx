import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getMedicalRecord } from "@/server/actions/medicalRecord";
import { MedicalRecordForm } from "@/components/patients/MedicalRecordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { ArrowLeft, Save } from "lucide-react";

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

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="historial"
        showActions={false}
      />

      <div>
        <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
          <Link href={`/dashboard/pacientes/${patientId}/historial/${recordId}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al detalle
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Save className="h-5 w-5 text-primary" />
            Editar Registro Clínico
          </CardTitle>
          <CardDescription>
            Modifica los datos del historial médico.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
