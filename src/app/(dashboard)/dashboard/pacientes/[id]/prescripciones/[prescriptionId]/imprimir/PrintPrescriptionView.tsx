"use client";

import { useEffect } from "react";
import type { PregnancyStatus } from "@prisma/client";

type SerializedPrescription = {
  id: string;
  diagnosis: string | null;
  medications: string;
  instructions: string | null;
  date: string; // ISO string
  patientId: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO string
  };
};

type PrintPrescriptionViewProps = {
  prescription: SerializedPrescription;
  patientCedula: string;
};

export default function PrintPrescriptionView({
  prescription,
  patientCedula,
}: PrintPrescriptionViewProps) {
  // Auto-print cuando el componente se monta
  useEffect(() => {
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
      <div className="print-prescription-container">
        {/* Header */}
        <div className="print-prescription-header">
          <h1>Dra. Kristhy Moreno</h1>
          <p>Médico Especialista en Ginecología y Obstetricia</p>
          <p>San Cristóbal, Estado Táchira - Venezuela</p>
        </div>

        {/* Patient Info */}
        <div className="print-prescription-patient-info">
          <div className="print-prescription-patient-info-grid">
            <div className="print-prescription-patient-info-item">
              <span className="print-label">Paciente</span>
              <span>
                {prescription.patient.firstName} {prescription.patient.lastName}
              </span>
            </div>
            <div className="print-prescription-patient-info-item">
              <span className="print-label">Cédula</span>
              <span>{patientCedula}</span>
            </div>
            <div className="print-prescription-patient-info-item">
              <span className="print-label">Edad</span>
              <span>
                {calculateAge(prescription.patient.dateOfBirth)} años
              </span>
            </div>
            <div className="print-prescription-patient-info-item">
              <span className="print-label">Fecha</span>
              <span>{formatDate(prescription.date)}</span>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="print-prescription-section">
            <div className="print-prescription-section-title">Diagnóstico</div>
            <div className="print-prescription-diagnosis-box">
              {prescription.diagnosis}
            </div>
          </div>
        )}

        {/* Medications */}
        <div className="print-prescription-section">
          <div className="print-prescription-rx-symbol">Rx</div>
          <div className="print-prescription-section-content">
            {prescription.medications}
          </div>
        </div>

        {/* Instructions */}
        {prescription.instructions && (
          <div className="print-prescription-section">
            <div className="print-prescription-section-title">
              Instrucciones
            </div>
            <div className="print-prescription-section-content">
              {prescription.instructions}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="print-prescription-footer">
          <div className="print-prescription-date-info">
            <p>Fecha de emisión: {formatDate(prescription.date)}</p>
          </div>
          <div className="print-prescription-signature">
            <div className="print-prescription-signature-line" />
            <div className="print-prescription-signature-name">
              Dra. Kristhy Moreno
            </div>
            <div className="print-prescription-signature-title">
              Firma y Sello
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
