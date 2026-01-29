"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const locale = currentLocale || "es";

  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {["es", "en"].map((lang) => {
        const active = locale === lang;
        const label = lang === "es" ? "ES" : "EN";
        const flag = lang === "es" ? "🇪🇸" : "🇺🇸";
        return (
          <Button
            key={lang}
            size="sm"
            variant={active ? "default" : "ghost"}
            onClick={() =>
              startTransition(() => {
                const hash = typeof window !== "undefined" ? window.location.hash : "";
                router.replace(`${pathname}${hash}`, { locale: lang as "es" | "en", scroll: false });
              })
            }
            disabled={pending}
            className={`h-8 rounded-full px-3 text-xs font-semibold ${
              active ? "bg-primary text-primary-foreground" : "text-slate-700 hover:bg-slate-100"
            }`}
            aria-label={`Cambiar idioma a ${label}`}
          >
            <span className="mr-1">{flag}</span>
            {label}
          </Button>
        );
      })}
    </div>
  );
}
