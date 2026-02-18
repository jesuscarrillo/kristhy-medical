"use server";

import { z } from "zod";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const SCORE_THRESHOLD = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || "0.5");

// Schema de validación de respuesta de Google
const RecaptchaResponseSchema = z.object({
  success: z.boolean(),
  score: z.number().optional(), // solo en v3
  action: z.string().optional(), // solo en v3
  challenge_ts: z.string(),
  hostname: z.string(),
  "error-codes": z.array(z.string()).optional(),
});

interface VerifyRecaptchaResult {
  success: boolean;
  score?: number;
  needsV2Fallback?: boolean;
  error?: string;
}

/**
 * Verifica un token de reCAPTCHA (v3 o v2) con Google API
 *
 * @param token - Token generado por reCAPTCHA
 * @param isV2 - true si es token v2 (checkbox), false si es v3 (invisible)
 * @returns Resultado de verificación con score (solo v3)
 */
export async function verifyRecaptcha(
  token: string,
  isV2: boolean = false
): Promise<VerifyRecaptchaResult> {
  try {
    // 1. Seleccionar secret key según versión
    const secretKey = isV2
      ? process.env.RECAPTCHA_V2_SECRET_KEY
      : process.env.RECAPTCHA_V3_SECRET_KEY;

    if (!secretKey) {
      console.error("reCAPTCHA secret key no configurada");
      return { success: false, error: "Configuración inválida" };
    }

    // 2. Verificar con Google API (timeout 5 segundos)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let response;
    try {
      response = await fetch(RECAPTCHA_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(
          `Google reCAPTCHA timeout después de 5s (versión: ${isV2 ? "v2" : "v3"})`
        );
        return { success: false, error: "Servicio temporalmente no disponible" };
      }
      throw fetchError;
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `Error en Google reCAPTCHA API: ${response.status} (versión: ${isV2 ? "v2" : "v3"})`
      );
      return { success: false, error: "Error de verificación" };
    }

    const data = await response.json();
    const validated = RecaptchaResponseSchema.safeParse(data);

    if (!validated.success) {
      console.error("Respuesta inválida de Google:", validated.error);
      return { success: false, error: "Respuesta inválida" };
    }

    const result = validated.data;

    // 3. Validar success
    if (!result.success) {
      console.warn("reCAPTCHA verification failed:", result["error-codes"]);
      return { success: false, error: "Verificación fallida" };
    }

    // 4. Validar hostname (prevenir bypass)
    const allowedHostnames = [
      "localhost",
      "127.0.0.1",
      process.env.VERCEL_URL,
      "kristhy-medical.vercel.app",
    ].filter(Boolean);

    if (!allowedHostnames.includes(result.hostname)) {
      console.warn("reCAPTCHA hostname inválido:", result.hostname);
      // No bloqueamos por hostname en desarrollo, solo advertimos
    }

    // 5. Para v3: validar score
    if (!isV2) {
      const score = result.score ?? 0;

      // Log para monitoreo
      console.log(`reCAPTCHA v3 score: ${score} (action: ${result.action})`);

      // Si score bajo → solicitar v2
      if (score < SCORE_THRESHOLD) {
        // Log para monitoreo (sin auditoría ya que no hay usuario autenticado aún)
        console.warn(
          `reCAPTCHA v3 score bajo: ${score} (threshold: ${SCORE_THRESHOLD}, action: ${result.action})`
        );

        return { success: false, needsV2Fallback: true, score };
      }

      return { success: true, score };
    }

    // 6. Para v2: solo validar success
    console.log("reCAPTCHA v2 verificado correctamente (fallback usado)");

    return { success: true };
  } catch (error) {
    console.error("Error verificando reCAPTCHA:", error);
    return { success: false, error: "Error del servidor" };
  }
}
