import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, ErrorCodes } from "@/lib/api/responses";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/v1/health
 *
 * Health check endpoint for monitoring and load balancers
 * Verifies database connectivity using Prisma
 *
 * @returns 200 - Service is healthy
 * @returns 503 - Service is unhealthy
 */
export async function GET() {
  try {
    // Verify database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    return successResponse(
      {
        status: "healthy",
        service: "kristhy-medical",
        database: "connected",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
      {
        version: "1.0",
      }
    );
  } catch (error) {
    console.error("[Health Check] Failed:", error);

    return NextResponse.json(
      {
        error: ErrorCodes.SERVICE_UNAVAILABLE,
        message: "Service is unhealthy",
        details: {
          status: "unhealthy",
          service: "kristhy-medical",
          database: "disconnected",
          reason: error instanceof Error ? error.message : "Unknown error",
        },
        timestamp: new Date().toISOString(),
        path: "/api/v1/health",
      },
      { status: 503 }
    );
  }
}
