import Link from "next/link";
import { getPatients } from "@/server/actions/patient";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CalendarPlus } from "lucide-react";

type NewAppointmentPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function NewAppointmentPage({
  searchParams,
}: NewAppointmentPageProps) {
  const { patients } = await getPatients(undefined, 1, 500);
  const { date } = await searchParams;

  let initialDate: Date | undefined;
  if (date) {
    const parsedDate = new Date(date);
    if (!Number.isNaN(parsedDate.getTime())) {
      parsedDate.setHours(9, 0, 0, 0);
      initialDate = parsedDate;
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10 space-y-8">
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href="/dashboard/citas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a citas
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Nueva Cita</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Programa una nueva cita médica.
        </p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Datos de la Cita
          </CardTitle>
          <CardDescription>
            Selecciona paciente, fecha, tipo y motivo de la consulta.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AppointmentForm
            patients={patients}
            initialData={initialDate ? { date: initialDate } : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
