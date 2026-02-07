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
