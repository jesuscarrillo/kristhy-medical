import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getPrescriptions } from "@/server/actions/prescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pill,
  Plus,
  FilesIcon,
  Calendar
} from "lucide-react";

type PrescriptionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrescriptionsPage({
  params,
}: PrescriptionsPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const prescriptions = await getPrescriptions(patientId);
  const isFemale = patient.gender === "female";

  const tabs = [
    { label: "Resumen", href: `/dashboard/pacientes/${patientId}`, active: false },
    { label: "Historial Clínico", href: `/dashboard/pacientes/${patientId}/historial`, active: false },
    { label: "Imágenes", href: `/dashboard/pacientes/${patientId}/imagenes`, active: false },
    { label: "Prescripciones", href: `/dashboard/pacientes/${patientId}/prescripciones`, active: true },
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

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Prescripciones</h1>
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
              <Pill className="h-5 w-5 text-primary" />
              Recetas Emitidas ({prescriptions.length})
            </h2>
          </div>

          <div className="space-y-4">
            {prescriptions.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-3 mb-3">
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
                  <Card className="border-slate-200 transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                              <Calendar className="mr-1.5 h-3.5 w-3.5" />
                              {new Date(prescription.date).toLocaleDateString("es-VE", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            {prescription.diagnosis && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {prescription.diagnosis}
                              </Badge>
                            )}
                          </div>

                          <div>
                            <p className="text-sm text-slate-900 font-medium whitespace-pre-line line-clamp-3">
                              {prescription.medications}
                            </p>
                          </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-primary transition-colors">
                          <FilesIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-lg shadow-slate-200/50 border-0 ring-1 ring-slate-200 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nueva Prescripción
              </CardTitle>
              <CardDescription>
                Genera una nueva receta médica para este paciente.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 mb-6">
                Puedes crear recetas detalladas, incluir diagnósticos y generar PDFs automáticamente.
              </p>
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
