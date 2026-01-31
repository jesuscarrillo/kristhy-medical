import Link from "next/link";
import { getPatients } from "@/server/actions/patient";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";

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

  // Parse date from searchParams (format: YYYY-MM-DD)
  // Add default time of 9:00 AM if only date is provided
  let initialDate: Date | undefined;
  if (date) {
    const parsedDate = new Date(date);
    if (!Number.isNaN(parsedDate.getTime())) {
      // Set default time to 9:00 AM
      parsedDate.setHours(9, 0, 0, 0);
      initialDate = parsedDate;
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Nueva cita</h1>
          <p className="text-sm text-slate-600">Agrega una cita médica.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/citas">Volver</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AppointmentForm
          patients={patients}
          initialData={initialDate ? { date: initialDate } : undefined}
        />
      </div>
    </div>
  );
}
