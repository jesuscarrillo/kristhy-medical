import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { CertificateForm } from "@/components/certificates/CertificateForm";

type NewCertificatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewCertificatePage({
  params,
}: NewCertificatePageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Nuevo Certificado</h1>
            <p className="text-sm text-slate-600">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/certificados`}>
              Cancelar
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <CertificateForm patientId={patientId} />
      </div>
    </div>
  );
}
