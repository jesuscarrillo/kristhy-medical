import { Skeleton } from "@/components/ui/skeleton";
import { PatientListSkeleton } from "@/components/skeletons/PatientListSkeleton";

export default function PatientsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>

      <div className="mt-6">
        <PatientListSkeleton />
      </div>
    </div>
  );
}
