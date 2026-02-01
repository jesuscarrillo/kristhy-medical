import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getCertificates } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import { certificateTypeLabels } from "@/lib/validators/certificate";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileCheck,
  Plus,
  Calendar,
  Clock,
  Printer
} from "lucide-react";

type CertificatesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CertificatesPage({ params }: CertificatesPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const certificates = await getCertificates(patientId);
  const isFemale = patient.gender === "female";

  const tabs = [
    { label: "Resumen", href: `/dashboard/pacientes/${patientId}`, active: false },
    { label: "Historial Clínico", href: `/dashboard/pacientes/${patientId}/historial`, active: false },
    { label: "Imágenes", href: `/dashboard/pacientes/${patientId}/imagenes`, active: false },
    { label: "Prescripciones", href: `/dashboard/pacientes/${patientId}/prescripciones`, active: false },
    ...(isFemale ? [
      { label: "Ecografías", href: `/dashboard/pacientes/${patientId}/ecografias`, active: false }
    ] : []),
    { label: "Certificados", href: `/dashboard/pacientes/${patientId}/certificados`, active: true },
  ];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      dateStyle: "long",
    });
  };

  const certificateColors = {
    REST: "bg-orange-100 text-orange-800 border-orange-200",
    PREGNANCY: "bg-pink-100 text-pink-800 border-pink-200",
    ATTENDANCE: "bg-blue-100 text-blue-800 border-blue-200",
    FITNESS: "bg-green-100 text-green-800 border-green-200",
    OTHER: "bg-slate-100 text-slate-800 border-slate-200"
  } as Record<string, string>;

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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Certificados Médicos</h1>
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
            <FileCheck className="h-5 w-5 text-primary" />
            Documentos Emitidos ({certificates.length})
          </h2>

          <div className="space-y-4">
            {certificates.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-3 mb-3">
                    <FileCheck className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">No hay certificados registrados.</p>
                  <p className="text-xs text-slate-400 mt-1">Genera reposos y constancias fácilmente.</p>
                </CardContent>
              </Card>
            ) : (
              certificates.map((certificate) => (
                <Link
                  key={certificate.id}
                  href={`/dashboard/pacientes/${patientId}/certificados/${certificate.id}`}
                  className="group block"
                >
                  <Card className="border-slate-200 transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                              <Calendar className="mr-1.5 h-3.5 w-3.5" />
                              {formatDate(certificate.date)}
                            </div>
                            <Badge variant="outline" className={`${certificateColors[certificate.type] || certificateColors.OTHER}`}>
                              {certificateTypeLabels[certificate.type]}
                            </Badge>

                            {certificate.restDays && (
                              <Badge variant="secondary" className="gap-1 bg-slate-100 text-slate-600 border-none">
                                <Clock className="h-3 w-3" />
                                {certificate.restDays} días
                              </Badge>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-slate-800">
                              {certificate.title}
                            </p>
                            {certificate.validFrom && certificate.validUntil && (
                              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                                <span className="font-medium">Vigencia:</span>
                                {formatDate(certificate.validFrom)} al {formatDate(certificate.validUntil)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-primary transition-colors ml-4">
                          <Printer className="h-5 w-5" />
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
                Nuevo Certificado
              </CardTitle>
              <CardDescription>
                Emite una constancia o reposo médico.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 mb-6">
                Selecciona entre diferentes tipos de plantillas para generar el documento oficial.
              </p>
              <Button asChild className="w-full shadow-md shadow-primary/20">
                <Link href={`/dashboard/pacientes/${patientId}/certificados/nuevo`}>
                  Crear Documento
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
