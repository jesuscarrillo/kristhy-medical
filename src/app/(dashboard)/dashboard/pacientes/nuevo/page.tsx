import Link from "next/link";
import { PatientForm } from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function NewPatientPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10 space-y-8">
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href="/dashboard/pacientes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Nuevo Paciente</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Completa la información básica del paciente.
        </p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" />
            Datos del Paciente
          </CardTitle>
          <CardDescription>
            Ingresa los datos personales, contacto y antecedentes clínicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PatientForm />
        </CardContent>
      </Card>
    </div>
  );
}
