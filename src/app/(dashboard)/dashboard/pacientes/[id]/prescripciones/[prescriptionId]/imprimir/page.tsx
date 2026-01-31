import { notFound } from "next/navigation";
import { getPrescription } from "@/server/actions/prescription";
import { decrypt } from "@/lib/utils/encryption";

type PrintPrescriptionPageProps = {
  params: Promise<{
    id: string;
    prescriptionId: string;
  }>;
};

export default async function PrintPrescriptionPage({
  params,
}: PrintPrescriptionPageProps) {
  const { id: patientId, prescriptionId } = await params;

  let prescription;
  try {
    prescription = await getPrescription(prescriptionId);
  } catch {
    notFound();
  }

  if (prescription.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(prescription.patient.cedula);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      dateStyle: "long",
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <html lang="es">
      <head>
        <title>
          Prescripción - {prescription.patient.firstName}{" "}
          {prescription.patient.lastName}
        </title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @page {
                size: letter;
                margin: 1.5cm;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.4;
                color: #000;
                background: #fff;
              }
              .container {
                max-width: 100%;
                padding: 0;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 15px;
                margin-bottom: 20px;
              }
              .header h1 {
                font-size: 18pt;
                font-weight: bold;
                margin-bottom: 5px;
              }
              .header p {
                font-size: 11pt;
                color: #333;
              }
              .patient-info {
                background: #f5f5f5;
                padding: 12px;
                margin-bottom: 20px;
                border: 1px solid #ddd;
              }
              .patient-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
              }
              .patient-info-item label {
                font-size: 9pt;
                text-transform: uppercase;
                color: #666;
                display: block;
              }
              .patient-info-item span {
                font-size: 11pt;
                font-weight: 500;
              }
              .section {
                margin-bottom: 20px;
              }
              .section-title {
                font-size: 10pt;
                text-transform: uppercase;
                color: #666;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                margin-bottom: 10px;
              }
              .section-content {
                font-size: 12pt;
                white-space: pre-wrap;
              }
              .rx-symbol {
                font-size: 24pt;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
              }
              .footer {
                margin-top: 40px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
              }
              .date-info {
                font-size: 10pt;
                color: #666;
              }
              .signature {
                text-align: center;
              }
              .signature-line {
                width: 200px;
                height: 1px;
                background: #000;
                margin-bottom: 5px;
              }
              .signature-name {
                font-size: 11pt;
                font-weight: bold;
              }
              .signature-title {
                font-size: 9pt;
                color: #666;
              }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.onload = function() { window.print(); }`,
          }}
        />
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1>Dra. Kristhy Moreno</h1>
            <p>Médico Especialista en Ginecología y Obstetricia</p>
            <p>San Cristóbal, Estado Táchira - Venezuela</p>
          </div>

          {/* Patient Info */}
          <div className="patient-info">
            <div className="patient-info-grid">
              <div className="patient-info-item">
                <label>Paciente</label>
                <span>
                  {prescription.patient.firstName} {prescription.patient.lastName}
                </span>
              </div>
              <div className="patient-info-item">
                <label>Cédula</label>
                <span>{patientCedula}</span>
              </div>
              <div className="patient-info-item">
                <label>Edad</label>
                <span>{calculateAge(prescription.patient.dateOfBirth)} años</span>
              </div>
              <div className="patient-info-item">
                <label>Fecha</label>
                <span>{formatDate(prescription.date)}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="section">
              <div className="section-title">Diagnóstico</div>
              <div className="section-content">{prescription.diagnosis}</div>
            </div>
          )}

          {/* Medications */}
          <div className="section">
            <div className="rx-symbol">Rx</div>
            <div className="section-content">{prescription.medications}</div>
          </div>

          {/* Instructions */}
          {prescription.instructions && (
            <div className="section">
              <div className="section-title">Instrucciones</div>
              <div className="section-content">{prescription.instructions}</div>
            </div>
          )}

          {/* Footer */}
          <div className="footer">
            <div className="date-info">
              <p>Fecha de emisión: {formatDate(prescription.date)}</p>
            </div>
            <div className="signature">
              <div className="signature-line" />
              <div className="signature-name">Dra. Kristhy Moreno</div>
              <div className="signature-title">Firma y Sello</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
