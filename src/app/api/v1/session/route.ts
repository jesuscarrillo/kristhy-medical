import { auth } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
  getRequestPath,
} from "@/lib/api/responses";

/**
 * GET /api/v1/session
 *
 * Get current user session
 *
 * @returns 200 - Session data
 * @returns 401 - No active session
 * @returns 500 - Server error
 */
export async function GET(request: Request) {
  const path = getRequestPath(request);

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return unauthorizedResponse(
        "No active session found",
        path
      );
    }

    return successResponse(
      {
        session: {
          id: session.session.id,
          userId: session.session.userId,
          expiresAt: session.session.expiresAt,
          createdAt: session.session.createdAt,
          updatedAt: session.session.updatedAt,
        },
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          emailVerified: session.user.emailVerified,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
        },
      },
      {
        version: "1.0",
      }
    );
  } catch (error) {
    return handleApiError(error, path);
  }
}
