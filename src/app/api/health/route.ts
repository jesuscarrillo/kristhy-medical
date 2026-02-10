import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Health check endpoint for Docker healthcheck and load balancers
 * Verifies database connectivity using Prisma
 *
 * NOTE: Versioned endpoint available at /api/v1/health
 * This endpoint maintains backward compatibility for Docker/K8s health checks
 *
 * @returns 200 if healthy, 503 if unhealthy
 */
export async function GET() {
  try {
    // Verify database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "kristhy-medical",
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        service: "kristhy-medical",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
