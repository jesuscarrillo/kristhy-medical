import { NextRequest } from "next/server";
import { sendAppointmentReminders } from "@/server/actions/notifications";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
  rateLimitErrorResponse,
  getRequestPath,
} from "@/lib/api/responses";

// Secret key for cron job authentication - REQUIRED in production
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * POST /api/v1/cron/reminders
 *
 * Send appointment reminders (cron job endpoint)
 *
 * Requires Authorization header with Bearer token matching CRON_SECRET
 *
 * @returns 200 - Reminders sent successfully
 * @returns 401 - Unauthorized (missing or invalid token)
 * @returns 429 - Rate limit exceeded
 * @returns 500 - Server error
 */
export async function POST(request: NextRequest) {
  const path = getRequestPath(request);

  try {
    // Apply rate limiting
    const ip = getClientIp(request);
    const { success, reset } = rateLimit(`cron:${ip}`, RATE_LIMITS.cron);

    if (!success) {
      return rateLimitErrorResponse(reset, path);
    }

    // ALWAYS verify the request is from a trusted source
    const authHeader = request.headers.get("authorization");

    // In production, CRON_SECRET must be set
    if (!CRON_SECRET) {
      console.error("[Cron] CRON_SECRET is not configured");
      return unauthorizedResponse(
        "Cron service not configured",
        path
      );
    }

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return unauthorizedResponse(
        "Invalid or missing authorization token",
        path
      );
    }

    // Execute cron job
    const result = await sendAppointmentReminders();

    return successResponse(
      {
        status: result.success ? "completed" : "partial",
        sent: result.sent,
        failed: result.failed,
        total: result.sent + result.failed,
        executedAt: new Date().toISOString(),
      },
      {
        message: `Sent ${result.sent} reminders, ${result.failed} failed`,
        version: "1.0",
      }
    );
  } catch (error) {
    return handleApiError(error, path);
  }
}

// Support GET for Vercel Cron compatibility
export async function GET(request: NextRequest) {
  return POST(request);
}
