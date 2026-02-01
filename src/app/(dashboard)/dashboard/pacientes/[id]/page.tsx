import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { DeletePatientButton } from "./DeletePatientButton";
import { pregnancyStatusLabels } from "@/lib/validators/patient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft
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

  const tabs = [
    { label: "Resumen", href: `/dashboard/pacientes/${patientId}`, active: true },
    { label: "Historial Clínico", href: `/dashboard/pacientes/${patientId}/historial`, active: false },
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
          <Link href="/dashboard/pacientes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Link>
        </Button>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-3xl font-bold text-secondary shadow-inner">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-3">
              <Badge variant="outline" className="text-slate-500 bg-slate-50 border-slate-200">
                Historial: {patient.medicalRecordNumber}
              </Badge>
              <Badge variant="outline" className="text-slate-500 bg-slate-50 border-slate-200">
                CI: {patient.cedula}
              </Badge>
              {isFemale && patient.pregnancyStatus && patient.pregnancyStatus !== "NOT_PREGNANT" && (
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">
                  {pregnancyStatusLabels[patient.pregnancyStatus as keyof typeof pregnancyStatusLabels]}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
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
        </div>
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

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Personal info */}
        <div className="space-y-8">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Edad" value={`${calculateAge(patient.dateOfBirth)} años`} />
              <InfoRow
                label="Fecha de Nacimiento"
                value={new Date(patient.dateOfBirth).toLocaleDateString("es-VE")}
                icon={Calendar}
              />
              <InfoRow label="Género" value={patient.gender === "female" ? "Femenino" : "Masculino"} />
              <InfoRow label="Tipo de Sangre" value={patient.bloodType} fallback="—" />
              <InfoRow label="Altura" value={patient.height ? `${patient.height} cm` : undefined} fallback="—" />
              <InfoRow label="Peso" value={patient.weight ? `${patient.weight} kg` : undefined} fallback="—" />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Teléfono" value={patient.phone} fallback="—" />
              <InfoRow label="Email" value={patient.email} fallback="—" icon={Mail} />
              <InfoRow label="Dirección" value={patient.address} fallback="—" icon={MapPin} />
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 mb-1">Contacto de Emergencia</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{patient.emergencyContact || "No registrado"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column: Clinical Summary & Notes */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-500" />
                Resumen Clínico
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-rose-50/50 p-4 border border-rose-100">
                <h3 className="flex items-center gap-2 font-semibold text-rose-700 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Alergias
                </h3>
                <p className="text-sm text-slate-700">
                  {patient.allergies || "No reporta alergias conocidas."}
                </p>
              </div>

              {isFemale && (
                <div className="rounded-lg bg-purple-50/50 p-4 border border-purple-100">
                  <h3 className="flex items-center gap-2 font-semibold text-purple-700 mb-2">
                    <HeartPulse className="h-4 w-4" />
                    Estado Ginecológico
                  </h3>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p><span className="font-semibold">Estado:</span> {pregnancyStatusLabels[patient.pregnancyStatus as keyof typeof pregnancyStatusLabels] || "No especificado"}</p>
                    {/* Accessing gynecologicalProfile if joined, but currently singular fetch doesn't guarantee it without check */}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
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

function InfoRow({ label, value, fallback, icon: Icon }: any) {
  return (
    <div className="flex items-start justify-between group">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {Icon && <Icon className="h-3.5 w-3.5" />}
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

function QuickActionCard({ href, title, subtitle, color }: any) {
  const colorClasses = {
    blue: "hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
    green: "hover:border-green-200 hover:bg-green-50/50 dark:hover:bg-green-900/20",
    amber: "hover:border-amber-200 hover:bg-amber-50/50 dark:hover:bg-amber-900/20",
    slate: "hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
  };

  return (
    <Link
      href={href}
      className={`
                flex flex-col justify-center rounded-xl p-4 border border-slate-200 bg-white shadow-sm transition-all
                ${colorClasses[color as keyof typeof colorClasses]}
            `}
    >
      <span className="font-semibold text-slate-800 dark:text-slate-100">{title}</span>
      <span className="text-xs text-slate-500">{subtitle}</span>
    </Link>
  )
}
