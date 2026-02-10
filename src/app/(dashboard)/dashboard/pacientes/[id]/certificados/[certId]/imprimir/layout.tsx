import { ReactNode } from "react";

/**
 * Layout dedicado para impresión de certificados
 * Este layout reemplaza el layout del dashboard para evitar elementos duplicados
 * y permitir un control completo sobre la página de impresión
 */
export default function PrintCertificateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
