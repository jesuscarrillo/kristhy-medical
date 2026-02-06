import { Suspense } from "react";
import Link from "next/link";
import { getAllMedicalRecords } from "@/server/actions/medicalRecord";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    User,
    ArrowRight
} from "lucide-react";

const consultationTypeLabels: Record<string, string> = {
    prenatal: "Prenatal",
    gynecology: "Ginecología",
    emergency: "Emergencia",
    followup: "Control",
};

const consultationTypeColors: Record<string, string> = {
    prenatal: "bg-purple-100 text-purple-700 border-purple-200",
    gynecology: "bg-rose-100 text-rose-700 border-rose-200",
    emergency: "bg-red-100 text-red-700 border-red-200",
    followup: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function ConsultationsPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Consultas Médicas</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
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
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold">Últimos Registros</CardTitle>
                        <CardDescription>Mostrando las últimas 50 consultas.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {records.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No hay consultas registradas en el sistema.
                        </div>
                    ) : (
                        records.map((record) => (
                            <Link
                                key={record.id}
                                href={`/dashboard/pacientes/${record.patientId}/historial/${record.id}`}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Badge variant="outline" className={`${consultationTypeColors[record.consultationType] || "bg-slate-100 text-slate-700"} border px-2 py-0.5`}>
                                            {consultationTypeLabels[record.consultationType] || record.consultationType}
                                        </Badge>
                                        <span className="text-xs text-slate-500 flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(record.date).toLocaleString("es-VE", {
                                                dateStyle: "medium", timeStyle: "short"
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {record.chiefComplaint}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                        <User className="h-3 w-3" />
                                        <span>Paciente: <span className="font-medium text-slate-700 dark:text-slate-300">{record.patient?.firstName} {record.patient?.lastName}</span></span>
                                    </div>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="text-slate-400">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function ConsultasSkeleton() {
    return (
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="space-y-2">
                    <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
                </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                        <div className="h-14 animate-pulse rounded bg-slate-100" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
