import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const requireAuth = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
});

export const requireDoctor = cache(async () => {
  const session = await requireAuth();

  if (session.user.role !== "doctor") {
    redirect("/unauthorized");
  }

  return session;
});
