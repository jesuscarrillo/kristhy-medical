import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getUltrasound } from "@/server/actions/ultrasound";
import { decrypt } from "@/lib/utils/encryption";
import { UltrasoundPrintView } from "@/components/ultrasound";

type PrintUltrasoundPageProps = {
  params: Promise<{
    id: string;
    ecoId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PrintUltrasoundPageProps): Promise<Metadata> {
  const { id: patientId, ecoId } = await params;

  let ultrasound;
  try {
    ultrasound = await getUltrasound(ecoId);
    if (ultrasound.patientId !== patientId) {
      return { title: "Ecografía no encontrada" };
    }
  } catch {
    return { title: "Ecografía no encontrada" };
  }

  const fullName = `${ultrasound.patient.firstName} ${ultrasound.patient.lastName}`;
  return {
    title: `Ecografía - ${fullName}`,
  };
}

export default async function PrintUltrasoundPage({
  params,
}: PrintUltrasoundPageProps) {
  const { id: patientId, ecoId } = await params;

  let ultrasound;
  try {
    ultrasound = await getUltrasound(ecoId);
  } catch {
    notFound();
  }

  if (ultrasound.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(ultrasound.patient.cedula);

  // Serialize dates to ISO strings for client component
  return (
    <UltrasoundPrintView
      ultrasound={{
        id: ultrasound.id,
        date: ultrasound.date.toISOString(),
        type: ultrasound.type,
        gestationalAge: ultrasound.gestationalAge,
        reasonForStudy: ultrasound.reasonForStudy,
        lastMenstrualPeriod: ultrasound.lastMenstrualPeriod?.toISOString() || null,
        estimatedDueDate: ultrasound.estimatedDueDate?.toISOString() || null,
        weight: ultrasound.weight,
        height: ultrasound.height,
        bloodPressure: ultrasound.bloodPressure,
        measurements: ultrasound.measurements,
        findings: ultrasound.findings,
        otherFindings: ultrasound.otherFindings,
        diagnoses: ultrasound.diagnoses,
        recommendations: ultrasound.recommendations,
      }}
      patient={{
        firstName: ultrasound.patient.firstName,
        lastName: ultrasound.patient.lastName,
        cedula: ultrasound.patient.cedula,
        dateOfBirth: ultrasound.patient.dateOfBirth.toISOString(),
        pregnancyStatus: ultrasound.patient.pregnancyStatus,
      }}
      patientCedula={patientCedula}
    />
  );
}
