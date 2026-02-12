/// <reference types="next" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    DIRECT_URL: string;

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // Encryption
    ENCRYPTION_KEY: string;

    // Better Auth
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    NEXT_PUBLIC_BETTER_AUTH_URL: string;

    // Email
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;

    // Cron
    CRON_SECRET?: string;

    // WhatsApp
    NEXT_PUBLIC_WHATSAPP_PHONE: string;

    // reCAPTCHA
    NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY: string;
    RECAPTCHA_V3_SECRET_KEY: string;
    NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY: string;
    RECAPTCHA_V2_SECRET_KEY: string;
    RECAPTCHA_SCORE_THRESHOLD?: string;

    // Node
    NODE_ENV: "development" | "production" | "test";

    // Vercel
    VERCEL_URL?: string;

    // Seed
    SEED_DOCTOR_EMAIL?: string;
    SEED_DOCTOR_PASSWORD?: string;
    SEED_DOCTOR_NAME?: string;
  }
}
