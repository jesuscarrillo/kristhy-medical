import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { MedicalRecordForm } from "@/components/patients/MedicalRecordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import {
  Stethoscope,
  Clock,
  FileText,
  PlusCircle,
  ChevronRight,
  Calendar
} from "lucide-react";

type PatientHistoryPageProps = {
  params: Promise<{ id: string }>;
};

const consultationTypeLabels: Record<string, string> = {
  prenatal: "Prenatal",
  gynecology: "Ginecología",
  emergency: "Emergencia",
  followup: "Control",
};

const consultationTypeColors: Record<string, string> = {
  prenatal: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  gynecology: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
  emergency: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  followup: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

const consultationBorderColors: Record<string, string> = {
  prenatal: "border-l-purple-400",
  gynecology: "border-l-rose-400",
  emergency: "border-l-red-400",
  followup: "border-l-blue-400",
};

export default async function PatientHistoryPage({ params }: PatientHistoryPageProps) {
  const resolvedParams = await params;
  let patient;
  try {
    patient = await getPatient(resolvedParams.id);
  } catch {
    notFound();
  }

  const patientId = resolvedParams.id;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="historial"
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Registros ({patient.medicalRecords.length})
            </h2>
          </div>

          <div className="space-y-3">
            {patient.medicalRecords.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/30">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-3">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">Aún no hay registros clínicos.</p>
                  <p className="text-xs text-slate-400 mt-1">Utiliza el formulario para añadir la primera consulta.</p>
                </CardContent>
              </Card>
            ) : (
              patient.medicalRecords.map((record) => (
                <Card
                  key={record.id}
                  className={`group overflow-hidden transition-all hover:shadow-md border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 ${consultationBorderColors[record.consultationType] || "border-l-slate-300"}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`${consultationTypeColors[record.consultationType] || "bg-slate-100 text-slate-700"} text-[10px] px-2 py-0`}
                          >
                            {consultationTypeLabels[record.consultationType] || record.consultationType}
                          </Badge>
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {new Date(record.date).toLocaleString("es-VE", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 line-clamp-2">
                            {record.chiefComplaint}
                          </p>
                          {record.diagnosis && (
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Dx:</span> {record.diagnosis}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-primary shrink-0">
                        <Link href={`/dashboard/pacientes/${patientId}/historial/${record.id}`}>
                          <ChevronRight className="h-5 w-5" />
                          <span className="sr-only">Ver detalle</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Nueva Consulta
              </CardTitle>
              <CardDescription>
                Registra los detalles de la visita actual.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <MedicalRecordForm patientId={patientId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
