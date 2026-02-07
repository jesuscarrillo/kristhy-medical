import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication (skip intl)
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to dashboard if already authenticated (skip intl)
const authRoutes = ["/login"];

// Routes that should skip intl processing entirely
const skipIntlRoutes = ["/dashboard", "/login", "/unauthorized", "/api"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for Better Auth session cookie
  // Better Auth uses either "session_token" or "{prefix}.session_token"
  const sessionCookie =
    request.cookies.get("kristhy_auth.session_token") ||
    request.cookies.get("session_token");

  const isAuthenticated = !!sessionCookie?.value;

  // Enhanced logging for dashboard routes (helps debug auth issues in production)
  if (pathname.startsWith("/dashboard")) {
    console.log("[Proxy] Dashboard access:", {
      pathname,
      hasCookie: !!sessionCookie,
      cookieName: sessionCookie?.name,
      cookiePrefix: sessionCookie?.value ? sessionCookie.value.substring(0, 20) + "..." : "none",
      timestamp: new Date().toISOString(),
    });
  }

  // Debug logs (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("[Proxy Debug]", {
      pathname,
      hasSessionCookie: !!sessionCookie,
      cookieName: sessionCookie?.name,
      allCookies: Array.from(request.cookies.getAll().map(c => c.name)),
    });
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Skip intl processing for dashboard, login, unauthorized, and API routes
  const shouldSkipIntl = skipIntlRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldSkipIntl) {
    return NextResponse.next();
  }

  // For public routes (/, /es/*, /en/*), use intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
