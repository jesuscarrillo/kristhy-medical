import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { MedicalRecordForm } from "@/components/patients/MedicalRecordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  Stethoscope,
  Clock,
  FileText,
  PlusCircle,
  ChevronRight,
  Calendar
} from "lucide-react";

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

const consultationTypeColors: Record<string, string> = {
  prenatal: "bg-purple-100 text-purple-700 border-purple-200",
  gynecology: "bg-rose-100 text-rose-700 border-rose-200",
  emergency: "bg-red-100 text-red-700 border-red-200",
  followup: "bg-blue-100 text-blue-700 border-blue-200",
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

  const patientId = resolvedParams.id;
  const isFemale = patient.gender === "female";

  const tabs = [
    { label: "Resumen", href: `/dashboard/pacientes/${patientId}`, active: false },
    { label: "Historial Clínico", href: `/dashboard/pacientes/${patientId}/historial`, active: true },
    { label: "Imágenes", href: `/dashboard/pacientes/${patientId}/imagenes`, active: false },
    { label: "Prescripciones", href: `/dashboard/pacientes/${patientId}/prescripciones`, active: false },
    ...(isFemale ? [
      { label: "Ecografías", href: `/dashboard/pacientes/${patientId}/ecografias`, active: false }
    ] : []),
    { label: "Certificados", href: `/dashboard/pacientes/${patientId}/certificados`, active: false },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href={`/dashboard/pacientes/${patientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al paciente
          </Link>
        </Button>
      </div>

      {/* Helper function replacement for navigation strip to avoid duplication if reused frequently, 
           but for now inline to be safe and quick context-wise. */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Historial Clínico</h1>
        <p className="mt-1 text-slate-500">
          {patient.firstName} {patient.lastName}
        </p>
      </div>

      {/* Navigation Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`
                whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors
                ${tab.active
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}
              `}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Registros ({patient.medicalRecords.length})
            </h2>
          </div>

          <div className="space-y-4">
            {patient.medicalRecords.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-3 mb-3">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">Aún no hay registros clínicos.</p>
                  <p className="text-xs text-slate-400 mt-1">Utiliza el formulario para añadir la primera consulta.</p>
                </CardContent>
              </Card>
            ) : (
              patient.medicalRecords.map((record) => (
                <Card key={record.id} className="group overflow-hidden transition-all hover:shadow-md border-slate-200 hover:border-primary/20">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`${consultationTypeColors[record.consultationType] || "bg-slate-100 text-slate-700"} border px-2 py-0.5`}
                          >
                            {consultationTypeLabels[record.consultationType] || record.consultationType}
                          </Badge>
                          <div className="flex items-center text-xs text-slate-500">
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

                      <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:flex-row sm:opacity-100">
                        <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-primary">
                          <Link href={`/dashboard/pacientes/${patientId}/historial/${record.id}`}>
                            <ChevronRight className="h-5 w-5" />
                            <span className="sr-only">Ver detalle</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-lg shadow-slate-200/50 border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
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
