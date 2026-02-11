import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointment } from "@/server/actions/appointment";
import { getPatients } from "@/server/actions/patient";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

type EditAppointmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAppointmentPage({
  params,
}: EditAppointmentPageProps) {
  const resolvedParams = await params;
  let appointment;
  try {
    appointment = await getAppointment(resolvedParams.id);
  } catch {
    notFound();
  }

  const { patients } = await getPatients(undefined, 1, 500);

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10 space-y-8">
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href={`/dashboard/citas/${resolvedParams.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al detalle
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Editar Cita</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Actualiza los datos de la cita de {appointment.patient.firstName} {appointment.patient.lastName}.
        </p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Save className="h-5 w-5 text-primary" />
            Datos de la Cita
          </CardTitle>
          <CardDescription>
            Modifica paciente, fecha, tipo, estado y motivo de la consulta.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AppointmentForm
            appointmentId={resolvedParams.id}
            patients={patients}
            initialData={{
              patientId: appointment.patientId,
              date: appointment.date,
              type: appointment.type as "prenatal" | "gynecology" | "ultrasound" | "followup",
              reason: appointment.reason ?? undefined,
              notes: appointment.notes ?? undefined,
              duration: appointment.duration,
              status: appointment.status as "scheduled" | "completed" | "cancelled" | "noshow",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
