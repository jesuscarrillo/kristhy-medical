import { NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  limit: number; // Max requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: In production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export function rateLimit(identifier: string, config: RateLimitConfig): {
  success: boolean;
  remaining: number;
  reset: number;
} {
  cleanup();

  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // If no entry or entry has expired, create new one
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      reset: now + config.interval,
    };
  }

  // Increment count
  entry.count += 1;

  // Check if over limit
  if (entry.count > config.limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    remaining: config.limit - entry.count,
    reset: entry.resetTime,
  };
}

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return "unknown";
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Contact form: 5 requests per minute
  contact: { interval: 60 * 1000, limit: 5 },
  // API endpoints: 30 requests per minute
  api: { interval: 60 * 1000, limit: 30 },
  // Cron endpoints: 1 request per minute (should only be called by cron)
  cron: { interval: 60 * 1000, limit: 1 },
  // Export: 10 requests per minute
  export: { interval: 60 * 1000, limit: 10 },
  // Auth: 10 attempts per minute
  auth: { interval: 60 * 1000, limit: 10 },
} as const;

// Helper to create rate limit response
export function rateLimitResponse(reset: number) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return NextResponse.json(
    {
      error: "Too many requests",
      message: "Por favor, espera antes de intentar de nuevo",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
