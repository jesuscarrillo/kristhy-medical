import { notFound } from "next/navigation";
import { getUltrasound } from "@/server/actions/ultrasound";
import { decrypt } from "@/lib/utils/encryption";
import { UltrasoundPrintView } from "@/components/ultrasound";

type PrintUltrasoundPageProps = {
  params: Promise<{
    id: string;
    ecoId: string;
  }>;
};

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

  return (
    <html lang="es">
      <head>
        <title>
          Ecografía - {ultrasound.patient.firstName}{" "}
          {ultrasound.patient.lastName}
        </title>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.onload = function() { window.print(); }`,
          }}
        />
      </head>
      <body>
        <UltrasoundPrintView
          ultrasound={{
            id: ultrasound.id,
            date: ultrasound.date,
            type: ultrasound.type,
            gestationalAge: ultrasound.gestationalAge,
            reasonForStudy: ultrasound.reasonForStudy,
            lastMenstrualPeriod: ultrasound.lastMenstrualPeriod,
            estimatedDueDate: ultrasound.estimatedDueDate,
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
            dateOfBirth: ultrasound.patient.dateOfBirth,
            pregnancyStatus: ultrasound.patient.pregnancyStatus,
          }}
          patientCedula={patientCedula}
        />
      </body>
    </html>
  );
}
