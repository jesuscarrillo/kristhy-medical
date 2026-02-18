"use client";

import { useEffect } from "react";
import { certificateTypeLabels } from "@/lib/validators/certificate";
import type { CertificateType, PregnancyStatus } from "@prisma/client";

type SerializedCertificate = {
  id: string;
  type: CertificateType;
  title: string;
  content: string;
  diagnosis: string | null;
  date: string; // ISO string
  validFrom: string | null; // ISO string
  validUntil: string | null; // ISO string
  restDays: number | null;
  issuedBy: string;
  licenseNumber: string;
  patientId: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO string
  };
};

type PrintCertificateViewProps = {
  certificate: SerializedCertificate;
  patientCedula: string;
};

export default function PrintCertificateView({
  certificate,
  patientCedula,
}: PrintCertificateViewProps) {
  // Auto-print cuando el componente se monta
  useEffect(() => {
    // Esperar un poco para asegurar que todo esté renderizado
    const timer = setTimeout(() => {
      window.print();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Helper functions moved to client component
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      dateStyle: "long",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <>
      <div className="print-certificate-container">
        {/* Header */}
        <div className="print-header">
          <h1>Dra. Kristhy Moreno</h1>
          <p>Médico Especialista en Ginecología y Obstetricia</p>
          <p>San Cristóbal, Estado Táchira - Venezuela</p>
        </div>

        {/* Title */}
        <div className="print-title-wrapper">
          <div className="print-title">
            {certificateTypeLabels[certificate.type]}
          </div>
        </div>

        {/* Patient Info */}
        <div className="print-patient-info">
          <div className="print-patient-info-grid">
            <div className="print-patient-info-item">
              <span className="print-label">Paciente: </span>
              {certificate.patient.firstName} {certificate.patient.lastName}
            </div>
            <div className="print-patient-info-item">
              <span className="print-label">Cédula: </span>
              {patientCedula}
            </div>
            <div className="print-patient-info-item">
              <span className="print-label">Edad: </span>
              {calculateAge(certificate.patient.dateOfBirth)} años
            </div>
            <div className="print-patient-info-item">
              <span className="print-label">Fecha: </span>
              {formatDate(certificate.date)}
            </div>
          </div>
        </div>

        {/* Rest Info (for REST type) */}
        {certificate.type === "REST" && certificate.restDays && (
          <div className="print-rest-info">
            <h3>REPOSO MÉDICO</h3>
            <div className="print-rest-days">{certificate.restDays} DÍAS</div>
            {certificate.validFrom && certificate.validUntil && (
              <div className="print-rest-dates">
                Desde: {formatDate(certificate.validFrom)} - Hasta:{" "}
                {formatDate(certificate.validUntil)}
              </div>
            )}
          </div>
        )}

        {/* Diagnosis */}
        {certificate.diagnosis && (
          <div className="print-diagnosis">
            <span className="print-label">Diagnóstico: </span>
            {certificate.diagnosis}
          </div>
        )}

        {/* Content */}
        <div className="print-content-raw">{certificate.content}</div>

        {/* Footer */}
        <div className="print-footer">
          <div className="print-date-info">
            <p>Emitido: {formatDate(certificate.date)}</p>
            {certificate.validUntil && (
              <p>Válido hasta: {formatDate(certificate.validUntil)}</p>
            )}
          </div>
          <div className="print-signature">
            <div className="print-signature-line" />
            <div className="print-signature-name">{certificate.issuedBy}</div>
            <div className="print-signature-title">
              {certificate.licenseNumber}
            </div>
            <div className="print-signature-title">Firma y Sello</div>
          </div>
        </div>
      </div>
    </>
  );
}
