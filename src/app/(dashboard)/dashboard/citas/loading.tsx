import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentListSkeleton } from "@/components/skeletons/AppointmentListSkeleton";

export default function AppointmentsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="mt-6">
        <AppointmentListSkeleton />
      </div>
    </div>
  );
}
