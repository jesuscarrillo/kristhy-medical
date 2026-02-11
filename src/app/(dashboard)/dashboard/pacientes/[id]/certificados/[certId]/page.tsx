import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getCertificate } from "@/server/actions/certificate";
import { safeDecrypt } from "@/lib/utils/encryption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { certificateTypeLabels } from "@/lib/validators/certificate";
import { DeleteCertificateButton } from "./DeleteCertificateButton";
import {
  ArrowLeft,
  Edit,
  Printer,
  Calendar,
  Award,
  FileText,
  Stethoscope,
  User,
  Clock,
  CalendarDays,
} from "lucide-react";

type CertificateDetailPageProps = {
  params: Promise<{
    id: string;
    certId: string;
  }>;
};

const CERT_TYPE_BADGES: Record<string, string> = {
  REST: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  PREGNANCY: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  MEDICAL_REPORT: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  MEDICAL_CONSTANCY: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  FITNESS: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  DISABILITY: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  OTHER: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
};

const CERT_BORDER_COLORS: Record<string, string> = {
  REST: "border-l-orange-400",
  PREGNANCY: "border-l-pink-400",
  MEDICAL_REPORT: "border-l-blue-400",
  MEDICAL_CONSTANCY: "border-l-emerald-400",
  FITNESS: "border-l-green-400",
  DISABILITY: "border-l-red-400",
  OTHER: "border-l-slate-400",
};

export default async function CertificateDetailPage({
  params,
}: CertificateDetailPageProps) {
  const { id: patientId, certId } = await params;

  let certificate;
  try {
    certificate = await getCertificate(certId);
  } catch {
    notFound();
  }

  if (certificate.patientId !== patientId) {
    notFound();
  }

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const patientCedula = safeDecrypt(certificate.patient.cedula);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", { dateStyle: "long" });
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" });
  };

  const borderColor = CERT_BORDER_COLORS[certificate.type] || "border-l-slate-400";
  const badgeColor = CERT_TYPE_BADGES[certificate.type] || "";

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="certificados"
      />

      {/* Sub-header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
            <Link href={`/dashboard/pacientes/${patientId}/certificados`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Certificados
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <Badge variant="outline" className={`text-[11px] ${badgeColor}`}>
            {certificateTypeLabels[certificate.type]}
          </Badge>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono tabular-nums flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(certificate.date)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="shadow-sm">
            <Link href={`/dashboard/pacientes/${patientId}/certificados/${certId}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild size="sm" className="shadow-sm">
            <Link href={`/dashboard/pacientes/${patientId}/certificados/${certId}/imprimir`} target="_blank">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Link>
          </Button>
          <DeleteCertificateButton
            certificateId={certId}
            patientId={patientId}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Card */}
        <Card className={`shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 ${borderColor}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-primary" />
              {certificate.title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Rest Days Info */}
        {certificate.type === "REST" && certificate.restDays && (
          <Card className="shadow-sm border-0 ring-1 ring-orange-200/50 dark:ring-orange-800/50 border-l-4 border-l-orange-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-orange-700 dark:text-orange-400">
                <Clock className="h-5 w-5" />
                Días de Reposo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-orange-100 dark:divide-orange-800/30">
                <InfoRow icon={CalendarDays} label="Días" value={`${certificate.restDays} días`} />
                {certificate.validFrom && (
                  <InfoRow icon={Calendar} label="Desde" value={formatDate(certificate.validFrom)} />
                )}
                {certificate.validUntil && (
                  <InfoRow icon={Calendar} label="Hasta" value={formatDate(certificate.validUntil)} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Diagnosis */}
          {certificate.diagnosis && (
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Stethoscope className="h-5 w-5 text-blue-500" />
                  Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-700 dark:text-slate-300">
                  {certificate.diagnosis}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Doctor Info */}
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Emitido por
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <InfoRow icon={User} label="Médico" value={certificate.issuedBy} />
                <InfoRow icon={FileText} label="Licencia" value={certificate.licenseNumber} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-emerald-500" />
              Contenido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {certificate.content}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}
