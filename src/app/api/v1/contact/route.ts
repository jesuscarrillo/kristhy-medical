import { contactSchema } from "@/lib/validations";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import {
  successResponse,
  handleApiError,
  rateLimitErrorResponse,
  getRequestPath,
} from "@/lib/api/responses";

/**
 * POST /api/v1/contact
 *
 * Submit contact form
 *
 * @body {name: string, email: string, phone?: string, message: string}
 * @returns 201 - Message sent successfully
 * @returns 422 - Validation error
 * @returns 429 - Rate limit exceeded
 * @returns 500 - Server error
 */
export async function POST(request: Request) {
  const path = getRequestPath(request);

  try {
    // Apply rate limiting
    const ip = getClientIp(request);
    const { success, reset } = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);

    if (!success) {
      return rateLimitErrorResponse(reset, path);
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // TODO: Integrate with email provider (Resend/SendGrid)
    console.info("[Contact Form]", {
      name: validated.name,
      email: validated.email,
      timestamp: new Date().toISOString(),
    });

    // Return success response with 201 Created
    return successResponse(
      {
        id: crypto.randomUUID(), // Generate ID for tracking
        status: "pending",
        submittedAt: new Date().toISOString(),
      },
      {
        message: "Mensaje enviado exitosamente. Te contactaremos pronto.",
        version: "1.0",
      }
    );
  } catch (error) {
    return handleApiError(error, path);
  }
}
