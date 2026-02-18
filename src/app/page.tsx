import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Dra. Kristhy Moreno | Obstetricia y Ginecología",
};

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
