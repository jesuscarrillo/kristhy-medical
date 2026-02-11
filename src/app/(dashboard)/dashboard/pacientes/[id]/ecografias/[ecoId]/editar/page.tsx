import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getUltrasound } from "@/server/actions/ultrasound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { UltrasoundForm } from "@/components/ultrasound";
import { pregnancyStatusLabels } from "@/lib/validators/ultrasound";
import { ArrowLeft, Save, Baby } from "lucide-react";

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
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="ecografias"
        showActions={false}
      />

      <div className="flex items-center gap-4 flex-wrap">
        <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
          <Link href={`/dashboard/pacientes/${patientId}/ecografias/${ecoId}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al detalle
          </Link>
        </Button>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Baby className="h-4 w-4 text-pink-500" />
          <span>Estado:</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-[11px]">
            {pregnancyStatusLabels[patient.pregnancyStatus]}
          </Badge>
        </div>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Save className="h-5 w-5 text-primary" />
            Editar Ecografía
          </CardTitle>
          <CardDescription>
            Modifica los datos del estudio ecográfico.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
