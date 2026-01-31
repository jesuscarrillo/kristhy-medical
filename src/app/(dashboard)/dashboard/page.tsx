import Link from "next/link";
import { getDashboardStats } from "@/server/actions/dashboard";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Panel Médico</h1>
          <p className="text-sm text-slate-600">
            Bienvenida, Dra. Kristhy. Resumen de tu consultorio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/pacientes/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/citas/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pacientes Activos</p>
              <p className="mt-1 text-3xl font-semibold">{stats.totalPatients}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Citas Hoy</p>
              <p className="mt-1 text-3xl font-semibold">{stats.todayAppointments}</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Citas Pendientes</p>
              <p className="mt-1 text-3xl font-semibold">{stats.pendingAppointments}</p>
            </div>
            <div className="rounded-full bg-yellow-50 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Atendidas Este Mes</p>
              <p className="mt-1 text-3xl font-semibold">{stats.monthAppointments}</p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <CalendarCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Próximas Citas</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/citas">
                Ver todas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {stats.upcomingAppointments.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              No hay citas programadas.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/dashboard/citas/${appointment.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-medium">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatAppointmentType(appointment.type)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(appointment.date).toLocaleDateString("es-VE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(appointment.date).toLocaleTimeString("es-VE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pacientes Recientes</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/pacientes">
                Ver todos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {stats.recentPatients.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              No hay pacientes registrados.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentPatients.map((patient) => (
                <Link
                  key={patient.id}
                  href={`/dashboard/pacientes/${patient.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      Cédula: {patient.cedula}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(patient.createdAt).toLocaleDateString("es-VE")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatAppointmentType(type: string) {
  switch (type) {
    case "prenatal":
      return "Prenatal";
    case "gynecology":
      return "Ginecología";
    case "ultrasound":
      return "Ecografía";
    case "followup":
      return "Control";
    default:
      return type;
  }
}
