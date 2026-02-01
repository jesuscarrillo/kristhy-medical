"use client";

import { ultrasoundTypeLabels, pregnancyStatusLabels } from "@/lib/validators/ultrasound";
import type { PregnancyStatus, UltrasoundType } from "@prisma/client";

type UltrasoundPrintViewProps = {
  ultrasound: {
    id: string;
    date: Date;
    type: UltrasoundType;
    gestationalAge?: string | null;
    reasonForStudy: string;
    lastMenstrualPeriod?: Date | null;
    estimatedDueDate?: Date | null;
    weight?: number | null;
    height?: number | null;
    bloodPressure?: string | null;
    measurements?: any;
    findings?: any;
    otherFindings?: string | null;
    diagnoses: string;
    recommendations?: string | null;
  };
  patient: {
    firstName: string;
    lastName: string;
    cedula: string;
    dateOfBirth: Date;
    pregnancyStatus: PregnancyStatus;
  };
  patientCedula: string;
};

export function UltrasoundPrintView({
  ultrasound,
  patient,
  patientCedula,
}: UltrasoundPrintViewProps) {
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

  const m = ultrasound.measurements || {};

  // Render first trimester measurements
  const renderFirstTrimesterMeasurements = () => (
    <div className="measurements-grid">
      <div className="measurement-section">
        <h4>Saco Gestacional</h4>
        {m.sacoDiameter && <p>Diámetro medio: {m.sacoDiameter} mm</p>}
        {m.sacoVitelino && <p>Saco vitelino: {m.sacoVitelino === "presente" ? "Presente" : m.sacoVitelino === "ausente" ? "Ausente" : "Anormal"}</p>}
        {m.sacoVitelinoDiameter && <p>Diámetro saco vitelino: {m.sacoVitelinoDiameter} mm</p>}
      </div>
      <div className="measurement-section">
        <h4>Embrión/Feto</h4>
        {m.crl && <p>CRL: {m.crl} mm</p>}
        {m.fcf && <p>FCF: {m.fcf} lpm</p>}
        {m.actividadCardiaca && <p>Actividad cardíaca: {m.actividadCardiaca === "presente" ? "Presente" : "Ausente"}</p>}
        {m.movimientosFetales && <p>Movimientos: {m.movimientosFetales}</p>}
        {m.numeroFetos && <p>Número de fetos: {m.numeroFetos}</p>}
      </div>
      <div className="measurement-section">
        <h4>Marcadores</h4>
        {m.translucenciaNucal && <p>TN: {m.translucenciaNucal} mm</p>}
        {m.huesoNasal && <p>Hueso nasal: {m.huesoNasal === "visible" ? "Visible" : m.huesoNasal === "no_visible" ? "No visible" : "No evaluable"}</p>}
        {m.ductusVenoso && <p>Ductus venoso: {m.ductusVenoso}</p>}
      </div>
    </div>
  );

  // Render second/third trimester measurements
  const renderSecondThirdTrimesterMeasurements = () => (
    <div className="measurements-grid">
      <div className="measurement-section">
        <h4>Biometría Fetal</h4>
        {m.dbp && <p>DBP: {m.dbp} mm</p>}
        {m.cc && <p>CC: {m.cc} mm</p>}
        {m.ca && <p>CA: {m.ca} mm</p>}
        {m.lf && <p>LF: {m.lf} mm</p>}
        {m.pesoFetal && <p>Peso estimado: {m.pesoFetal} g</p>}
        {m.fcf && <p>FCF: {m.fcf} lpm</p>}
      </div>
      <div className="measurement-section">
        <h4>Situación Fetal</h4>
        {m.presentacion && <p>Presentación: {m.presentacion}</p>}
        {m.dorsoFetal && <p>Dorso: {m.dorsoFetal.replace("_", " ")}</p>}
        {m.sexoFetal && <p>Sexo: {m.sexoFetal === "no_determinado" ? "No determinado" : m.sexoFetal}</p>}
        {m.anatomiaFetal && <p>Anatomía: {m.anatomiaFetal}</p>}
      </div>
      <div className="measurement-section">
        <h4>Líquido Amniótico</h4>
        {m.liquidoAmnioticoTipo && <p>Valoración: {m.liquidoAmnioticoTipo}</p>}
        {m.ila && <p>ILA: {m.ila} cm</p>}
        {m.bolsilloMayor && <p>Bolsillo mayor: {m.bolsilloMayor} cm</p>}
      </div>
      <div className="measurement-section">
        <h4>Placenta</h4>
        {m.placentaLocalizacion && <p>Localización: {m.placentaLocalizacion.replace("_", " ")}</p>}
        {m.placentaGrado && <p>Grado: {m.placentaGrado}</p>}
        {m.placentaGrosor && <p>Grosor: {m.placentaGrosor} mm</p>}
      </div>
      <div className="measurement-section">
        <h4>Cordón Umbilical</h4>
        {m.cordonVasos && <p>Vasos: {m.cordonVasos === "3_vasos" ? "3 vasos" : "2 vasos"}</p>}
        {m.insercionCordon && <p>Inserción: {m.insercionCordon}</p>}
      </div>
      {m.longitudCervical && (
        <div className="measurement-section">
          <h4>Cuello Uterino</h4>
          <p>Longitud cervical: {m.longitudCervical} mm</p>
        </div>
      )}
    </div>
  );

  // Render gynecological measurements
  const renderGynecologicalMeasurements = () => (
    <div className="measurements-grid">
      <div className="measurement-section">
        <h4>Útero</h4>
        {(m.uteroLongitud || m.uteroAnteroPosterior || m.uteroTransverso) && (
          <p>Medidas: {m.uteroLongitud || "-"} x {m.uteroAnteroPosterior || "-"} x {m.uteroTransverso || "-"} mm</p>
        )}
        {m.uteroPosicion && <p>Posición: {m.uteroPosicion}</p>}
        {m.uteroContorno && <p>Contorno: {m.uteroContorno}</p>}
        {m.uteroEcogenicidad && <p>Ecogenicidad: {m.uteroEcogenicidad}</p>}
      </div>
      <div className="measurement-section">
        <h4>Endometrio</h4>
        {m.endometrioGrosor && <p>Grosor: {m.endometrioGrosor} mm</p>}
        {m.endometrioCaracteristicas && <p>Características: {m.endometrioCaracteristicas}</p>}
        {m.endometrioLinea && <p>Línea: {m.endometrioLinea}</p>}
      </div>
      <div className="measurement-section">
        <h4>Ovario Derecho</h4>
        {(m.ovarioDerechoLongitud || m.ovarioDerechoAnteroPosterior || m.ovarioDerechoTransverso) && (
          <p>Medidas: {m.ovarioDerechoLongitud || "-"} x {m.ovarioDerechoAnteroPosterior || "-"} x {m.ovarioDerechoTransverso || "-"} mm</p>
        )}
        {m.ovarioDerechoVolumen && <p>Volumen: {m.ovarioDerechoVolumen} ml</p>}
        {m.ovarioDerechoCaracteristicas && <p>{m.ovarioDerechoCaracteristicas}</p>}
      </div>
      <div className="measurement-section">
        <h4>Ovario Izquierdo</h4>
        {(m.ovarioIzquierdoLongitud || m.ovarioIzquierdoAnteroPosterior || m.ovarioIzquierdoTransverso) && (
          <p>Medidas: {m.ovarioIzquierdoLongitud || "-"} x {m.ovarioIzquierdoAnteroPosterior || "-"} x {m.ovarioIzquierdoTransverso || "-"} mm</p>
        )}
        {m.ovarioIzquierdoVolumen && <p>Volumen: {m.ovarioIzquierdoVolumen} ml</p>}
        {m.ovarioIzquierdoCaracteristicas && <p>{m.ovarioIzquierdoCaracteristicas}</p>}
      </div>
      <div className="measurement-section">
        <h4>Fondo de Saco de Douglas</h4>
        {m.douglasLibre && <p>Estado: {m.douglasLibre === "libre" ? "Libre" : "Con líquido"}</p>}
        {m.douglasCantidad && <p>{m.douglasCantidad}</p>}
      </div>
      {m.diuPresente && (
        <div className="measurement-section">
          <h4>DIU</h4>
          <p>Presente: Sí</p>
          {m.diuPosicion && <p>Posición: {m.diuPosicion}</p>}
        </div>
      )}
    </div>
  );

  return (
    <>
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
              font-size: 11pt;
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
              margin-bottom: 15px;
            }
            .header h1 {
              font-size: 16pt;
              font-weight: bold;
              margin-bottom: 3px;
            }
            .header p {
              font-size: 10pt;
              color: #333;
            }
            .report-title {
              text-align: center;
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            .patient-info {
              background: #f5f5f5;
              padding: 10px;
              margin-bottom: 15px;
              border: 1px solid #ddd;
            }
            .patient-info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
            }
            .patient-info-item label {
              font-size: 8pt;
              text-transform: uppercase;
              color: #666;
              display: block;
            }
            .patient-info-item span {
              font-size: 10pt;
              font-weight: 500;
            }
            .section {
              margin-bottom: 12px;
            }
            .section-title {
              font-size: 10pt;
              font-weight: bold;
              text-transform: uppercase;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 3px;
              margin-bottom: 8px;
            }
            .section-content {
              font-size: 11pt;
              white-space: pre-wrap;
            }
            .measurements-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .measurement-section {
              border: 1px solid #ddd;
              padding: 8px;
              background: #fafafa;
            }
            .measurement-section h4 {
              font-size: 9pt;
              font-weight: bold;
              text-transform: uppercase;
              color: #555;
              margin-bottom: 5px;
              border-bottom: 1px solid #eee;
              padding-bottom: 3px;
            }
            .measurement-section p {
              font-size: 10pt;
              margin-bottom: 2px;
            }
            .diagnosis-box {
              border: 2px solid #333;
              padding: 12px;
              margin: 15px 0;
              background: #fff;
            }
            .diagnosis-box h3 {
              font-size: 11pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .date-info {
              font-size: 9pt;
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
              font-size: 10pt;
              font-weight: bold;
            }
            .signature-title {
              font-size: 8pt;
              color: #666;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          `,
        }}
      />
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Dra. Kristhy Moreno</h1>
          <p>Médico Especialista en Ginecología y Obstetricia</p>
          <p>San Cristóbal, Estado Táchira - Venezuela</p>
        </div>

        {/* Report Title */}
        <div className="report-title">
          Informe Ecográfico - {ultrasoundTypeLabels[ultrasound.type]}
        </div>

        {/* Patient Info */}
        <div className="patient-info">
          <div className="patient-info-grid">
            <div className="patient-info-item">
              <label>Paciente</label>
              <span>{patient.firstName} {patient.lastName}</span>
            </div>
            <div className="patient-info-item">
              <label>Cédula</label>
              <span>{patientCedula}</span>
            </div>
            <div className="patient-info-item">
              <label>Edad</label>
              <span>{calculateAge(patient.dateOfBirth)} años</span>
            </div>
            <div className="patient-info-item">
              <label>Fecha del estudio</label>
              <span>{formatDate(ultrasound.date)}</span>
            </div>
            {ultrasound.type !== "GYNECOLOGICAL" && (
              <>
                <div className="patient-info-item">
                  <label>Estado</label>
                  <span>{pregnancyStatusLabels[patient.pregnancyStatus]}</span>
                </div>
                {ultrasound.gestationalAge && (
                  <div className="patient-info-item">
                    <label>Edad Gestacional</label>
                    <span>{ultrasound.gestationalAge}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Obstetric Data (for pregnancy ultrasounds) */}
        {ultrasound.type !== "GYNECOLOGICAL" && (
          <div className="section">
            <div className="section-title">Datos Obstétricos</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", fontSize: "10pt" }}>
              {ultrasound.lastMenstrualPeriod && (
                <div><strong>FUM:</strong> {formatDate(ultrasound.lastMenstrualPeriod)}</div>
              )}
              {ultrasound.estimatedDueDate && (
                <div><strong>FPP:</strong> {formatDate(ultrasound.estimatedDueDate)}</div>
              )}
              {ultrasound.gestationalAge && (
                <div><strong>EG:</strong> {ultrasound.gestationalAge}</div>
              )}
            </div>
          </div>
        )}

        {/* Vital Signs */}
        {(ultrasound.weight || ultrasound.height || ultrasound.bloodPressure) && (
          <div className="section">
            <div className="section-title">Signos Vitales</div>
            <div style={{ display: "flex", gap: "20px", fontSize: "10pt" }}>
              {ultrasound.weight && <span><strong>Peso:</strong> {ultrasound.weight} kg</span>}
              {ultrasound.height && <span><strong>Talla:</strong> {ultrasound.height} cm</span>}
              {ultrasound.bloodPressure && <span><strong>PA:</strong> {ultrasound.bloodPressure} mmHg</span>}
            </div>
          </div>
        )}

        {/* Reason for Study */}
        <div className="section">
          <div className="section-title">Motivo del Estudio</div>
          <div className="section-content">{ultrasound.reasonForStudy}</div>
        </div>

        {/* Measurements */}
        <div className="section">
          <div className="section-title">Hallazgos Ecográficos</div>
          {ultrasound.type === "FIRST_TRIMESTER" && renderFirstTrimesterMeasurements()}
          {ultrasound.type === "SECOND_THIRD_TRIMESTER" && renderSecondThirdTrimesterMeasurements()}
          {ultrasound.type === "GYNECOLOGICAL" && renderGynecologicalMeasurements()}
        </div>

        {/* Other Findings */}
        {ultrasound.otherFindings && (
          <div className="section">
            <div className="section-title">Otros Hallazgos</div>
            <div className="section-content">{ultrasound.otherFindings}</div>
          </div>
        )}

        {/* Diagnosis */}
        <div className="diagnosis-box">
          <h3>Diagnóstico / Conclusiones</h3>
          <div className="section-content">{ultrasound.diagnoses}</div>
        </div>

        {/* Recommendations */}
        {ultrasound.recommendations && (
          <div className="section">
            <div className="section-title">Recomendaciones</div>
            <div className="section-content">{ultrasound.recommendations}</div>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="date-info">
            <p>Fecha de emisión: {formatDate(ultrasound.date)}</p>
          </div>
          <div className="signature">
            <div className="signature-line" />
            <div className="signature-name">Dra. Kristhy Moreno</div>
            <div className="signature-title">Firma y Sello</div>
          </div>
        </div>
      </div>
    </>
  );
}
