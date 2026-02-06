import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const AUTH_COOKIE_PREFIX = "kristhy_auth";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const hasSessionCookie = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith(AUTH_COOKIE_PREFIX) && cookie.name.includes("session")
    );

    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Apply i18n middleware to public routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/(es|en)/:path*",
  ],
};
