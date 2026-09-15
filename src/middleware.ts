import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/resumes", "/profile", "/settings", "/admin"];
const authPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // The access token is short-lived (15 min) and silently refreshed client-side via
  // /api/auth/me, so presence of a still-valid refresh token also counts as "has a session"
  // here — otherwise every full page reload past 15 minutes would bounce a signed-in user
  // to /login even though their session is still good.
  const hasSession = Boolean(accessToken || refreshToken);

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuth = authPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && hasSession) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const target = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resumes/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email"
  ]
};