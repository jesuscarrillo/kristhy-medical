"use client";

import { useEffect } from "react";

// Sets the html[lang] attribute dynamically after hydration.
// The root layout provides lang="es" as SSR fallback for non-locale routes
// (login, dashboard). This component overrides it for locale routes (/en/*).
export function LocaleHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
