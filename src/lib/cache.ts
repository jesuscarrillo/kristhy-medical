import { unstable_cache } from "next/cache";

// Cache tags para invalidación selectiva
export const CACHE_TAGS = {
  patients: "patients",
  appointments: "appointments",
  dashboard: "dashboard",
  prescriptions: "prescriptions",
  medicalRecords: "medical-records",
} as const;

// Helper para crear funciones con caché
export function createCachedFunction<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  tags: string[],
  revalidateSeconds = 60
) {
  return unstable_cache(fn, tags, {
    revalidate: revalidateSeconds,
    tags,
  });
}
