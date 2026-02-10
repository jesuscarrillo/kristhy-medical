/**
 * DEPRECATED: Use /api/v1/session instead
 *
 * This endpoint is maintained for backward compatibility.
 * It maintains the EXACT same response format to avoid breaking existing clients.
 *
 * @deprecated Use /api/v1/session for new implementations
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // IMPORTANT: Keep exact same response format for backward compatibility
    // Login and other components depend on this structure
    return NextResponse.json({
      session: session.session,
      user: session.user,
    });
  } catch (error) {
    console.error("[Auth Check] Error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}
