"use server";

import { z } from "zod";
import { verifyRecaptcha } from "./recaptcha";
import { rateLimitAction } from "@/lib/rate-limit";

const VerifyLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Password requerido"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token requerido"),
  recaptchaV2Token: z.string().nullable().optional(),
});

interface VerifyLoginResult {
  success: boolean;
  needsV2Fallback?: boolean;
  error?: string;
}

/**
 * Verifica reCAPTCHA antes de permitir login
 * El login real (authClient.signIn.email) se hace en el cliente
 *
 * @param data - Datos del formulario de login
 * @returns Resultado de verificación
 */
export async function verifyLoginCaptcha(
  data: unknown
): Promise<VerifyLoginResult> {
  try {
    // 1. Rate limiting (5 intentos por 15 minutos)
    try {
      await rateLimitAction("login", {
        interval: 15 * 60 * 1000, // 15 minutos
        limit: 5,
      });
    } catch (error) {
      return {
        success: false,
        error: "Demasiados intentos. Por favor, espera unos minutos.",
      };
    }

    // 2. Validar datos
    const parsed = VerifyLoginSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Datos inválidos",
      };
    }

    const { recaptchaToken, recaptchaV2Token } = parsed.data;

    // 3. Verificar reCAPTCHA
    let captchaResult;

    if (recaptchaV2Token) {
      // Si viene token v2, verificar v2
      captchaResult = await verifyRecaptcha(recaptchaV2Token, true);
    } else {
      // Si no, verificar v3
      captchaResult = await verifyRecaptcha(recaptchaToken, false);
    }

    // 4. Manejar resultado de captcha
    if (!captchaResult.success) {
      // Si necesita fallback a v2
      if (captchaResult.needsV2Fallback) {
        return {
          success: false,
          needsV2Fallback: true,
        };
      }

      return {
        success: false,
        error: captchaResult.error || "Verificación de seguridad fallida",
      };
    }

    // 5. reCAPTCHA OK → el cliente puede proceder con signIn
    return { success: true };
  } catch (error) {
    console.error("Error en verifyLoginCaptcha:", error);
    return {
      success: false,
      error: "Error del servidor. Intenta de nuevo.",
    };
  }
}
