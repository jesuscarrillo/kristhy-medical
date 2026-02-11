import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { DeletePatientButton } from "./DeletePatientButton";
import { pregnancyStatusLabels } from "@/lib/validators/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HeartPulse,
  AlertCircle,
  FileText,
  Activity,
  Edit,
  Ruler,
  Weight,
  Droplets,
} from "lucide-react";

type PatientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const resolvedParams = await params;
  let patient;
  try {
    patient = await getPatient(resolvedParams.id);
  } catch {
    notFound();
  }

  const patientId = resolvedParams.id;
  const isFemale = patient.gender === "female";

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="resumen"
        actions={
          <>
            <Button asChild variant="outline" className="shadow-sm">
              <Link href={`/dashboard/pacientes/${patientId}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Datos
              </Link>
            </Button>
            <DeletePatientButton
              patientId={patientId}
              patientName={`${patient.firstName} ${patient.lastName}`}
            />
          </>
        }
      />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Personal info */}
        <div className="space-y-8">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <InfoRow label="Edad" value={`${calculateAge(patient.dateOfBirth)} años`} icon={Calendar} />
                <InfoRow
                  label="Fecha de Nacimiento"
                  value={new Date(patient.dateOfBirth).toLocaleDateString("es-VE")}
                  icon={Calendar}
                />
                <InfoRow label="Género" value={patient.gender === "female" ? "Femenino" : "Masculino"} icon={User} />
                <InfoRow label="Tipo de Sangre" value={patient.bloodType} fallback="—" icon={Droplets} />
                <InfoRow label="Altura" value={patient.height ? `${patient.height} cm` : undefined} fallback="—" icon={Ruler} />
                <InfoRow label="Peso" value={patient.weight ? `${patient.weight} kg` : undefined} fallback="—" icon={Weight} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <InfoRow label="Teléfono" value={patient.phone} fallback="—" icon={Phone} />
                <InfoRow label="Email" value={patient.email} fallback="—" icon={Mail} />
                <InfoRow label="Dirección" value={patient.address} fallback="—" icon={MapPin} />
                <div className="pt-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Contacto de Emergencia</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{patient.emergencyContact || "No registrado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column: Clinical Summary & Notes */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-500" />
                Resumen Clínico
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border-l-4 border-l-rose-400 bg-white dark:bg-slate-900/50 p-4 ring-1 ring-slate-100 dark:ring-slate-800">
                <h3 className="flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-400 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Alergias
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {patient.allergies || "No reporta alergias conocidas."}
                </p>
              </div>

              {isFemale && (
                <div className="rounded-lg border-l-4 border-l-purple-400 bg-white dark:bg-slate-900/50 p-4 ring-1 ring-slate-100 dark:ring-slate-800">
                  <h3 className="flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-400 mb-2">
                    <HeartPulse className="h-4 w-4" />
                    Estado Ginecológico
                  </h3>
                  <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <p><span className="font-semibold">Estado:</span> {pregnancyStatusLabels[patient.pregnancyStatus as keyof typeof pregnancyStatusLabels] || "No especificado"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Notas del Expediente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[100px] rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-600 dark:text-slate-300">
                {patient.notes || "No hay notas adicionales registradas en este expediente."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, fallback, icon: Icon }: {
  label: string;
  value?: string | null;
  fallback?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between py-3 first:pt-0 last:pb-0 group">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right max-w-[200px] break-words">
        {value || <span className="text-slate-400 italic">{fallback}</span>}
      </div>
    </div>
  );
}

function calculateAge(dateOfBirth: Date) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
