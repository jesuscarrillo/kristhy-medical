import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCertificate } from "@/server/actions/certificate";
import { decrypt } from "@/lib/utils/encryption";
import { certificateTypeLabels } from "@/lib/validators/certificate";
import PrintCertificateView from "./PrintCertificateView";

type PrintCertificatePageProps = {
  params: Promise<{
    id: string;
    certId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PrintCertificatePageProps): Promise<Metadata> {
  const { id: patientId, certId } = await params;

  let certificate;
  try {
    certificate = await getCertificate(certId);
    if (certificate.patientId !== patientId) {
      return { title: "Certificado no encontrado" };
    }
  } catch {
    return { title: "Certificado no encontrado" };
  }

  const fullName = `${certificate.patient.firstName} ${certificate.patient.lastName}`;
  return {
    title: `${certificate.title} - ${fullName}`,
  };
}

export default async function PrintCertificatePage({
  params,
}: PrintCertificatePageProps) {
  const { id: patientId, certId } = await params;

  let certificate;
  try {
    certificate = await getCertificate(certId);
  } catch {
    notFound();
  }

  if (certificate.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(certificate.patient.cedula);

  // Serialize dates to ISO strings for client component
  const certificateData = {
    id: certificate.id,
    type: certificate.type,
    title: certificate.title,
    content: certificate.content,
    diagnosis: certificate.diagnosis,
    date: certificate.date.toISOString(),
    validFrom: certificate.validFrom?.toISOString() ?? null,
    validUntil: certificate.validUntil?.toISOString() ?? null,
    restDays: certificate.restDays,
    issuedBy: certificate.issuedBy,
    licenseNumber: certificate.licenseNumber,
    patientId: certificate.patientId,
    patient: {
      id: certificate.patient.id,
      firstName: certificate.patient.firstName,
      lastName: certificate.patient.lastName,
      dateOfBirth: certificate.patient.dateOfBirth.toISOString(),
    },
  };

  return (
    <PrintCertificateView
      certificate={certificateData}
      patientCedula={patientCedula}
    />
  );
}
