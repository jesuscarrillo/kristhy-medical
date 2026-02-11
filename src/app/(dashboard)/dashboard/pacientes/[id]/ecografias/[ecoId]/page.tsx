import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getUltrasound } from "@/server/actions/ultrasound";
import { safeDecrypt } from "@/lib/utils/encryption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { UltrasoundImageUploader } from "@/components/ultrasound";
import { ultrasoundTypeLabels, pregnancyStatusLabels } from "@/lib/validators/ultrasound";
import { DeleteUltrasoundButton } from "./DeleteUltrasoundButton";
import {
  ArrowLeft,
  Edit,
  Printer,
  Calendar,
  Scan,
  Heart,
  Baby,
  Stethoscope,
  FileText,
  Ruler,
  ImageIcon,
  Activity,
  Scale,
} from "lucide-react";

type UltrasoundDetailPageProps = {
  params: Promise<{
    id: string;
    ecoId: string;
  }>;
};

const ULTRASOUND_TYPE_BADGES: Record<string, string> = {
  FIRST_TRIMESTER: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  SECOND_THIRD_TRIMESTER: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  GYNECOLOGICAL: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

export default async function UltrasoundDetailPage({
  params,
}: UltrasoundDetailPageProps) {
  const { id: patientId, ecoId } = await params;

  let ultrasound;
  try {
    ultrasound = await getUltrasound(ecoId);
  } catch {
    notFound();
  }

  if (ultrasound.patientId !== patientId) {
    notFound();
  }

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const patientCedula = safeDecrypt(ultrasound.patient.cedula);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", { dateStyle: "long" });
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" });
  };

  const m = (ultrasound.measurements as Record<string, any>) || {};

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="ecografias"
      />

      {/* Sub-header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Ecografías
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <Badge variant="outline" className={`text-[11px] ${ULTRASOUND_TYPE_BADGES[ultrasound.type] || ""}`}>
            {ultrasoundTypeLabels[ultrasound.type]}
          </Badge>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono tabular-nums flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(ultrasound.date)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="shadow-sm">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias/${ecoId}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild size="sm" className="shadow-sm">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias/${ecoId}/imprimir`} target="_blank">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Link>
          </Button>
          <DeleteUltrasoundButton
            ultrasoundId={ecoId}
            patientId={patientId}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient & Pregnancy Info */}
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 border-l-pink-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Baby className="h-5 w-5 text-pink-500" />
                Datos Obstétricos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <InfoRow label="Estado de embarazo" value={pregnancyStatusLabels[ultrasound.patient.pregnancyStatus]} icon={Baby} />
                {ultrasound.gestationalAge && (
                  <InfoRow label="Edad gestacional" value={ultrasound.gestationalAge} icon={Calendar} />
                )}
                {ultrasound.lastMenstrualPeriod && (
                  <InfoRow label="FUM" value={formatDate(ultrasound.lastMenstrualPeriod)} icon={Calendar} />
                )}
                {ultrasound.estimatedDueDate && (
                  <InfoRow label="FPP" value={formatDate(ultrasound.estimatedDueDate)} icon={Calendar} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          {(ultrasound.weight || ultrasound.height || ultrasound.bloodPressure) && (
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-5 w-5 text-red-500" />
                  Signos Vitales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ultrasound.weight && <InfoRow label="Peso" value={`${ultrasound.weight} kg`} icon={Scale} />}
                  {ultrasound.height && <InfoRow label="Talla" value={`${ultrasound.height} cm`} icon={Ruler} />}
                  {ultrasound.bloodPressure && <InfoRow label="PA" value={`${ultrasound.bloodPressure} mmHg`} icon={Activity} />}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reason for Study */}
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-5 w-5 text-primary" />
                Motivo del Estudio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {ultrasound.reasonForStudy}
              </div>
            </CardContent>
          </Card>

          {/* Measurements */}
          {Object.keys(m).length > 0 && (
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ruler className="h-5 w-5 text-amber-500" />
                  Mediciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(m).map(([key, value]) => {
                    if (value === null || value === undefined || value === "") return null;
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono tabular-nums">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Findings */}
          {ultrasound.otherFindings && (
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-slate-500" />
                  Otros Hallazgos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {ultrasound.otherFindings}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Diagnosis */}
          <Card className="shadow-sm border-0 ring-1 ring-purple-200/50 dark:ring-purple-800/50 border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-purple-700 dark:text-purple-400">
                <Stethoscope className="h-5 w-5" />
                Diagnóstico / Conclusiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 text-sm text-purple-900 dark:text-purple-300 whitespace-pre-wrap leading-relaxed">
                {ultrasound.diagnoses}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {ultrasound.recommendations && (
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {ultrasound.recommendations}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Images */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-5 w-5 text-primary" />
                Imágenes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UltrasoundImageUploader
                ultrasoundId={ecoId}
                images={ultrasound.images}
              />
            </CardContent>
          </Card>
        </div>
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
