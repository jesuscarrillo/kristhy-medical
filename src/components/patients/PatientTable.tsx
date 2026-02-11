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
import { useCallback } from "react";
import { User, Phone, ChevronRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

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

const genderIndicator: Record<string, string> = {
    female: "bg-pink-400",
    male: "bg-blue-400",
    other: "bg-slate-400",
};

export function PatientTable({ patients, query }: PatientTableProps) {
    const router = useRouter();

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
                        <TableRow
                            key={patient.id}
                            className="group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/30"
                            onClick={() => handleRowClick(patient.id)}
                        >
                            <TableCell className="pl-6 font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary ring-2 ring-secondary/20 group-hover:ring-secondary/40 transition-all">
                                        <span className="text-sm font-semibold">
                                            {patient.firstName[0]}{patient.lastName[0]}
                                        </span>
                                        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 ${genderIndicator[patient.gender] || genderIndicator.other}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-slate-100 font-medium">
                                            {patient.firstName} {patient.lastName}
                                        </span>
                                        {patient.createdAt && (
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(patient.createdAt).toLocaleDateString("es-VE", { day: 'numeric', month: 'short', year: 'numeric' })}
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
                    ))
                )}
            </TableBody>
        </Table>
    );
}
