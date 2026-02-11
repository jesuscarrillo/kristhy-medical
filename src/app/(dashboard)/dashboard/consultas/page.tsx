import { Suspense } from "react";
import Link from "next/link";
import { getAllMedicalRecords } from "@/server/actions/medicalRecord";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  ArrowRight,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

const consultationTypeLabels: Record<string, string> = {
  prenatal: "Prenatal",
  gynecology: "Ginecología",
  emergency: "Emergencia",
  followup: "Control",
};

const TYPE_STYLES: Record<string, { border: string; badge: string }> = {
  prenatal: {
    border: "border-l-pink-400",
    badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  },
  gynecology: {
    border: "border-l-purple-400",
    badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  emergency: {
    border: "border-l-red-400",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  followup: {
    border: "border-l-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
};

export default function ConsultationsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Consultas Médicas</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Historial reciente de atenciones y consultas.
          </p>
        </div>
      </div>

      <Suspense fallback={<ConsultasSkeleton />}>
        <ConsultasContent />
      </Suspense>
    </div>
  );
}

async function ConsultasContent() {
  const records = await getAllMedicalRecords();

  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {records.length} consulta{records.length !== 1 ? "s" : ""} recientes
      </p>

      <div className="space-y-3">
        {records.length === 0 ? (
          <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/30">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                <Stethoscope className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-base font-medium text-slate-600 dark:text-slate-300">No hay consultas registradas</p>
              <p className="text-sm text-slate-400 mt-1">Las consultas aparecerán aquí cuando se registren historiales clínicos.</p>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => {
            const typeStyle = TYPE_STYLES[record.consultationType] || { border: "border-l-slate-300", badge: "" };
            return (
              <Link
                key={record.id}
                href={`/dashboard/pacientes/${record.patientId}/historial/${record.id}`}
                className="group block"
              >
                <Card className={`border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 ${typeStyle.border} transition-all hover:shadow-md hover:ring-primary/30`}>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      {/* Time Block */}
                      <div className="flex h-14 w-16 flex-col items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800/50 shrink-0">
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none tabular-nums">
                          {new Date(record.date).toLocaleTimeString("es-VE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                          {new Date(record.date).toLocaleDateString("es-VE", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${typeStyle.badge}`}>
                            {consultationTypeLabels[record.consultationType] || record.consultationType}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {record.chiefComplaint}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{record.patient?.firstName} {record.patient?.lastName}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

function ConsultasSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 border-l-slate-200 dark:border-l-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
