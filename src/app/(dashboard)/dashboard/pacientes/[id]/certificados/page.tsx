import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getCertificates } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import { certificateTypeLabels } from "@/lib/validators/certificate";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import {
  FileCheck,
  Plus,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
} from "lucide-react";

type CertificatesPageProps = {
  params: Promise<{ id: string }>;
};

const certificateColors: Record<string, string> = {
  REST: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  PREGNANCY: "bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  ATTENDANCE: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  FITNESS: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  OTHER: "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const certificateBorderColors: Record<string, string> = {
  REST: "border-l-orange-400",
  MEDICAL_REPORT: "border-l-blue-400",
  MEDICAL_CONSTANCY: "border-l-indigo-400",
  FITNESS: "border-l-green-400",
  DISABILITY: "border-l-red-400",
  PREGNANCY: "border-l-pink-400",
  OTHER: "border-l-slate-400",
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", { dateStyle: "long" });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="certificados"
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Documentos Emitidos ({certificates.length})
          </h2>

          <div className="space-y-3">
            {certificates.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/30">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-3">
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
                  <Card className={`border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 ${certificateBorderColors[certificate.type] || "border-l-slate-300"} transition-all hover:shadow-md hover:ring-primary/30`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md font-mono tabular-nums">
                              <Calendar className="mr-1.5 h-3.5 w-3.5" />
                              {formatDate(certificate.date)}
                            </div>
                            <Badge variant="outline" className={`text-[10px] ${certificateColors[certificate.type] || certificateColors.OTHER}`}>
                              {certificateTypeLabels[certificate.type]}
                            </Badge>
                            {certificate.restDays && (
                              <Badge variant="secondary" className="gap-1 text-[10px] h-5 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                <Clock className="h-3 w-3" />
                                {certificate.restDays} días
                              </Badge>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {certificate.title}
                            </p>
                            {certificate.validFrom && certificate.validUntil && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <span className="font-medium">Vigencia:</span>
                                {formatDate(certificate.validFrom)} al {formatDate(certificate.validUntil)}
                              </p>
                            )}
                          </div>
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
                Nuevo Certificado
              </CardTitle>
              <CardDescription>
                Emite una constancia o reposo médico.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
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
