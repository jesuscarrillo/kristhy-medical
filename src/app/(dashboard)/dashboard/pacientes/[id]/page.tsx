import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { DeletePatientButton } from "./DeletePatientButton";
import { pregnancyStatusLabels } from "@/lib/validators/patient";

type PatientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const resolvedParams = await params;
  let patient;
  try {
    patient = await getPatient(resolvedParams.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-sm text-slate-600">
            Historia: {patient.medicalRecordNumber} • Cédula: {patient.cedula}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/pacientes">Volver</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${resolvedParams.id}/historial`}>
              Historial
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${resolvedParams.id}/imagenes`}>
              Imágenes
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${resolvedParams.id}/prescripciones`}>
              Prescripciones
            </Link>
          </Button>
          {patient.gender === "female" && (
            <Button asChild variant="outline">
              <Link href={`/dashboard/pacientes/${resolvedParams.id}/ecografias`}>
                Ecografías
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${resolvedParams.id}/certificados`}>
              Certificados
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/pacientes/${resolvedParams.id}/editar`}>Editar</Link>
          </Button>
          <DeletePatientButton
            patientId={resolvedParams.id}
            patientName={`${patient.firstName} ${patient.lastName}`}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Contacto</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">Teléfono:</span> {patient.phone}
            </p>
            <p>
              <span className="font-medium">Email:</span> {patient.email || "—"}
            </p>
            <p>
              <span className="font-medium">Dirección:</span> {patient.address}
            </p>
            <p>
              <span className="font-medium">Ciudad:</span> {patient.city}
            </p>
            <p>
              <span className="font-medium">Estado:</span> {patient.state}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Información clínica</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">Fecha de nacimiento:</span>{" "}
              {new Date(patient.dateOfBirth).toLocaleDateString("es-VE")}
            </p>
            <p>
              <span className="font-medium">Género:</span> {patient.gender}
            </p>
            <p>
              <span className="font-medium">Tipo de sangre:</span>{" "}
              {patient.bloodType || "—"}
            </p>
            <p>
              <span className="font-medium">Alergias:</span>{" "}
              {patient.allergies || "—"}
            </p>
            <p>
              <span className="font-medium">Contacto de emergencia:</span>{" "}
              {patient.emergencyContact || "—"}
            </p>
            {patient.weight && (
              <p>
                <span className="font-medium">Peso:</span> {patient.weight} kg
              </p>
            )}
            {patient.height && (
              <p>
                <span className="font-medium">Talla:</span> {patient.height} cm
              </p>
            )}
          </div>
        </div>

        {/* Pregnancy Status - only for female patients */}
        {patient.gender === "female" && (
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 shadow-sm md:col-span-2">
            <h2 className="text-sm font-semibold text-purple-700">Estado de Embarazo</h2>
            <p className="mt-2 text-lg font-medium text-purple-900">
              {pregnancyStatusLabels[patient.pregnancyStatus as keyof typeof pregnancyStatusLabels] || "No especificado"}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-sm font-semibold text-slate-500">Notas</h2>
          <p className="mt-4 text-sm text-slate-700">
            {patient.notes || "Sin notas registradas."}
          </p>
        </div>
      </div>
    </div>
  );
}
