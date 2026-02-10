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
      <style jsx global>{`
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
          font-family: "Times New Roman", Times, serif;
          font-size: 12pt;
          line-height: 1.4;
          color: #000;
          background: #fff;
          max-width: 100%;
          padding: 0;
          margin: 0 auto;
        }

        .print-prescription-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .print-prescription-header h1 {
          font-size: 18pt;
          font-weight: bold;
          margin-bottom: 5px;
          margin-top: 0;
        }

        .print-prescription-header p {
          font-size: 11pt;
          color: #333;
          margin: 3px 0;
        }

        .print-prescription-patient-info {
          background: #f5f5f5;
          padding: 12px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
        }

        .print-prescription-patient-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .print-prescription-patient-info-item label {
          font-size: 9pt;
          text-transform: uppercase;
          color: #666;
          display: block;
          margin-bottom: 2px;
        }

        .print-prescription-patient-info-item span {
          font-size: 11pt;
          font-weight: 500;
        }

        .print-prescription-section {
          margin-bottom: 20px;
        }

        .print-prescription-section-title {
          font-size: 10pt;
          text-transform: uppercase;
          color: #666;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }

        .print-prescription-section-content {
          font-size: 12pt;
          white-space: pre-wrap;
        }

        .print-prescription-rx-symbol {
          font-size: 24pt;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .print-prescription-footer {
          margin-top: 40px;
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
          width: 200px;
          height: 1px;
          background: #000;
          margin-bottom: 5px;
        }

        .print-prescription-signature-name {
          font-size: 11pt;
          font-weight: bold;
          margin: 5px 0;
        }

        .print-prescription-signature-title {
          font-size: 9pt;
          color: #666;
          margin: 3px 0;
        }
      `}</style>

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
              <label>Paciente</label>
              <span>
                {prescription.patient.firstName} {prescription.patient.lastName}
              </span>
            </div>
            <div className="print-prescription-patient-info-item">
              <label>Cédula</label>
              <span>{patientCedula}</span>
            </div>
            <div className="print-prescription-patient-info-item">
              <label>Edad</label>
              <span>
                {calculateAge(prescription.patient.dateOfBirth)} años
              </span>
            </div>
            <div className="print-prescription-patient-info-item">
              <label>Fecha</label>
              <span>{formatDate(prescription.date)}</span>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="print-prescription-section">
            <div className="print-prescription-section-title">Diagnóstico</div>
            <div className="print-prescription-section-content">
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
