import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { PatientForm } from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { Save } from "lucide-react";

type EditPatientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPatientPage({ params }: EditPatientPageProps) {
  const resolvedParams = await params;
  let patient;
  try {
    patient = await getPatient(resolvedParams.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={resolvedParams.id}
        activeTab="resumen"
        showActions={false}
      />

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Save className="h-5 w-5 text-primary" />
            Editar Datos del Paciente
          </CardTitle>
          <CardDescription>
            Actualiza la información personal, contacto y datos clínicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PatientForm
            patientId={resolvedParams.id}
            initialData={{
              firstName: patient.firstName,
              lastName: patient.lastName,
              cedula: patient.cedula,
              dateOfBirth: patient.dateOfBirth,
              gender: patient.gender as "female" | "male" | "other",
              phone: patient.phone,
              email: patient.email,
              address: patient.address,
              city: patient.city,
              state: patient.state,
              bloodType: patient.bloodType,
              allergies: patient.allergies,
              emergencyContact: patient.emergencyContact,
              notes: patient.notes,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
