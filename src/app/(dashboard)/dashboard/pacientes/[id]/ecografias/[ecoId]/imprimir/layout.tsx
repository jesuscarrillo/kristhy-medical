import { ReactNode } from "react";
import "./print-ultrasound.css";

/**
 * Layout dedicado para impresión de ecografías
 * Este layout reemplaza el layout del dashboard para evitar elementos duplicados
 * y permitir un control completo sobre la página de impresión
 */
export default function PrintUltrasoundLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
