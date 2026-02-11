import React, { Suspense } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/server/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  Baby,
  Scan,
  ClipboardCheck
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary/80 mb-1">Bienvenida, Dra. Kristhy</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Panel Médico
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
            Aquí tiene un resumen de la actividad reciente de su consultorio y sus próximas citas.
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
          trendUp
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
          trendUp
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Upcoming Appointments */}
        <Card className="xl:col-span-2 shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
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
              <div className="space-y-3 pt-4">
                {stats.upcomingAppointments.map((appointment) => {
                  const typeColor = APPOINTMENT_TYPE_COLORS[appointment.type] || APPOINTMENT_TYPE_COLORS.default;
                  return (
                    <div
                      key={appointment.id}
                      className={`group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800 ${typeColor.border}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-14 flex-col items-center justify-center rounded-lg ${typeColor.timeBg} transition-colors`}>
                          <span className={`text-sm font-bold leading-none ${typeColor.timeText}`}>
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
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${typeColor.badge}`}>
                              {formatAppointmentType(appointment.type)}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {new Date(appointment.date).toLocaleDateString("es-VE", { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
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
              <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
                {stats.recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/dashboard/pacientes/${patient.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary ring-2 ring-secondary/20">
                      <span className="text-sm font-semibold">{patient.firstName[0]}{patient.lastName[0]}</span>
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
          <Card key={i} className="border-0 ring-1 ring-slate-200/50 shadow-sm overflow-hidden">
            <div className="h-1 w-full animate-pulse bg-slate-200" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 w-16 animate-pulse rounded bg-slate-200" />
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

const STATS_BORDER_COLORS: Record<string, string> = {
  blue: "border-t-blue-500",
  emerald: "border-t-emerald-500",
  amber: "border-t-amber-500",
  rose: "border-t-rose-500",
};

const STATS_ICON_STYLES: Record<string, string> = {
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-900/30 dark:to-blue-800/20 dark:text-blue-400",
  emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:text-emerald-400",
  amber: "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 dark:from-amber-900/30 dark:to-amber-800/20 dark:text-amber-400",
  rose: "bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 dark:from-rose-900/30 dark:to-rose-800/20 dark:text-rose-400",
};

const STATS_TREND_COLORS: Record<string, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

function StatsCard({ title, value, icon: Icon, color, trend, trendUp }: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className={`border-0 border-t-4 ${STATS_BORDER_COLORS[color] || STATS_BORDER_COLORS.blue} ring-1 ring-slate-200/50 dark:ring-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{value}</p>
          </div>
          <div className={`rounded-xl p-3 ${STATS_ICON_STYLES[color] || STATS_ICON_STYLES.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            {trendUp ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${STATS_TREND_COLORS[color]?.includes('amber') ? 'bg-amber-500' : 'bg-slate-400'}`} />
            )}
            <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const APPOINTMENT_TYPE_COLORS: Record<string, { border: string; timeBg: string; timeText: string; badge: string }> = {
  prenatal: {
    border: "border-l-4 border-l-pink-400",
    timeBg: "bg-pink-50 dark:bg-pink-900/20",
    timeText: "text-pink-600 dark:text-pink-400",
    badge: "border-pink-200 text-pink-700 bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:bg-pink-900/20",
  },
  gynecology: {
    border: "border-l-4 border-l-purple-400",
    timeBg: "bg-purple-50 dark:bg-purple-900/20",
    timeText: "text-purple-600 dark:text-purple-400",
    badge: "border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-900/20",
  },
  ultrasound: {
    border: "border-l-4 border-l-blue-400",
    timeBg: "bg-blue-50 dark:bg-blue-900/20",
    timeText: "text-blue-600 dark:text-blue-400",
    badge: "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20",
  },
  followup: {
    border: "border-l-4 border-l-emerald-400",
    timeBg: "bg-emerald-50 dark:bg-emerald-900/20",
    timeText: "text-emerald-600 dark:text-emerald-400",
    badge: "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/20",
  },
  default: {
    border: "border-l-4 border-l-slate-300",
    timeBg: "bg-slate-50 dark:bg-slate-800",
    timeText: "text-slate-600 dark:text-slate-400",
    badge: "border-slate-200 text-slate-700 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-800",
  },
};

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
