import type { ContactFormValues } from "@/lib/validations";

/**
 * Normalizes a phone number to WhatsApp format (digits only)
 * Removes: +, spaces, hyphens, parentheses, and other non-digit characters
 *
 * @example
 * normalizePhoneNumber("+58 412-073-5223") // "584120735223"
 * normalizePhoneNumber("58 (412) 073 5223") // "584120735223"
 *
 * @param phone - Phone number in any format
 * @returns Phone number with digits only
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Gets the normalized WhatsApp phone number from environment variables
 * Falls back to hardcoded number if env var is not set
 *
 * @returns Normalized WhatsApp phone number (digits only)
 * @throws Error if no phone number is configured
 */
export function getWhatsAppPhone(): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

  if (!phone) {
    throw new Error("NEXT_PUBLIC_WHATSAPP_PHONE no está configurado");
  }

  return normalizePhoneNumber(phone);
}

/**
 * Reason translations for WhatsApp message
 */
const REASON_LABELS: Record<ContactFormValues["reason"], string> = {
  prenatal: "Control prenatal",
  highRisk: "Embarazo de alto riesgo",
  gynecology: "Consulta ginecológica",
  surgery: "Cirugía",
  ultrasound: "Ecografía",
  cervical: "Citología cervical",
  other: "Otra consulta",
} as const;

/**
 * Maximum safe message length for WhatsApp URLs
 * WhatsApp supports up to 65536, but we use a conservative limit
 */
const MAX_MESSAGE_LENGTH = 4096;

/**
 * Formats contact form data into a WhatsApp message
 * Uses the doctor's standard greeting format
 *
 * @param data - Validated contact form values
 * @returns Formatted message string
 */
export function formatWhatsAppMessage(data: ContactFormValues): string {
  const reason = REASON_LABELS[data.reason] ?? data.reason;

  const message = `Buen día Dra. Kristhy, estoy interesada en agendar una cita.

📋 Mis datos de contacto:
• Nombre: ${data.name}
• Email: ${data.email}
• Teléfono: ${data.phone}
• Motivo de consulta: ${reason}

💬 Información adicional:
${data.message}

Muchas gracias!`;

  return message;
}

/**
 * Generates WhatsApp web link with pre-filled message
 *
 * @param data - Validated contact form values
 * @returns WhatsApp web URL (wa.me format)
 * @throws Error if message exceeds length limit or phone is not configured
 */
export function generateWhatsAppLink(data: ContactFormValues): string {
  const phoneNumber = getWhatsAppPhone();
  const message = formatWhatsAppMessage(data);

  // Validate message length
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error("El mensaje es demasiado largo para WhatsApp");
  }

  // URL encode the message (handles emojis, accents, line breaks)
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp in a new window/tab
 * Uses security best practices (noopener, noreferrer)
 *
 * @param url - WhatsApp URL to open
 */
export function openWhatsApp(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
