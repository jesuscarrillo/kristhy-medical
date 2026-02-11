import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pregnancyStatusLabels } from "@/lib/validators/patient";
import {
  User,
  ArrowLeft,
  Edit,
  ClipboardList,
  Image,
  Pill,
  Scan,
  Award,
} from "lucide-react";

type PatientPageHeaderProps = {
  patient: {
    firstName: string;
    lastName: string;
    medicalRecordNumber: string;
    cedula: string | null;
    gender: string;
    pregnancyStatus?: string | null;
  };
  patientId: string;
  activeTab: "resumen" | "historial" | "imagenes" | "prescripciones" | "ecografias" | "certificados";
  showActions?: boolean;
  actions?: React.ReactNode;
};

const TAB_CONFIG = [
  { key: "resumen", label: "Resumen", segment: "", icon: User },
  { key: "historial", label: "Historial Clínico", segment: "/historial", icon: ClipboardList },
  { key: "imagenes", label: "Imágenes", segment: "/imagenes", icon: Image },
  { key: "prescripciones", label: "Prescripciones", segment: "/prescripciones", icon: Pill },
  { key: "ecografias", label: "Ecografías", segment: "/ecografias", icon: Scan },
  { key: "certificados", label: "Certificados", segment: "/certificados", icon: Award },
] as const;

export function PatientPageHeader({
  patient,
  patientId,
  activeTab,
  showActions = true,
  actions,
}: PatientPageHeaderProps) {
  const isFemale = patient.gender === "female";
  const basePath = `/dashboard/pacientes/${patientId}`;

  const tabs = TAB_CONFIG.filter(
    (tab) => tab.key !== "ecografias" || isFemale
  );

  return (
    <>
      {/* Back Navigation */}
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href="/dashboard/pacientes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Link>
        </Button>
      </div>

      {/* Header Profile */}
      <div className="relative">
        <div className="absolute inset-0 h-24 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent dark:from-primary/10 dark:via-secondary/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between pt-6 px-2">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/10 text-3xl font-bold text-secondary shadow-inner ring-4 ring-white dark:ring-slate-900">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-3">
                <Badge variant="outline" className="text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                  Historial: {patient.medicalRecordNumber}
                </Badge>
                {patient.cedula && (
                  <Badge variant="outline" className="text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                    CI: {patient.cedula}
                  </Badge>
                )}
                {isFemale && patient.pregnancyStatus && patient.pregnancyStatus !== "NOT_PREGNANT" && (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                    {pregnancyStatusLabels[patient.pregnancyStatus as keyof typeof pregnancyStatusLabels]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-3">
              {actions || (
                <Button asChild variant="outline" className="shadow-sm">
                  <Link href={`${basePath}/editar`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Datos
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.key === activeTab;
            return (
              <Link
                key={tab.key}
                href={`${basePath}${tab.segment}`}
                className={`
                  whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors flex items-center gap-2
                  ${isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}
                `}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
