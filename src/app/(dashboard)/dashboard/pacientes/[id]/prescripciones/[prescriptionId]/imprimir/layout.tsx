import { ReactNode } from "react";
import "./print-prescription.css";

/**
 * Layout dedicado para impresión de prescripciones
 * Este layout reemplaza el layout del dashboard para evitar elementos duplicados
 * y permitir un control completo sobre la página de impresión
 */
export default function PrintPrescriptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
