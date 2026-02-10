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
      <style jsx global>{`
        @page {
          size: letter;
          margin: 2cm;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        .print-certificate-container {
          font-family: "Times New Roman", Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000;
          background: #fff;
          max-width: 100%;
          padding: 0;
          margin: 0 auto;
        }

        .print-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }

        .print-header h1 {
          font-size: 18pt;
          font-weight: bold;
          margin-bottom: 5px;
          margin-top: 0;
        }

        .print-header p {
          font-size: 11pt;
          color: #333;
          margin: 3px 0;
        }

        .print-title {
          text-align: center;
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 25px;
          text-transform: uppercase;
          text-decoration: underline;
        }

        .print-patient-info {
          margin-bottom: 25px;
          padding: 15px;
          background: #f9f9f9;
          border: 1px solid #ddd;
        }

        .print-patient-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .print-patient-info-item {
          font-size: 11pt;
        }

        .print-patient-info-item label {
          font-weight: bold;
        }

        .print-rest-info {
          margin-bottom: 25px;
          padding: 15px;
          background: #fff8e1;
          border: 2px solid #ffc107;
          text-align: center;
        }

        .print-rest-info h3 {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 10px;
          margin-top: 0;
        }

        .print-rest-days {
          font-size: 24pt;
          font-weight: bold;
          color: #e65100;
          margin: 10px 0;
        }

        .print-rest-dates {
          font-size: 11pt;
          margin-top: 10px;
        }

        .print-diagnosis {
          margin-bottom: 25px;
          padding: 10px;
          background: #e3f2fd;
          border-left: 4px solid #1976d2;
        }

        .print-diagnosis label {
          font-weight: bold;
          font-size: 10pt;
          text-transform: uppercase;
          color: #1976d2;
        }

        .print-content-raw {
          white-space: pre-wrap;
          margin-bottom: 25px;
          font-size: 12pt;
          line-height: 1.6;
        }

        .print-footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .print-date-info {
          font-size: 10pt;
          color: #666;
        }

        .print-date-info p {
          margin: 3px 0;
        }

        .print-signature {
          text-align: center;
        }

        .print-signature-line {
          width: 250px;
          height: 1px;
          background: #000;
          margin-bottom: 5px;
        }

        .print-signature-name {
          font-size: 12pt;
          font-weight: bold;
          margin: 5px 0;
        }

        .print-signature-title {
          font-size: 10pt;
          color: #666;
          margin: 3px 0;
        }
      `}</style>

      <div className="print-certificate-container">
        {/* Header */}
        <div className="print-header">
          <h1>Dra. Kristhy Moreno</h1>
          <p>Médico Especialista en Ginecología y Obstetricia</p>
          <p>San Cristóbal, Estado Táchira - Venezuela</p>
        </div>

        {/* Title */}
        <div className="print-title">
          {certificateTypeLabels[certificate.type]}
        </div>

        {/* Patient Info */}
        <div className="print-patient-info">
          <div className="print-patient-info-grid">
            <div className="print-patient-info-item">
              <label>Paciente: </label>
              {certificate.patient.firstName} {certificate.patient.lastName}
            </div>
            <div className="print-patient-info-item">
              <label>Cédula: </label>
              {patientCedula}
            </div>
            <div className="print-patient-info-item">
              <label>Edad: </label>
              {calculateAge(certificate.patient.dateOfBirth)} años
            </div>
            <div className="print-patient-info-item">
              <label>Fecha: </label>
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
            <label>Diagnóstico: </label>
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
