import React, { Suspense } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/server/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Panel Médico
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
            Bienvenida de nuevo, Dra. Kristhy. Aquí tiene un resumen de la actividad reciente de su consultorio y sus próximas citas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="shadow-sm hover:shadow-md transition-all">
            <Link href="/dashboard/pacientes/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            <Link href="/dashboard/citas/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats + Content with Suspense */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <>
      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pacientes Activos"
          value={stats.totalPatients}
          icon={Users}
          color="blue"
          trend="+12% este mes"
        />
        <StatsCard
          title="Citas Hoy"
          value={stats.todayAppointments}
          icon={Calendar}
          color="emerald"
          trend="Programadas hoy"
        />
        <StatsCard
          title="Pendientes"
          value={stats.pendingAppointments}
          icon={Clock}
          color="amber"
          trend="Requieren atención"
        />
        <StatsCard
          title="Atendidas (Mes)"
          value={stats.monthAppointments}
          icon={CalendarCheck}
          color="rose"
          trend="Total completado"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Upcoming Appointments */}
        <Card className="xl:col-span-2 shadow-sm border-0 ring-1 ring-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Próximas Citas</CardTitle>
              <CardDescription>Pacientes programados para hoy y mañana</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link href="/dashboard/citas">
                Ver calendario
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.upcomingAppointments.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <Calendar className="h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No hay citas próximas programadas.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {stats.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span className="text-lg font-bold">
                          {new Date(appointment.date).toLocaleTimeString("es-VE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <Link href={`/dashboard/citas/${appointment.id}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </Link>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary/40"></span>
                          {formatAppointmentType(appointment.type)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {new Date(appointment.date).toLocaleDateString("es-VE", { weekday: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Pacientes</CardTitle>
              <CardDescription>Registrados recientemente</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-primary">
              <Link href="/dashboard/pacientes">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentPatients.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No hay pacientes recientes.
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {stats.recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/dashboard/pacientes/${patient.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        CI: {patient.cedula}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(patient.createdAt).toLocaleDateString("es-VE", { day: 'numeric', month: 'short' })}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 ring-1 ring-slate-200/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
              </div>
              <div className="mt-4 h-3 w-20 animate-pulse rounded bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-sm border-0 ring-1 ring-slate-200/50">
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

const STATS_COLOR_STYLES: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
};

function StatsCard({ title, value, icon: Icon, color, trend }: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: string;
}) {
  return (
    <Card className="border-0 ring-1 ring-slate-200/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{value}</p>
          </div>
          <div className={`rounded-xl p-3 ${STATS_COLOR_STYLES[color] || STATS_COLOR_STYLES.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatAppointmentType(type: string) {
  switch (type) {
    case "prenatal":
      return "Control Prenatal";
    case "gynecology":
      return "Ginecología";
    case "ultrasound":
      return "Ecografía";
    case "followup":
      return "Consulta Control";
    default:
      return type;
  }
}
