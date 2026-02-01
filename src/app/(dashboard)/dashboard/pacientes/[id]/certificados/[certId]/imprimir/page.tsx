import { notFound } from "next/navigation";
import { getCertificate } from "@/server/actions/certificate";
import { decrypt } from "@/lib/utils/encryption";
import { certificateTypeLabels } from "@/lib/validators/certificate";

type PrintCertificatePageProps = {
  params: Promise<{
    id: string;
    certId: string;
  }>;
};

export default async function PrintCertificatePage({
  params,
}: PrintCertificatePageProps) {
  const { id: patientId, certId } = await params;

  let certificate;
  try {
    certificate = await getCertificate(certId);
  } catch {
    notFound();
  }

  if (certificate.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(certificate.patient.cedula);

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
          {certificate.title} - {certificate.patient.firstName}{" "}
          {certificate.patient.lastName}
        </title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @page {
                size: letter;
                margin: 2cm;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.5;
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
                padding-bottom: 20px;
                margin-bottom: 25px;
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
              .title {
                text-align: center;
                font-size: 14pt;
                font-weight: bold;
                margin-bottom: 25px;
                text-transform: uppercase;
                text-decoration: underline;
              }
              .patient-info {
                margin-bottom: 25px;
                padding: 15px;
                background: #f9f9f9;
                border: 1px solid #ddd;
              }
              .patient-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
              }
              .patient-info-item {
                font-size: 11pt;
              }
              .patient-info-item label {
                font-weight: bold;
              }
              .rest-info {
                margin-bottom: 25px;
                padding: 15px;
                background: #fff8e1;
                border: 2px solid #ffc107;
                text-align: center;
              }
              .rest-info h3 {
                font-size: 12pt;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .rest-days {
                font-size: 24pt;
                font-weight: bold;
                color: #e65100;
              }
              .rest-dates {
                font-size: 11pt;
                margin-top: 10px;
              }
              .content {
                margin-bottom: 25px;
                text-align: justify;
                font-size: 12pt;
                line-height: 1.6;
              }
              .content p {
                margin-bottom: 15px;
                text-indent: 2em;
              }
              .content-raw {
                white-space: pre-wrap;
                margin-bottom: 25px;
                font-size: 12pt;
                line-height: 1.6;
              }
              .diagnosis {
                margin-bottom: 25px;
                padding: 10px;
                background: #e3f2fd;
                border-left: 4px solid #1976d2;
              }
              .diagnosis label {
                font-weight: bold;
                font-size: 10pt;
                text-transform: uppercase;
                color: #1976d2;
              }
              .footer {
                margin-top: 50px;
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
                width: 250px;
                height: 1px;
                background: #000;
                margin-bottom: 5px;
              }
              .signature-name {
                font-size: 12pt;
                font-weight: bold;
              }
              .signature-title {
                font-size: 10pt;
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

          {/* Title */}
          <div className="title">
            {certificateTypeLabels[certificate.type]}
          </div>

          {/* Patient Info */}
          <div className="patient-info">
            <div className="patient-info-grid">
              <div className="patient-info-item">
                <label>Paciente: </label>
                {certificate.patient.firstName} {certificate.patient.lastName}
              </div>
              <div className="patient-info-item">
                <label>Cédula: </label>
                {patientCedula}
              </div>
              <div className="patient-info-item">
                <label>Edad: </label>
                {calculateAge(certificate.patient.dateOfBirth)} años
              </div>
              <div className="patient-info-item">
                <label>Fecha: </label>
                {formatDate(certificate.date)}
              </div>
            </div>
          </div>

          {/* Rest Info (for REST type) */}
          {certificate.type === "REST" && certificate.restDays && (
            <div className="rest-info">
              <h3>REPOSO MÉDICO</h3>
              <div className="rest-days">{certificate.restDays} DÍAS</div>
              {certificate.validFrom && certificate.validUntil && (
                <div className="rest-dates">
                  Desde: {formatDate(certificate.validFrom)} - Hasta: {formatDate(certificate.validUntil)}
                </div>
              )}
            </div>
          )}

          {/* Diagnosis */}
          {certificate.diagnosis && (
            <div className="diagnosis">
              <label>Diagnóstico: </label>
              {certificate.diagnosis}
            </div>
          )}

          {/* Content */}
          <div className="content-raw">{certificate.content}</div>

          {/* Footer */}
          <div className="footer">
            <div className="date-info">
              <p>Emitido: {formatDate(certificate.date)}</p>
              {certificate.validUntil && (
                <p>Válido hasta: {formatDate(certificate.validUntil)}</p>
              )}
            </div>
            <div className="signature">
              <div className="signature-line" />
              <div className="signature-name">{certificate.issuedBy}</div>
              <div className="signature-title">{certificate.licenseNumber}</div>
              <div className="signature-title">Firma y Sello</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
