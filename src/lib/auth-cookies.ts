import type { NextResponse } from "next/server";

const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes, matches JWT access token TTL
const DEFAULT_REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
  refreshMaxAgeSeconds: number | boolean = DEFAULT_REFRESH_MAX_AGE
) {
  // Backwards-compatible: a boolean still works ("remember me" on/off), while callers that
  // already know the exact remaining lifetime (e.g. after a token refresh) can pass seconds
  // directly so the cookie doesn't collapse back to the short default on every refresh.
  const refreshMaxAge =
    typeof refreshMaxAgeSeconds === "number"
      ? refreshMaxAgeSeconds
      : refreshMaxAgeSeconds
        ? 30 * 24 * 60 * 60
        : DEFAULT_REFRESH_MAX_AGE;
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: refreshMaxAge,
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
}
