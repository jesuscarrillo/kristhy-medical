"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navAnchors = [
  { href: "#hero", key: "nav.home" },
  { href: "#services", key: "nav.services" },
  { href: "#about", key: "nav.about" },
  { href: "#contact", key: "nav.contact" },
];

export function Header({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#hero" className="flex items-center gap-3 font-semibold text-slate-900">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-sky-100">
            <Image src="/images/logo.png" alt="Logo Dra. Kristhy" fill sizes="48px" className="object-contain p-1" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base">Dra. Kristhy Moreno</span>
            <span className="text-xs text-slate-500">Obstetricia &amp; Ginecología</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navAnchors.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuLink
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {t(item.key)}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <LanguageSwitcher currentLocale={currentLocale} />
          <Button asChild>
            <Link href="#contact">{t("hero.cta_primary")}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher currentLocale={currentLocale} />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{t("hero.title")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {navAnchors.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Button asChild className="mt-2">
                  <Link href="#contact">{t("hero.cta_primary")}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
