"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type PrintButtonProps = {
  href: string;
};

export function PrintButton({ href }: PrintButtonProps) {
  return (
    <Button asChild variant="outline">
      <Link href={href} target="_blank">
        Imprimir
      </Link>
    </Button>
  );
}
