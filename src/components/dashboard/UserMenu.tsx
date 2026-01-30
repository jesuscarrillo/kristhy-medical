"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
};

export function UserMenu({ name, email }: UserMenuProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-right text-xs text-slate-600">
        <div className="font-medium text-slate-800">{name ?? "Dra. Kristhy"}</div>
        <div>{email ?? ""}</div>
      </div>
      <Button size="sm" variant="outline" onClick={handleSignOut} disabled={isLoading}>
        {isLoading ? "Saliendo..." : "Cerrar sesión"}
      </Button>
    </div>
  );
}
