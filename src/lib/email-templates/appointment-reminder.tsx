import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";

type AppointmentReminderEmailProps = {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  doctorName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
};

const typeLabels: Record<string, string> = {
  prenatal: "Control Prenatal",
  gynecology: "Consulta de Ginecología",
  ultrasound: "Ecografía",
  followup: "Control de Seguimiento",
};

export function AppointmentReminderEmail({
  patientName,
  appointmentDate,
  appointmentTime,
  appointmentType,
  doctorName = "Dra. Kristhy Moreno",
  clinicAddress = "San Cristóbal, Estado Táchira",
  clinicPhone,
}: AppointmentReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading style={headingStyle}>Recordatorio de Cita</Heading>
          </Section>

          <Section style={contentStyle}>
            <Text style={greetingStyle}>Estimada {patientName},</Text>

            <Text style={textStyle}>
              Le recordamos que tiene una cita médica programada para mañana:
            </Text>

            <Section style={appointmentBoxStyle}>
              <Text style={appointmentDetailStyle}>
                <strong>Fecha:</strong> {appointmentDate}
              </Text>
              <Text style={appointmentDetailStyle}>
                <strong>Hora:</strong> {appointmentTime}
              </Text>
              <Text style={appointmentDetailStyle}>
                <strong>Tipo:</strong> {typeLabels[appointmentType] || appointmentType}
              </Text>
              <Text style={appointmentDetailStyle}>
                <strong>Médico:</strong> {doctorName}
              </Text>
            </Section>

            <Text style={textStyle}>
              <strong>Dirección:</strong> {clinicAddress}
            </Text>

            {clinicPhone && (
              <Text style={textStyle}>
                Si necesita reprogramar su cita, por favor comuníquese al{" "}
                <Link href={`tel:${clinicPhone}`} style={linkStyle}>
                  {clinicPhone}
                </Link>
              </Text>
            )}

            <Text style={textStyle}>
              Le recomendamos llegar 10-15 minutos antes de su cita.
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Este es un mensaje automático, por favor no responda a este correo.
            </Text>
            <Text style={footerTextStyle}>
              {doctorName} - Ginecología y Obstetricia
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const headerStyle = {
  backgroundColor: "#ec4899",
  padding: "24px",
  textAlign: "center" as const,
};

const headingStyle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const contentStyle = {
  padding: "24px",
};

const greetingStyle = {
  fontSize: "18px",
  lineHeight: "28px",
  color: "#1f2937",
  marginBottom: "16px",
};

const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  marginBottom: "16px",
};

const appointmentBoxStyle = {
  backgroundColor: "#fdf2f8",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
  border: "1px solid #fbcfe8",
};

const appointmentDetailStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1f2937",
  margin: "8px 0",
};

const linkStyle = {
  color: "#ec4899",
  textDecoration: "underline",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footerStyle = {
  padding: "0 24px",
};

const footerTextStyle = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "4px 0",
};

