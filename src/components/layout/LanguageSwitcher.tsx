"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const locale = currentLocale || "es";
  const toggleLocale = locale === "es" ? "en" : "es";

  const handleToggle = () => {
    startTransition(() => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      router.replace(`${pathname}${hash}`, { locale: toggleLocale, scroll: false });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={pending}
      aria-label="Cambiar idioma"
      className="font-semibold text-slate-700 hover:bg-slate-100"
    >
      {locale.toUpperCase()} / {toggleLocale.toUpperCase()}
    </Button>
  );
}
