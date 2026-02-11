import Link from "next/link";
import { notFound } from "next/navigation";
import { getMedicalRecord } from "@/server/actions/medicalRecord";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { DeleteRecordButton } from "./DeleteRecordButton";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Stethoscope,
  FileText,
  Activity,
  Heart,
  Baby,
  Clock,
  ClipboardList,
} from "lucide-react";

type MedicalRecordDetailPageProps = {
  params: Promise<{
    id: string;
    recordId: string;
  }>;
};

const CONSULTATION_TYPE_CONFIG: Record<string, { label: string; border: string; badge: string }> = {
  prenatal: {
    label: "Prenatal",
    border: "border-l-pink-400",
    badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  },
  gynecology: {
    label: "Ginecología",
    border: "border-l-purple-400",
    badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  emergency: {
    label: "Emergencia",
    border: "border-l-red-400",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  followup: {
    label: "Control",
    border: "border-l-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
};

function DetailSection({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (!value) return null;
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-slate-400 shrink-0" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      </div>
      <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">{value}</p>
    </div>
  );
}

export default async function MedicalRecordDetailPage({
  params,
}: MedicalRecordDetailPageProps) {
  const { id: patientId, recordId } = await params;

  let record;
  try {
    record = await getMedicalRecord(recordId);
  } catch {
    notFound();
  }

  if (record.patientId !== patientId) {
    notFound();
  }

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const typeConfig = CONSULTATION_TYPE_CONFIG[record.consultationType] || {
    label: record.consultationType,
    border: "border-l-slate-400",
    badge: "",
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleString("es-VE", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="historial"
      />

      {/* Record Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
            <Link href={`/dashboard/pacientes/${patientId}/historial`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Historial
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <Badge variant="outline" className={`text-[11px] ${typeConfig.badge}`}>
            {typeConfig.label}
          </Badge>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono tabular-nums flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(record.date)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="shadow-sm">
            <Link href={`/dashboard/pacientes/${patientId}/historial/${recordId}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeleteRecordButton recordId={recordId} patientId={patientId} />
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={`shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 ${typeConfig.border}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-5 w-5 text-primary" />
              Consulta Médica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <DetailSection label="Motivo de consulta" value={record.chiefComplaint} icon={ClipboardList} />
              <DetailSection label="Síntomas" value={record.symptoms} icon={Activity} />
              <DetailSection label="Signos vitales" value={record.vitalSigns} icon={Heart} />
              <DetailSection label="Examen físico" value={record.physicalExam} icon={Stethoscope} />
              <DetailSection label="Diagnóstico" value={record.diagnosis} icon={FileText} />
              <DetailSection label="Tratamiento" value={record.treatment} icon={FileText} />
              <DetailSection label="Plan de tratamiento" value={record.treatmentPlan} icon={ClipboardList} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-blue-500" />
              Antecedentes y Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <DetailSection label="Antecedentes personales" value={record.personalHistory} icon={Heart} />
              <DetailSection label="Antecedentes ginecológicos" value={record.gynecologicHistory} icon={Activity} />
              <DetailSection label="Antecedentes obstétricos" value={record.obstetricalHistory} icon={Baby} />
              {record.followUpDate && (
                <DetailSection label="Fecha de seguimiento" value={formatDate(record.followUpDate)} icon={Clock} />
              )}
              <DetailSection label="Notas" value={record.notes} icon={FileText} />
            </div>

            {/* Empty state if no antecedents */}
            {!record.personalHistory && !record.gynecologicHistory && !record.obstetricalHistory && !record.notes && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-slate-400">Sin antecedentes ni notas registradas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-4 pt-2">
        <span>Creado: {formatDate(record.createdAt)}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span>Actualizado: {formatDate(record.updatedAt)}</span>
      </div>
    </div>
  );
}
