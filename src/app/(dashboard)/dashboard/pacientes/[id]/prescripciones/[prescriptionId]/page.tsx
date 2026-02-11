import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getPrescription } from "@/server/actions/prescription";
import { safeDecrypt } from "@/lib/utils/encryption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import { DeletePrescriptionButton } from "./DeletePrescriptionButton";
import { PrintButton } from "./PrintButton";
import {
  ArrowLeft,
  Edit,
  Printer,
  Calendar,
  Pill,
  FileText,
  Stethoscope,
  ClipboardList,
  User,
  Phone,
  CreditCard,
} from "lucide-react";

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

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const patientCedula = safeDecrypt(prescription.patient.cedula);
  const patientPhone = safeDecrypt(prescription.patient.phone);

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
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="prescripciones"
      />

      {/* Sub-header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-primary">
            <Link href={`/dashboard/pacientes/${patientId}/prescripciones`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Prescripciones
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono tabular-nums flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(prescription.date)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="shadow-sm">
            <Link href={`/dashboard/pacientes/${patientId}/prescripciones/${prescriptionId}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <PrintButton
            href={`/dashboard/pacientes/${patientId}/prescripciones/${prescriptionId}/imprimir`}
          />
          <DeletePrescriptionButton
            prescriptionId={prescriptionId}
            patientId={patientId}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Info Card */}
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 border-l-teal-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-primary" />
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <InfoRow icon={User} label="Paciente" value={`${prescription.patient.firstName} ${prescription.patient.lastName}`} />
              <InfoRow icon={CreditCard} label="Cédula" value={patientCedula || "—"} />
              <InfoRow icon={Calendar} label="Edad" value={`${calculateAge(prescription.patient.dateOfBirth)} años`} />
              <InfoRow icon={Phone} label="Teléfono" value={patientPhone || "—"} />
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Card */}
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[80px] rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              {prescription.diagnosis || "Sin diagnóstico especificado."}
            </div>
          </CardContent>
        </Card>

        {/* Medications Card */}
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Pill className="h-5 w-5 text-emerald-500" />
              Medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {prescription.medications}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        {prescription.instructions && (
          <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-5 w-5 text-amber-500" />
                Instrucciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {prescription.instructions}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-4 pt-2">
        <span>Creado: {new Date(prescription.createdAt).toLocaleString("es-VE")}</span>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}
