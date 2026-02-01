import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getCertificate } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import { CertificateForm } from "@/components/certificates/CertificateForm";

type EditCertificatePageProps = {
  params: Promise<{
    id: string;
    certId: string;
  }>;
};

export default async function EditCertificatePage({
  params,
}: EditCertificatePageProps) {
  const { id: patientId, certId } = await params;

  let patient;
  let certificate;

  try {
    [patient, certificate] = await Promise.all([
      getPatient(patientId),
      getCertificate(certId),
    ]);
  } catch {
    notFound();
  }

  if (certificate.patientId !== patientId) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Editar Certificado</h1>
            <p className="text-sm text-slate-600">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/certificados/${certId}`}>
              Cancelar
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <CertificateForm
          patientId={patientId}
          certificateId={certId}
          initialData={{
            date: certificate.date,
            type: certificate.type,
            title: certificate.title,
            content: certificate.content,
            restDays: certificate.restDays,
            validFrom: certificate.validFrom,
            validUntil: certificate.validUntil,
            diagnosis: certificate.diagnosis,
            issuedBy: certificate.issuedBy,
            licenseNumber: certificate.licenseNumber,
          }}
        />
      </div>
    </div>
  );
}
