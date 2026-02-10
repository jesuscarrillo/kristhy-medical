import { describe, it, expect, beforeEach, vi } from "vitest";
import { ZodError } from "zod";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  handleApiError,
  rateLimitErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  getRequestPath,
  ErrorCodes,
} from "../responses";

describe("API Response Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successResponse", () => {
    it("should create success response with data and meta", async () => {
      const data = { id: "123", name: "Test" };
      const response = successResponse(data);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("data", data);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("timestamp");
      expect(typeof body.meta.timestamp).toBe("string");
    });

    it("should include custom meta properties", async () => {
      const data = { id: "123" };
      const meta = { version: "1.0", message: "Success" };
      const response = successResponse(data, meta);

      const body = await response.json();
      expect(body.meta).toMatchObject(meta);
      expect(body.meta).toHaveProperty("timestamp");
    });
  });

  describe("errorResponse", () => {
    it("should create error response with correct structure", async () => {
      const response = errorResponse(
        ErrorCodes.NOT_FOUND,
        "Resource not found",
        404,
        "/api/test"
      );

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toEqual({
        error: ErrorCodes.NOT_FOUND,
        message: "Resource not found",
        timestamp: expect.any(String),
        path: "/api/test",
      });
    });

    it("should include details when provided", async () => {
      const details = { id: "123", reason: "deleted" };
      const response = errorResponse(
        ErrorCodes.NOT_FOUND,
        "Not found",
        404,
        "/api/test",
        details
      );

      const body = await response.json();
      expect(body.details).toEqual(details);
    });
  });

  describe("validationErrorResponse", () => {
    it("should format Zod validation errors correctly", async () => {
      // Create a mock ZodError
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["email"],
          message: "Expected string, received number",
        },
        {
          code: "too_small",
          minimum: 3,
          type: "string",
          inclusive: true,
          path: ["name"],
          message: "String must contain at least 3 character(s)",
        },
      ]);

      const response = validationErrorResponse(zodError, "/api/test");

      expect(response.status).toBe(422);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(body.message).toBe("Request validation failed");
      expect(body.details).toHaveProperty("errors");
      expect(body.details.errors).toHaveLength(2);
      expect(body.details.errors[0]).toMatchObject({
        field: "email",
        message: "Expected string, received number",
        code: "invalid_type",
      });
    });
  });

  describe("handleApiError", () => {
    it("should handle ZodError", async () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["field"],
          message: "Invalid type",
        },
      ]);

      const response = handleApiError(zodError, "/api/test");
      expect(response.status).toBe(422);
    });

    it("should handle error with 'not found' message", async () => {
      const error = new Error("User not found");
      const response = handleApiError(error, "/api/test");

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.NOT_FOUND);
    });

    it("should handle error with 'unauthorized' message", async () => {
      const error = new Error("Not authorized");
      const response = handleApiError(error, "/api/test");

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.UNAUTHORIZED);
    });

    it("should handle error with 'forbidden' message", async () => {
      const error = new Error("Access forbidden");
      const response = handleApiError(error, "/api/test");

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.FORBIDDEN);
    });

    it("should handle generic errors as internal server error", async () => {
      const error = new Error("Something went wrong");
      const response = handleApiError(error, "/api/test");

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.INTERNAL_ERROR);
      expect(body.message).toBe("An unexpected error occurred");
      expect(body.details).toBeUndefined(); // In test/production, don't leak details
    });

    it("should handle unknown errors", async () => {
      const response = handleApiError("unknown error", "/api/test");

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.INTERNAL_ERROR);
    });
  });

  describe("rateLimitErrorResponse", () => {
    it("should create rate limit error with retry headers", async () => {
      const resetTime = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
      const response = rateLimitErrorResponse(resetTime, "/api/test");

      expect(response.status).toBe(429);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.RATE_LIMIT);
      expect(body.message).toBe("Too many requests");
      expect(body.details).toHaveProperty("retryAfter");
      expect(body.details).toHaveProperty("resetAt");
      expect(typeof body.details.retryAfter).toBe("number");
      expect(typeof body.details.resetAt).toBe("string");

      // Check headers
      expect(response.headers.get("Retry-After")).toBeTruthy();
      expect(response.headers.get("X-RateLimit-Reset")).toBe(String(resetTime));
    });
  });

  describe("unauthorizedResponse", () => {
    it("should create 401 response with default message", async () => {
      const response = unauthorizedResponse(undefined, "/api/test");

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.UNAUTHORIZED);
      expect(body.message).toBe("Authentication required");
    });

    it("should create 401 response with custom message", async () => {
      const response = unauthorizedResponse("Invalid token", "/api/test");

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe("Invalid token");
    });
  });

  describe("forbiddenResponse", () => {
    it("should create 403 response with default message", async () => {
      const response = forbiddenResponse(undefined, "/api/test");

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.FORBIDDEN);
      expect(body.message).toBe("Access denied");
    });
  });

  describe("notFoundResponse", () => {
    it("should create 404 response for resource", async () => {
      const response = notFoundResponse("User", "/api/test");

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error).toBe(ErrorCodes.NOT_FOUND);
      expect(body.message).toBe("User not found");
    });
  });

  describe("getRequestPath", () => {
    it("should extract path from Request URL", () => {
      const request = new Request("https://example.com/api/test?param=value");
      const path = getRequestPath(request);

      expect(path).toBe("/api/test");
    });

    it("should handle invalid URLs gracefully", () => {
      const request = { url: "invalid-url" } as Request;
      const path = getRequestPath(request);

      expect(path).toBe("/api/unknown");
    });
  });

  describe("ErrorCodes", () => {
    it("should have all required error codes", () => {
      expect(ErrorCodes.BAD_REQUEST).toBe("BadRequest");
      expect(ErrorCodes.UNAUTHORIZED).toBe("Unauthorized");
      expect(ErrorCodes.FORBIDDEN).toBe("Forbidden");
      expect(ErrorCodes.NOT_FOUND).toBe("NotFound");
      expect(ErrorCodes.CONFLICT).toBe("Conflict");
      expect(ErrorCodes.VALIDATION_ERROR).toBe("ValidationError");
      expect(ErrorCodes.RATE_LIMIT).toBe("RateLimitExceeded");
      expect(ErrorCodes.INTERNAL_ERROR).toBe("InternalServerError");
      expect(ErrorCodes.SERVICE_UNAVAILABLE).toBe("ServiceUnavailable");
      expect(ErrorCodes.DATABASE_ERROR).toBe("DatabaseError");
    });
  });
});
