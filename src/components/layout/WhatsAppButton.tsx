"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/584247648994?text=Hola%20Dra.%20Kristhy"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl md:h-12 md:w-12"
    >
      <MessageCircle className="h-6 w-6 animate-pulse" />
    </Link>
  );
}
