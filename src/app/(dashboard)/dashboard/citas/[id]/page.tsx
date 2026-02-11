import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointment } from "@/server/actions/appointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteAppointmentButton } from "./DeleteAppointmentButton";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  User,
  FileText,
  Stethoscope,
  Activity,
} from "lucide-react";

type AppointmentDetailPageProps = {
  params: Promise<{ id: string }>;
};

const TYPE_BADGES: Record<string, string> = {
  prenatal: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  gynecology: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  ultrasound: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  followup: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
};

const STATUS_BADGES: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  noshow: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
};

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const resolvedParams = await params;
  let appointment;
  try {
    appointment = await getAppointment(resolvedParams.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10 space-y-8">
      {/* Back Navigation */}
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href="/dashboard/citas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a citas
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 h-20 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent dark:from-primary/10 dark:via-secondary/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between pt-5 px-2">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary shadow-inner ring-4 ring-white dark:ring-slate-900">
              {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`text-[11px] ${TYPE_BADGES[appointment.type] || ""}`}>
                  {formatAppointmentType(appointment.type)}
                </Badge>
                <Badge variant="outline" className={`text-[11px] ${STATUS_BADGES[appointment.status] || ""}`}>
                  {formatAppointmentStatus(appointment.status)}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(appointment.date).toLocaleString("es-VE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant="outline" size="sm" className="shadow-sm">
              <Link href={`/dashboard/pacientes/${appointment.patientId}`}>
                <User className="mr-2 h-4 w-4" />
                Ver Paciente
              </Link>
            </Button>
            <Button asChild size="sm" className="shadow-sm">
              <Link href={`/dashboard/citas/${resolvedParams.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <DeleteAppointmentButton
              appointmentId={resolvedParams.id}
              patientName={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-5 w-5 text-primary" />
              Detalle de la Cita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <DetailRow
                label="Tipo"
                value={formatAppointmentType(appointment.type)}
                icon={Activity}
              />
              <DetailRow
                label="Estado"
                value={formatAppointmentStatus(appointment.status)}
                icon={Clock}
              />
              <DetailRow
                label="Duración"
                value={`${appointment.duration} min`}
                icon={Clock}
              />
              <DetailRow
                label="Motivo"
                value={appointment.reason || "—"}
                icon={FileText}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-blue-500" />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[120px] rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-600 dark:text-slate-300">
              {appointment.notes || "Sin notas registradas."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
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

function formatAppointmentType(type: string) {
  switch (type) {
    case "prenatal": return "Prenatal";
    case "gynecology": return "Ginecología";
    case "ultrasound": return "Ecografía";
    case "followup": return "Control";
    default: return type;
  }
}

function formatAppointmentStatus(status: string) {
  switch (status) {
    case "scheduled": return "Programada";
    case "completed": return "Completada";
    case "cancelled": return "Cancelada";
    case "noshow": return "No asistió";
    default: return status;
  }
}
