import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { AppError } from "@/core/errors/app.error";
import type { JwtPayload } from "@/types";

export function getAccessTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return request.cookies.get("accessToken")?.value ?? null;
}

export function getAuthContext(request: NextRequest): JwtPayload | null {
  const token = getAccessTokenFromRequest(request);
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest): JwtPayload {
  const auth = getAuthContext(request);
  if (!auth) {
    throw new AppError("You must be signed in to do that.", 401);
  }
  return auth;
}

export function requireAdmin(request: NextRequest): JwtPayload {
  const auth = requireAuth(request);
  if (auth.role !== "ADMIN") {
    throw new AppError("You do not have permission to do that.", 403);
  }
  return auth;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
