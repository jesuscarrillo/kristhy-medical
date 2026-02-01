"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Phone, ChevronRight } from "lucide-react";
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
    // Add other fields as necessary from the server action return type
};

type PatientTableProps = {
    patients: Patient[];
    query?: string;
};

export function PatientTable({ patients, query }: PatientTableProps) {
    const router = useRouter();

    const handleRowClick = (patientId: string) => {
        router.push(`/dashboard/pacientes/${patientId}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                    <TableHead className="w-[300px] pl-6">Nombre Completo</TableHead>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
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
                            className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                            onClick={() => handleRowClick(patient.id)}
                        >
                            <TableCell className="pl-6 font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-slate-100">
                                            {patient.firstName} {patient.lastName}
                                        </span>
                                        <span className="text-xs text-slate-500 hidden sm:inline-block">
                                            Registrada el{" "}
                                            {patient.createdAt
                                                ? new Date(patient.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-600">
                                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10">
                                    {patient.cedula}
                                </span>
                            </TableCell>
                            <TableCell className="text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                                    {patient.phone}
                                </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="hidden group-hover:inline-flex text-primary hover:text-primary hover:bg-primary/5"
                                    onClick={(e) => e.stopPropagation()} // Prevent double click event if button is clicked
                                >
                                    <Link href={`/dashboard/pacientes/${patient.id}`}>
                                        Ver Expediente
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="group-hover:hidden text-slate-400"
                                >
                                    <Link href={`/dashboard/pacientes/${patient.id}`}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
