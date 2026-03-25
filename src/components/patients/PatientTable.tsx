"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { memo, useCallback } from "react";
import { User, Phone, ChevronRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { fmt, dateShortFormatter } from "@/lib/utils/formatters";

type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string | null;
    phone: string | null;
    gender: string;
    dateOfBirth: Date;
    city: string | null;
    createdAt?: Date;
};

type PatientTableProps = {
    patients: Patient[];
    query?: string;
};

// as const satisfies: V8 optimiza hidden class + TS infiere tipos literales exactos
// satisfies valida la forma del objeto sin ampliar el tipo a Record<string, string>
const genderIndicator = {
    female: "bg-pink-400",
    male:   "bg-blue-400",
    other:  "bg-slate-400",
} as const satisfies Record<string, string>;

// Componente de fila extraído y memoizado — React.memo previene re-renders
// cuando el padre actualiza estado que no afecta esta fila específica
const PatientRow = memo(function PatientRow({
    patient,
    onRowClick,
}: {
    patient: Patient;
    onRowClick: (id: string) => void;
}) {
    // useCallback con dependencia en patient.id (primitivo estable)
    // sigue la regla rerender-dependencies: usar primitivos en deps, no objetos
    const handleClick = useCallback(() => onRowClick(patient.id), [patient.id, onRowClick]);

    const indicator = genderIndicator[patient.gender as keyof typeof genderIndicator]
        ?? genderIndicator.other;

    return (
        <TableRow
            className="group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/30"
            onClick={handleClick}
        >
            <TableCell className="pl-6 font-medium">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary ring-2 ring-secondary/20 group-hover:ring-secondary/40 transition-all">
                        <span className="text-sm font-semibold">
                            {patient.firstName[0]}{patient.lastName[0]}
                        </span>
                        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 ${indicator}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-slate-100 font-medium">
                            {patient.firstName} {patient.lastName}
                        </span>
                        {patient.createdAt && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {fmt(dateShortFormatter, patient.createdAt)}
                            </span>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    {patient.cedula || "—"}
                </Badge>
            </TableCell>
            <TableCell className="text-slate-600 dark:text-slate-400">
                {patient.phone ? (
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {patient.phone}
                    </div>
                ) : (
                    <span className="text-slate-400 italic text-sm">Sin teléfono</span>
                )}
            </TableCell>
            <TableCell className="text-right pr-6">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 text-primary hover:text-primary hover:bg-primary/5 transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Link href={`/dashboard/pacientes/${patient.id}`}>
                        Ver Expediente
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:hidden inline-block" />
            </TableCell>
        </TableRow>
    );
});

// memo en el componente raíz previene re-renders cuando el layout padre
// actualiza estado propio que no cambia patients ni query
export const PatientTable = memo(function PatientTable({ patients, query }: PatientTableProps) {
    const router = useRouter();

    // useCallback estable — router es una referencia estable en Next.js App Router
    const handleRowClick = useCallback((patientId: string) => {
        router.push(`/dashboard/pacientes/${patientId}`);
    }, [router]);

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                    <TableHead className="w-[300px] pl-6 text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Paciente</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Identificación</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Contacto</TableHead>
                    <TableHead className="text-right pr-6 text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                            {query
                                ? `No se encontraron pacientes con "${query}"`
                                : "No hay pacientes registrados. Crea el primero para empezar."}
                        </TableCell>
                    </TableRow>
                ) : (
                    patients.map((patient) => (
                        <PatientRow
                            key={patient.id}
                            patient={patient}
                            onRowClick={handleRowClick}
                        />
                    ))
                )}
            </TableBody>
        </Table>
    );
});
