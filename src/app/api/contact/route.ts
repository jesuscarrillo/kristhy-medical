import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  rateLimitResponse,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Apply rate limiting
  const ip = getClientIp(request);
  const { success, reset } = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);

  if (!success) {
    return rateLimitResponse(reset);
  }

  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // TODO: Integrate with email provider (Resend/SendGrid)
    console.info("Contact form submission", validated);

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado exitosamente",
    });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { success: false, error: "Error al enviar mensaje" },
      { status: 400 },
    );
  }
}
