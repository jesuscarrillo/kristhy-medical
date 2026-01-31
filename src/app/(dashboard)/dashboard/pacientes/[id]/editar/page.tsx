import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { PatientForm } from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";

type EditPatientPageProps = {
  params: Promise<{
    id: string;
  }>;
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
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Editar paciente</h1>
          <p className="text-sm text-slate-600">Actualiza los datos del paciente.</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/pacientes/${resolvedParams.id}`}>Volver</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
      </div>
    </div>
  );
}
