import { NextRequest, NextResponse } from "next/server";
import { sendAppointmentReminders } from "@/server/actions/notifications";

// Secret key for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify the request is from a trusted source
  const authHeader = request.headers.get("authorization");

  if (CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    const result = await sendAppointmentReminders();

    return NextResponse.json({
      success: result.success,
      message: `Sent ${result.sent} reminders, ${result.failed} failed`,
      details: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: "Failed to send reminders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
