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
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: letter;
          margin: 1.5cm;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        .print-prescription-container {
          font-family: Georgia, "Palatino Linotype", Palatino, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #1a1a1a;
          background: #fff;
          max-width: 100%;
          padding: 0;
          margin: 0 auto;
        }

        .print-prescription-header {
          text-align: center;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 18px;
          margin-bottom: 24px;
        }

        .print-prescription-header h1 {
          font-size: 20pt;
          font-weight: bold;
          margin-bottom: 2px;
          margin-top: 0;
          color: #1a1a1a;
          border-top: 3px solid #0d9488;
          padding-top: 12px;
          display: inline-block;
        }

        .print-prescription-header p {
          font-size: 11pt;
          color: #0d9488;
          margin: 3px 0;
        }

        .print-prescription-header p:last-child {
          color: #666;
          font-size: 10pt;
        }

        .print-prescription-patient-info {
          border-left: 4px solid #0d9488;
          background: #f8fffe;
          padding: 14px 16px;
          margin-bottom: 24px;
          border-radius: 0 4px 4px 0;
        }

        .print-prescription-patient-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .print-prescription-patient-info-item label {
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0d9488;
          display: block;
          margin-bottom: 2px;
          font-weight: 600;
        }

        .print-prescription-patient-info-item span {
          font-size: 11pt;
          font-weight: 500;
          color: #1a1a1a;
        }

        .print-prescription-section {
          margin-bottom: 22px;
        }

        .print-prescription-section-title {
          font-size: 10pt;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #333;
          padding-bottom: 6px;
          margin-bottom: 10px;
          display: inline-block;
          border-bottom: 2px solid #0d9488;
          font-weight: 600;
        }

        .print-prescription-section-content {
          font-size: 12pt;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .print-prescription-rx-symbol {
          font-size: 28pt;
          font-weight: bold;
          margin-bottom: 10px;
          color: #0d9488;
        }

        .print-prescription-diagnosis-box {
          border-left: 4px solid #0d9488;
          background: #f8fffe;
          padding: 10px 14px;
          margin-bottom: 22px;
          border-radius: 0 4px 4px 0;
        }

        .print-prescription-diagnosis-box label {
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0d9488;
          font-weight: 600;
        }

        .print-prescription-footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .print-prescription-date-info {
          font-size: 10pt;
          color: #666;
        }

        .print-prescription-date-info p {
          margin: 3px 0;
        }

        .print-prescription-signature {
          text-align: center;
        }

        .print-prescription-signature-line {
          width: 220px;
          height: 1px;
          background: #0d9488;
          margin: 0 auto 8px;
        }

        .print-prescription-signature-name {
          font-size: 12pt;
          font-weight: bold;
          margin: 5px 0;
          color: #0d9488;
        }

        .print-prescription-signature-title {
          font-size: 9pt;
          color: #666;
          margin: 3px 0;
        }
      ` }} />

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
