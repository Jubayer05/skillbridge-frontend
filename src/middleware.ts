import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "skillbridge-user";

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/admin", "/student", "/tutor"];

// Routes that logged-in users should not see (auth pages)
const AUTH_PATHS = ["/auth/login", "/auth/register"];

function getUserFromRequest(request: NextRequest): {
  role: string | null;
  isLoggedIn: boolean;
} {
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return { role: null, isLoggedIn: false };

  try {
    const user = JSON.parse(decodeURIComponent(raw)) as { role?: string };
    const role = typeof user?.role === "string" ? user.role : null;
    return { role, isLoggedIn: !!role };
  } catch {
    return { role: null, isLoggedIn: false };
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { role, isLoggedIn } = getUserFromRequest(request);

  // ── Protect dashboard / role sub-routes ──────────────────────────────────
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect logged-in users away from auth pages ────────────────────────
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Role-based access control ─────────────────────────────────────────────
  // Students cannot access admin or tutor routes
  if (
    role === "STUDENT" &&
    (pathname.startsWith("/admin") || pathname.startsWith("/tutor"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Tutors cannot access admin routes
  if (role === "TUTOR" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admins are allowed everywhere

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico   (favicon)
     *  - public assets (images, fonts, etc.)
     *
     * We explicitly list the paths we care about instead of a negative
     * lookahead so the middleware only runs where needed.
     */
    "/dashboard",
    "/dashboard/:path*",
    "/admin/:path*",
    "/student/:path*",
    "/tutor/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
