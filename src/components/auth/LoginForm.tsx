"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { authClient } from "@/lib/auth-client";
import { verifyLoginCaptcha } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Cargar reCAPTCHA v2 solo cuando sea necesario
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
  loading: () => <div className="text-sm text-muted-foreground">Cargando verificación...</div>,
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showV2Fallback, setShowV2Fallback] = useState(false);
  const [recaptchaV2Token, setRecaptchaV2Token] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      // 1. Verificar que reCAPTCHA esté disponible
      if (!executeRecaptcha) {
        setError("Sistema de seguridad no disponible. Recarga la página.");
        setIsLoading(false);
        return;
      }

      // 2. Generar token v3 (siempre, incluso si ya se hizo v2)
      const recaptchaToken = await executeRecaptcha("login");

      // 3. Verificar reCAPTCHA en servidor
      const captchaResult = await verifyLoginCaptcha({
        email,
        password,
        recaptchaToken,
        recaptchaV2Token,
      });

      // 4. Manejar fallback a v2
      if (captchaResult.needsV2Fallback && !showV2Fallback) {
        setShowV2Fallback(true);
        setError("Verificación adicional requerida. Por favor, completa el desafío.");
        setIsLoading(false);
        return;
      }

      // 5. Si v2 está visible pero no completado
      if (showV2Fallback && !recaptchaV2Token) {
        setError("Por favor, completa la verificación antes de continuar.");
        setIsLoading(false);
        return;
      }

      // 6. Si captcha falló
      if (!captchaResult.success) {
        setError(captchaResult.error || "Verificación de seguridad fallida.");
        setIsLoading(false);
        return;
      }

      // 7. reCAPTCHA OK → proceder con login de Better Auth
      const authResult = await authClient.signIn.email({ email, password });

      if (authResult.error) {
        setError(authResult.error.message || "Credenciales inválidas. Intenta de nuevo.");
        setIsLoading(false);
        return;
      }

      // 8. Login exitoso → redirect
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login failed:", err);
      setError("Error al iniciar sesión. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {/* reCAPTCHA v2 Fallback (solo si score v3 es bajo) */}
      {showV2Fallback && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Verificación de seguridad
          </Label>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || ""}
            onChange={(token) => {
              setRecaptchaV2Token(token);
              setError(null); // Limpiar error cuando se complete v2
            }}
            onExpired={() => setRecaptchaV2Token(null)}
            onErrored={() => {
              setRecaptchaV2Token(null);
              setError("Error en la verificación. Intenta de nuevo.");
            }}
            theme="light"
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      {/* Disclaimer de privacidad de reCAPTCHA */}
      <p className="text-xs text-muted-foreground text-center">
        Este sitio está protegido por reCAPTCHA de Google.{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Política de privacidad
        </a>{" "}
        y{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Términos de servicio
        </a>
        .
      </p>
    </form>
  );
}
