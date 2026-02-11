"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { normalizePhoneNumber } from "@/lib/utils/whatsapp";

export function WhatsAppButton() {
  const phoneNumber = normalizePhoneNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+58 412-073-5223"
  );
  const defaultMessage = encodeURIComponent(
    "Buen día, estoy interesada en agendar una cita, muchas gracias!"
  );

  return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      aria-label="Contactar por WhatsApp"
      title="Escríbeme por WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl animate-[pulse_3s_ease-in-out_infinite] md:h-12 md:w-12"
    >
      <MessageCircle className="h-6 w-6 animate-pulse" />
    </Link>
  );
}
