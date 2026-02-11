import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getPrescriptions } from "@/server/actions/prescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import {
  Pill,
  Plus,
  FilesIcon,
  Calendar,
  ChevronRight,
} from "lucide-react";

type PrescriptionsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PrescriptionsPage({ params }: PrescriptionsPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const prescriptions = await getPrescriptions(patientId);

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="prescripciones"
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Recetas Emitidas ({prescriptions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {prescriptions.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/30">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-3">
                    <Pill className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">No hay prescripciones registradas.</p>
                  <p className="text-xs text-slate-400 mt-1">Crea una nueva receta para comenzar.</p>
                </CardContent>
              </Card>
            ) : (
              prescriptions.map((prescription) => (
                <Link
                  key={prescription.id}
                  href={`/dashboard/pacientes/${patientId}/prescripciones/${prescription.id}`}
                  className="group block"
                >
                  <Card className="border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 border-l-teal-400 transition-all hover:shadow-md hover:ring-primary/30">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md font-mono tabular-nums">
                              <Calendar className="mr-1.5 h-3.5 w-3.5" />
                              {new Date(prescription.date).toLocaleDateString("es-VE", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            {prescription.diagnosis && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-[10px]">
                                {prescription.diagnosis}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-900 dark:text-slate-100 font-medium whitespace-pre-line line-clamp-3">
                            {prescription.medications}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors shrink-0 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10">
            <CardHeader className="border-b border-slate-100/50 dark:border-slate-800 pb-4">
              <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nueva Prescripción
              </CardTitle>
              <CardDescription>
                Genera una nueva receta médica para este paciente.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <Button asChild className="w-full shadow-md shadow-primary/20">
                <Link href={`/dashboard/pacientes/${patientId}/prescripciones/nuevo`}>
                  Crear Receta
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
