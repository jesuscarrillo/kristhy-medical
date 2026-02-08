import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,

  // Enable trustHost for automatic baseURL detection from request headers
  // This makes the system resilient to environment variable misconfiguration
  trustHost: true,

  // Keep baseURL as fallback for non-HTTP contexts
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Enhance trustedOrigins with multiple sources
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    "https://kristhy-medical.vercel.app",
    "http://localhost:3000",
  ].filter(Boolean) as string[],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  session: {
    modelName: "Session",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: false, // Disabled to fix production cookie issues - uses single session_token cookie
      maxAge: 60,
    },
  },
  advanced: {
    cookiePrefix: "kristhy_auth",
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  user: {
    modelName: "User",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "doctor",
        returned: true,
      },
    },
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
});

export type Session = typeof auth.$Infer.Session;
