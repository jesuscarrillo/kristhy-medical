"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      closeButton
      toastOptions={{
        duration: 5000,
        style: { fontSize: "14px" },
      }}
    />
  );
}
