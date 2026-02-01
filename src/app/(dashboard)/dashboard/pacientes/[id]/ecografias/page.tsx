import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getUltrasounds } from "@/server/actions/ultrasound";
import { Button } from "@/components/ui/button";
import { ultrasoundTypeLabels } from "@/lib/validators/ultrasound";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Activity,
  Plus,
  Waves,
  ImageIcon,
  Baby,
  Calendar
} from "lucide-react";

type UltrasoundsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UltrasoundsPage({ params }: UltrasoundsPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  // Only female patients can have ultrasounds
  if (patient.gender !== "female") {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ecografías</h1>
            <p className="mt-1 text-slate-500">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>
        <Card className="border-dashed bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <Activity className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-base font-medium text-slate-600">No disponible</p>
            <p className="text-sm text-slate-400 mt-1">Las ecografías solo están disponibles para pacientes femeninos.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ultrasounds = await getUltrasounds(patientId);

  const tabs = [
    { label: "Resumen", href: `/dashboard/pacientes/${patientId}`, active: false },
    { label: "Historial Clínico", href: `/dashboard/pacientes/${patientId}/historial`, active: false },
    { label: "Imágenes", href: `/dashboard/pacientes/${patientId}/imagenes`, active: false },
    { label: "Prescripciones", href: `/dashboard/pacientes/${patientId}/prescripciones`, active: false },
    { label: "Ecografías", href: `/dashboard/pacientes/${patientId}/ecografias`, active: true },
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Ecografías</h1>
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
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            Estudios Realizados ({ultrasounds.length})
          </h2>

          <div className="space-y-4">
            {ultrasounds.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-3 mb-3">
                    <Waves className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">No hay ecografías registradas.</p>
                  <p className="text-xs text-slate-400 mt-1">Registra un nuevo estudio ecográfico.</p>
                </CardContent>
              </Card>
            ) : (
              ultrasounds.map((ultrasound) => (
                <Link
                  key={ultrasound.id}
                  href={`/dashboard/pacientes/${patientId}/ecografias/${ultrasound.id}`}
                  className="group block"
                >
                  <Card className="border-slate-200 transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                              <Calendar className="mr-1.5 h-3.5 w-3.5" />
                              {new Date(ultrasound.date).toLocaleDateString("es-VE", {
                                dateStyle: "long",
                              })}
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {ultrasoundTypeLabels[ultrasound.type]}
                            </Badge>

                            {ultrasound._count.images > 0 && (
                              <Badge variant="secondary" className="gap-1 text-[10px] h-5">
                                <ImageIcon className="h-3 w-3" />
                                {ultrasound._count.images}
                              </Badge>
                            )}
                          </div>

                          {ultrasound.gestationalAge && (
                            <div className="flex items-center text-sm text-slate-600 bg-slate-50/50 w-fit px-2 py-1 rounded border border-slate-100">
                              <Baby className="mr-2 h-4 w-4 text-pink-400" />
                              Edad Gestacional: <span className="font-semibold ml-1">{ultrasound.gestationalAge}</span>
                            </div>
                          )}

                          <div>
                            <p className="text-sm text-slate-800 line-clamp-2">
                              {ultrasound.diagnoses}
                            </p>
                          </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-primary transition-colors ml-4">
                          <Activity className="h-5 w-5" />
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
                Nueva Ecografía
              </CardTitle>
              <CardDescription>
                Registra un nuevo estudio de imagen.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 mb-6">
                Documenta hallazgos, sube imágenes y genera reportes ecográficos detallados.
              </p>
              <Button asChild className="w-full shadow-md shadow-primary/20">
                <Link href={`/dashboard/pacientes/${patientId}/ecografias/nuevo`}>
                  Crear Registro
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
