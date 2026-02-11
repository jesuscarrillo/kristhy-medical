import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getCertificate } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { CertificateForm } from "@/components/certificates/CertificateForm";
import { ArrowLeft, Save } from "lucide-react";

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
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="certificados"
        showActions={false}
      />

      <div>
        <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
          <Link href={`/dashboard/pacientes/${patientId}/certificados/${certId}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al detalle
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Save className="h-5 w-5 text-primary" />
            Editar Certificado
          </CardTitle>
          <CardDescription>
            Modifica los datos del certificado médico.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
