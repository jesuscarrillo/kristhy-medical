import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { UltrasoundForm } from "@/components/ultrasound";
import { pregnancyStatusLabels } from "@/lib/validators/ultrasound";
import { ArrowLeft, Scan, Baby } from "lucide-react";

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

  if (patient.gender !== "female") {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
        <PatientPageHeader
          patient={patient}
          patientId={patientId}
          activeTab="ecografias"
          showActions={false}
        />
        <Card className="shadow-sm border-0 ring-1 ring-red-200/50 dark:ring-red-800/50 border-l-4 border-l-red-400">
          <CardContent className="p-6">
            <p className="text-sm text-red-600 dark:text-red-400">
              Las ecografías solo están disponibles para pacientes femeninos.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href={`/dashboard/pacientes/${patientId}`}>Volver</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
          <Link href={`/dashboard/pacientes/${patientId}/ecografias`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Ecografías
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
            <Scan className="h-5 w-5 text-primary" />
            Nueva Ecografía
          </CardTitle>
          <CardDescription>
            Los tipos disponibles dependen del estado de embarazo actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UltrasoundForm
            patientId={patientId}
            pregnancyStatus={patient.pregnancyStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}
