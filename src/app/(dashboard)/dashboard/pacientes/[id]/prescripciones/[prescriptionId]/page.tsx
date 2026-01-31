import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrescription } from "@/server/actions/prescription";
import { decrypt } from "@/lib/utils/encryption";
import { Button } from "@/components/ui/button";
import { DeletePrescriptionButton } from "./DeletePrescriptionButton";

type PrescriptionDetailPageProps = {
  params: Promise<{
    id: string;
    prescriptionId: string;
  }>;
};

export default async function PrescriptionDetailPage({
  params,
}: PrescriptionDetailPageProps) {
  const { id: patientId, prescriptionId } = await params;

  let prescription;
  try {
    prescription = await getPrescription(prescriptionId);
  } catch {
    notFound();
  }

  if (prescription.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(prescription.patient.cedula);
  const patientPhone = decrypt(prescription.patient.phone);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      dateStyle: "long",
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prescripción Médica</h1>
          <p className="text-sm text-slate-600">
            {formatDate(prescription.date)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/prescripciones`}>
              Volver
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href={`/dashboard/pacientes/${patientId}/prescripciones/${prescriptionId}/editar`}
            >
              Editar
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            onClick={() => window.print()}
          >
            <Link
              href={`/dashboard/pacientes/${patientId}/prescripciones/${prescriptionId}/imprimir`}
              target="_blank"
            >
              Imprimir
            </Link>
          </Button>
          <DeletePrescriptionButton
            prescriptionId={prescriptionId}
            patientId={patientId}
          />
        </div>
      </div>

      {/* Prescription Card */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Dra. Kristhy Moreno
              </h2>
              <p className="text-sm text-slate-600">
                Ginecología y Obstetricia
              </p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>San Cristóbal, Táchira</p>
              <p>Venezuela</p>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Paciente
              </p>
              <p className="text-sm font-medium text-slate-800">
                {prescription.patient.firstName} {prescription.patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Cédula
              </p>
              <p className="text-sm text-slate-800">{patientCedula}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Edad
              </p>
              <p className="text-sm text-slate-800">
                {calculateAge(prescription.patient.dateOfBirth)} años
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                Teléfono
              </p>
              <p className="text-sm text-slate-800">{patientPhone}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="border-b border-slate-200 px-6 py-4">
            <p className="text-xs font-medium uppercase text-slate-500">
              Diagnóstico
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {prescription.diagnosis}
            </p>
          </div>
        )}

        {/* Medications */}
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-xs font-medium uppercase text-slate-500">
            Medicamentos
          </p>
          <div className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
            {prescription.medications}
          </div>
        </div>

        {/* Instructions */}
        {prescription.instructions && (
          <div className="border-b border-slate-200 px-6 py-4">
            <p className="text-xs font-medium uppercase text-slate-500">
              Instrucciones
            </p>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
              {prescription.instructions}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4">
          <div className="flex items-end justify-between">
            <div className="text-xs text-slate-500">
              <p>Fecha: {formatDate(prescription.date)}</p>
              <p>
                Creado:{" "}
                {new Date(prescription.createdAt).toLocaleString("es-VE")}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 h-px w-48 bg-slate-300" />
              <p className="text-sm font-medium text-slate-800">
                Dra. Kristhy Moreno
              </p>
              <p className="text-xs text-slate-500">Firma y sello</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
