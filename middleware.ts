import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Turnstile Security Check for all /admin routes
  const turnstilePassed = request.cookies.get("turnstile_passed");
  
  if (!turnstilePassed) {
    const redirectUrl = new URL("/turnstile", request.url);
    // Save the full path and query string they were trying to visit
    redirectUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Admin Authentication Checks
  if (pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get("admin-token");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin-token");

    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
