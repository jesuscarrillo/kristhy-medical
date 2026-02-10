import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPrescription } from "@/server/actions/prescription";
import { decrypt } from "@/lib/utils/encryption";
import PrintPrescriptionView from "./PrintPrescriptionView";

type PrintPrescriptionPageProps = {
  params: Promise<{
    id: string;
    prescriptionId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PrintPrescriptionPageProps): Promise<Metadata> {
  const { id: patientId, prescriptionId } = await params;

  let prescription;
  try {
    prescription = await getPrescription(prescriptionId);
    if (prescription.patientId !== patientId) {
      return { title: "Prescripción no encontrada" };
    }
  } catch {
    return { title: "Prescripción no encontrada" };
  }

  const fullName = `${prescription.patient.firstName} ${prescription.patient.lastName}`;
  return {
    title: `Prescripción - ${fullName}`,
  };
}

export default async function PrintPrescriptionPage({
  params,
}: PrintPrescriptionPageProps) {
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

  // Serialize dates to ISO strings for client component
  const prescriptionData = {
    id: prescription.id,
    diagnosis: prescription.diagnosis,
    medications: prescription.medications,
    instructions: prescription.instructions,
    date: prescription.date.toISOString(),
    patientId: prescription.patientId,
    patient: {
      id: prescription.patient.id,
      firstName: prescription.patient.firstName,
      lastName: prescription.patient.lastName,
      dateOfBirth: prescription.patient.dateOfBirth.toISOString(),
    },
  };

  return (
    <PrintPrescriptionView
      prescription={prescriptionData}
      patientCedula={patientCedula}
    />
  );
}
