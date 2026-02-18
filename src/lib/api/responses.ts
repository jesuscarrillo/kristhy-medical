/**
 * API Response Utilities
 *
 * Standard REST API response structures and helpers following:
 * - REST best practices
 * - Vercel/Next.js patterns
 * - Consistent error handling
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard error response structure
 */
interface ErrorResponse {
  error: string;          // Error code (PascalCase)
  message: string;        // Human-readable message
  details?: unknown;      // Additional error context
  timestamp: string;      // ISO 8601 timestamp
  path: string;          // Request path
}

/**
 * Standard success response envelope
 */
interface ApiResponse<T = unknown> {
  data?: T;
  meta?: {
    timestamp: string;
    version?: string;
    [key: string]: unknown;
  };
}

/**
 * Paginated response structure
 */
interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta: {
    timestamp: string;
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Standard error codes
 */
export const ErrorCodes = {
  // 4xx Client Errors
  BAD_REQUEST: "BadRequest",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "NotFound",
  CONFLICT: "Conflict",
  VALIDATION_ERROR: "ValidationError",
  RATE_LIMIT: "RateLimitExceeded",

  // 5xx Server Errors
  INTERNAL_ERROR: "InternalServerError",
  SERVICE_UNAVAILABLE: "ServiceUnavailable",
  DATABASE_ERROR: "DatabaseError",
} as const;

/**
 * Create standardized error response
 */
export function errorResponse(
  error: string,
  message: string,
  status: number,
  path: string,
  details?: unknown
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error,
      message,
      details,
      timestamp: new Date().toISOString(),
      path,
    },
    { status }
  );
}

/**
 * Create success response with envelope
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

/**
 * Create paginated response
 */
function paginatedResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / pageSize);

  return NextResponse.json({
    data: items,
    meta: {
      timestamp: new Date().toISOString(),
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

/**
 * Handle Zod validation errors
 */
export function validationErrorResponse(
  error: ZodError<unknown>,
  path: string
): NextResponse<ErrorResponse> {
  const details = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));

  return errorResponse(
    ErrorCodes.VALIDATION_ERROR,
    "Request validation failed",
    422, // Unprocessable Entity
    path,
    { errors: details }
  );
}

/**
 * Generic error handler with proper status codes
 */
export function handleApiError(
  error: unknown,
  path: string
): NextResponse<ErrorResponse> {
  console.error(`[API Error] ${path}:`, error);

  // Zod validation error
  if (error instanceof ZodError) {
    return validationErrorResponse(error, path);
  }

  // Known error with message
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes("not found")) {
      return errorResponse(
        ErrorCodes.NOT_FOUND,
        error.message,
        404,
        path
      );
    }

    const lowerMessage = error.message.toLowerCase();
    if (lowerMessage.includes("unauthorized") || lowerMessage.includes("not authorized")) {
      return errorResponse(
        ErrorCodes.UNAUTHORIZED,
        error.message,
        401,
        path
      );
    }

    if (error.message.includes("forbidden")) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        error.message,
        403,
        path
      );
    }

    // Generic server error (don't leak internal details)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      "An unexpected error occurred",
      500,
      path,
      process.env.NODE_ENV === "development" ? { message: error.message } : undefined
    );
  }

  // Unknown error
  return errorResponse(
    ErrorCodes.INTERNAL_ERROR,
    "An unexpected error occurred",
    500,
    path
  );
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(
  message: string = "Authentication required",
  path: string
): NextResponse<ErrorResponse> {
  return errorResponse(
    ErrorCodes.UNAUTHORIZED,
    message,
    401,
    path
  );
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(
  message: string = "Access denied",
  path: string
): NextResponse<ErrorResponse> {
  return errorResponse(
    ErrorCodes.FORBIDDEN,
    message,
    403,
    path
  );
}

/**
 * Create not found response
 */
export function notFoundResponse(
  resource: string,
  path: string
): NextResponse<ErrorResponse> {
  return errorResponse(
    ErrorCodes.NOT_FOUND,
    `${resource} not found`,
    404,
    path
  );
}

/**
 * Create rate limit response
 */
export function rateLimitErrorResponse(
  resetTime: number,
  path: string
): NextResponse<ErrorResponse> {
  const resetDate = new Date(resetTime * 1000);

  return NextResponse.json(
    {
      error: ErrorCodes.RATE_LIMIT,
      message: "Too many requests",
      details: {
        retryAfter: Math.ceil((resetTime * 1000 - Date.now()) / 1000),
        resetAt: resetDate.toISOString(),
      },
      timestamp: new Date().toISOString(),
      path,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((resetTime * 1000 - Date.now()) / 1000)),
        "X-RateLimit-Reset": String(resetTime),
      },
    }
  );
}

/**
 * Extract request path from Request or NextRequest
 */
export function getRequestPath(request: Request): string {
  try {
    const url = new URL(request.url);
    return url.pathname;
  } catch {
    return "/api/unknown";
  }
}
