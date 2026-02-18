"use client";

import { useEffect } from "react";
import { ultrasoundTypeLabels, pregnancyStatusLabels } from "@/lib/validators/ultrasound";
import type { PregnancyStatus, UltrasoundType } from "@prisma/client";

type UltrasoundPrintViewProps = {
  ultrasound: {
    id: string;
    date: string; // ISO string
    type: UltrasoundType;
    gestationalAge?: string | null;
    reasonForStudy: string;
    lastMenstrualPeriod?: string | null; // ISO string
    estimatedDueDate?: string | null; // ISO string
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
    dateOfBirth: string; // ISO string
    pregnancyStatus: PregnancyStatus;
  };
  patientCedula: string;
};

export function UltrasoundPrintView({
  ultrasound,
  patient,
  patientCedula,
}: UltrasoundPrintViewProps) {
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

  const m = ultrasound.measurements || {};

  // Render first trimester measurements
  const renderFirstTrimesterMeasurements = () => (
    <div className="print-ultrasound-measurements-grid">
      <div className="print-ultrasound-measurement-section">
        <h4>Saco Gestacional</h4>
        {m.sacoDiameter && <p>Diámetro medio: {m.sacoDiameter} mm</p>}
        {m.sacoVitelino && <p>Saco vitelino: {m.sacoVitelino === "presente" ? "Presente" : m.sacoVitelino === "ausente" ? "Ausente" : "Anormal"}</p>}
        {m.sacoVitelinoDiameter && <p>Diámetro saco vitelino: {m.sacoVitelinoDiameter} mm</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Embrión/Feto</h4>
        {m.crl && <p>CRL: {m.crl} mm</p>}
        {m.fcf && <p>FCF: {m.fcf} lpm</p>}
        {m.actividadCardiaca && <p>Actividad cardíaca: {m.actividadCardiaca === "presente" ? "Presente" : "Ausente"}</p>}
        {m.movimientosFetales && <p>Movimientos: {m.movimientosFetales}</p>}
        {m.numeroFetos && <p>Número de fetos: {m.numeroFetos}</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Marcadores</h4>
        {m.translucenciaNucal && <p>TN: {m.translucenciaNucal} mm</p>}
        {m.huesoNasal && <p>Hueso nasal: {m.huesoNasal === "visible" ? "Visible" : m.huesoNasal === "no_visible" ? "No visible" : "No evaluable"}</p>}
        {m.ductusVenoso && <p>Ductus venoso: {m.ductusVenoso}</p>}
      </div>
    </div>
  );

  // Render second/third trimester measurements
  const renderSecondThirdTrimesterMeasurements = () => (
    <div className="print-ultrasound-measurements-grid">
      <div className="print-ultrasound-measurement-section">
        <h4>Biometría Fetal</h4>
        {m.dbp && <p>DBP: {m.dbp} mm</p>}
        {m.cc && <p>CC: {m.cc} mm</p>}
        {m.ca && <p>CA: {m.ca} mm</p>}
        {m.lf && <p>LF: {m.lf} mm</p>}
        {m.pesoFetal && <p>Peso estimado: {m.pesoFetal} g</p>}
        {m.fcf && <p>FCF: {m.fcf} lpm</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Situación Fetal</h4>
        {m.presentacion && <p>Presentación: {m.presentacion}</p>}
        {m.dorsoFetal && <p>Dorso: {m.dorsoFetal.replace("_", " ")}</p>}
        {m.sexoFetal && <p>Sexo: {m.sexoFetal === "no_determinado" ? "No determinado" : m.sexoFetal}</p>}
        {m.anatomiaFetal && <p>Anatomía: {m.anatomiaFetal}</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Líquido Amniótico</h4>
        {m.liquidoAmnioticoTipo && <p>Valoración: {m.liquidoAmnioticoTipo}</p>}
        {m.ila && <p>ILA: {m.ila} cm</p>}
        {m.bolsilloMayor && <p>Bolsillo mayor: {m.bolsilloMayor} cm</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Placenta</h4>
        {m.placentaLocalizacion && <p>Localización: {m.placentaLocalizacion.replace("_", " ")}</p>}
        {m.placentaGrado && <p>Grado: {m.placentaGrado}</p>}
        {m.placentaGrosor && <p>Grosor: {m.placentaGrosor} mm</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Cordón Umbilical</h4>
        {m.cordonVasos && <p>Vasos: {m.cordonVasos === "3_vasos" ? "3 vasos" : "2 vasos"}</p>}
        {m.insercionCordon && <p>Inserción: {m.insercionCordon}</p>}
      </div>
      {m.longitudCervical && (
        <div className="print-ultrasound-measurement-section">
          <h4>Cuello Uterino</h4>
          <p>Longitud cervical: {m.longitudCervical} mm</p>
        </div>
      )}
    </div>
  );

  // Render gynecological measurements
  const renderGynecologicalMeasurements = () => (
    <div className="print-ultrasound-measurements-grid">
      <div className="print-ultrasound-measurement-section">
        <h4>Útero</h4>
        {(m.uteroLongitud || m.uteroAnteroPosterior || m.uteroTransverso) && (
          <p>Medidas: {m.uteroLongitud || "-"} x {m.uteroAnteroPosterior || "-"} x {m.uteroTransverso || "-"} mm</p>
        )}
        {m.uteroPosicion && <p>Posición: {m.uteroPosicion}</p>}
        {m.uteroContorno && <p>Contorno: {m.uteroContorno}</p>}
        {m.uteroEcogenicidad && <p>Ecogenicidad: {m.uteroEcogenicidad}</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Endometrio</h4>
        {m.endometrioGrosor && <p>Grosor: {m.endometrioGrosor} mm</p>}
        {m.endometrioCaracteristicas && <p>Características: {m.endometrioCaracteristicas}</p>}
        {m.endometrioLinea && <p>Línea: {m.endometrioLinea}</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Ovario Derecho</h4>
        {(m.ovarioDerechoLongitud || m.ovarioDerechoAnteroPosterior || m.ovarioDerechoTransverso) && (
          <p>Medidas: {m.ovarioDerechoLongitud || "-"} x {m.ovarioDerechoAnteroPosterior || "-"} x {m.ovarioDerechoTransverso || "-"} mm</p>
        )}
        {m.ovarioDerechoVolumen && <p>Volumen: {m.ovarioDerechoVolumen} ml</p>}
        {m.ovarioDerechoCaracteristicas && <p>{m.ovarioDerechoCaracteristicas}</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Ovario Izquierdo</h4>
        {(m.ovarioIzquierdoLongitud || m.ovarioIzquierdoAnteroPosterior || m.ovarioIzquierdoTransverso) && (
          <p>Medidas: {m.ovarioIzquierdoLongitud || "-"} x {m.ovarioIzquierdoAnteroPosterior || "-"} x {m.ovarioIzquierdoTransverso || "-"} mm</p>
        )}
        {m.ovarioIzquierdoVolumen && <p>Volumen: {m.ovarioIzquierdoVolumen} ml</p>}
        {m.ovarioIzquierdoCaracteristicas && <p>{m.ovarioIzquierdoCaracteristicas}</p>}
      </div>
      <div className="print-ultrasound-measurement-section">
        <h4>Fondo de Saco de Douglas</h4>
        {m.douglasLibre && <p>Estado: {m.douglasLibre === "libre" ? "Libre" : "Con líquido"}</p>}
        {m.douglasCantidad && <p>{m.douglasCantidad}</p>}
      </div>
      {m.diuPresente && (
        <div className="print-ultrasound-measurement-section">
          <h4>DIU</h4>
          <p>Presente: Sí</p>
          {m.diuPosicion && <p>Posición: {m.diuPosicion}</p>}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Styles loaded via print-ultrasound.css in the imprimir layout */}
      <div className="print-ultrasound-container">
        {/* Header */}
        <div className="print-ultrasound-header">
          <h1>Dra. Kristhy Moreno</h1>
          <p>Médico Especialista en Ginecología y Obstetricia</p>
          <p>San Cristóbal, Estado Táchira - Venezuela</p>
        </div>

        {/* Report Title */}
        <div className="print-ultrasound-report-title">
          Informe Ecográfico - {ultrasoundTypeLabels[ultrasound.type]}
        </div>

        {/* Patient Info */}
        <div className="print-ultrasound-patient-info">
          <div className="print-ultrasound-patient-info-grid">
            <div className="print-ultrasound-patient-info-item">
              <span className="print-label">Paciente</span>
              <span>{patient.firstName} {patient.lastName}</span>
            </div>
            <div className="print-ultrasound-patient-info-item">
              <span className="print-label">Cédula</span>
              <span>{patientCedula}</span>
            </div>
            <div className="print-ultrasound-patient-info-item">
              <span className="print-label">Edad</span>
              <span>{calculateAge(patient.dateOfBirth)} años</span>
            </div>
            <div className="print-ultrasound-patient-info-item">
              <span className="print-label">Fecha del estudio</span>
              <span>{formatDate(ultrasound.date)}</span>
            </div>
            {ultrasound.type !== "GYNECOLOGICAL" && (
              <>
                <div className="print-ultrasound-patient-info-item">
                  <span className="print-label">Estado</span>
                  <span>{pregnancyStatusLabels[patient.pregnancyStatus]}</span>
                </div>
                {ultrasound.gestationalAge && (
                  <div className="print-ultrasound-patient-info-item">
                    <span className="print-label">Edad Gestacional</span>
                    <span>{ultrasound.gestationalAge}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Obstetric Data (for pregnancy ultrasounds) */}
        {ultrasound.type !== "GYNECOLOGICAL" && (
          <div className="print-ultrasound-section">
            <div className="print-ultrasound-section-title">Datos Obstétricos</div>
            <div className="print-ultrasound-obstetric-data">
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
          <div className="print-ultrasound-section">
            <div className="print-ultrasound-section-title">Signos Vitales</div>
            <div className="print-ultrasound-vital-signs">
              {ultrasound.weight && <span><strong>Peso:</strong> {ultrasound.weight} kg</span>}
              {ultrasound.height && <span><strong>Talla:</strong> {ultrasound.height} cm</span>}
              {ultrasound.bloodPressure && <span><strong>PA:</strong> {ultrasound.bloodPressure} mmHg</span>}
            </div>
          </div>
        )}

        {/* Reason for Study */}
        <div className="print-ultrasound-section">
          <div className="print-ultrasound-section-title">Motivo del Estudio</div>
          <div className="print-ultrasound-section-content">{ultrasound.reasonForStudy}</div>
        </div>

        {/* Measurements */}
        <div className="print-ultrasound-section">
          <div className="print-ultrasound-section-title">Hallazgos Ecográficos</div>
          {ultrasound.type === "FIRST_TRIMESTER" && renderFirstTrimesterMeasurements()}
          {ultrasound.type === "SECOND_THIRD_TRIMESTER" && renderSecondThirdTrimesterMeasurements()}
          {ultrasound.type === "GYNECOLOGICAL" && renderGynecologicalMeasurements()}
        </div>

        {/* Other Findings */}
        {ultrasound.otherFindings && (
          <div className="print-ultrasound-section">
            <div className="print-ultrasound-section-title">Otros Hallazgos</div>
            <div className="print-ultrasound-section-content">{ultrasound.otherFindings}</div>
          </div>
        )}

        {/* Diagnosis */}
        <div className="print-ultrasound-diagnosis-box">
          <h3>Diagnóstico / Conclusiones</h3>
          <div className="print-ultrasound-section-content">{ultrasound.diagnoses}</div>
        </div>

        {/* Recommendations */}
        {ultrasound.recommendations && (
          <div className="print-ultrasound-section">
            <div className="print-ultrasound-section-title">Recomendaciones</div>
            <div className="print-ultrasound-section-content">{ultrasound.recommendations}</div>
          </div>
        )}

        {/* Footer */}
        <div className="print-ultrasound-footer">
          <div className="print-ultrasound-date-info">
            <p>Fecha de emisión: {formatDate(ultrasound.date)}</p>
          </div>
          <div className="print-ultrasound-signature">
            <div className="print-ultrasound-signature-line" />
            <div className="print-ultrasound-signature-name">Dra. Kristhy Moreno</div>
            <div className="print-ultrasound-signature-title">Firma y Sello</div>
          </div>
        </div>
      </div>
    </>
  );
}
