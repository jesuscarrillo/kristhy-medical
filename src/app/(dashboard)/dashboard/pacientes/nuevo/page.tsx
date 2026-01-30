import Link from "next/link";
import { PatientForm } from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";

export default function NewPatientPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Nuevo paciente</h1>
          <p className="text-sm text-slate-600">
            Completa la información básica del paciente.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/pacientes">Volver</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PatientForm />
      </div>
    </div>
  );
}
