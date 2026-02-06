"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">Error en el dashboard</h2>
        <p className="mb-6 text-slate-500">
          Ocurrio un error al cargar esta seccion. Por favor, intenta de nuevo.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
