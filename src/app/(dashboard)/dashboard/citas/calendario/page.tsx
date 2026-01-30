import Link from "next/link";
import { getAppointmentsByDateRange } from "@/server/actions/appointment";
import { CalendarView } from "@/components/appointments/CalendarView";
import { Button } from "@/components/ui/button";

export default async function CalendarPage() {
  // Get appointments for 3 months range (previous, current, next)
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const appointments = await getAppointmentsByDateRange(startDate, endDate);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendario de Citas</h1>
          <p className="text-sm text-slate-600">
            Visualiza y gestiona las citas en el calendario.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/citas">Ver lista</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <CalendarView appointments={appointments} />
      </div>
    </div>
  );
}
