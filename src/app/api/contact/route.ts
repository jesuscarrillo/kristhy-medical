import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
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
