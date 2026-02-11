import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { CertificateForm } from "@/components/certificates/CertificateForm";
import { ArrowLeft, Award } from "lucide-react";

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
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="certificados"
        showActions={false}
      />

      <div>
        <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
          <Link href={`/dashboard/pacientes/${patientId}/certificados`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Certificados
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            Nuevo Certificado
          </CardTitle>
          <CardDescription>
            Selecciona el tipo de certificado y completa los datos requeridos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <CertificateForm patientId={patientId} />
        </CardContent>
      </Card>
    </div>
  );
}
