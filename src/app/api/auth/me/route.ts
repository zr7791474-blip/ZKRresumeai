import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { verifyAccessToken, getTokenRemainingSeconds } from "@/lib/jwt";
import { updateProfileValidator } from "@/validators/auth.validator";
import { ok, fail } from "@/lib/api-response";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import { requireAuth } from "@/lib/api-auth";
import { AppError } from "@/core/errors/app.error";

export async function GET(request: NextRequest) {
  const { authService } = getServices();
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Fast path: access token is still valid.
  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken);
      const user = await authService.getProfile(payload.userId);
      return ok({ user, accessToken });
    } catch {
      // fall through to refresh
    }
  }

  // Access token missing or expired — try to silently refresh from the refresh token.
  if (refreshToken) {
    try {
      const tokens = await authService.refreshTokens(refreshToken);
      const payload = verifyAccessToken(tokens.accessToken);
      const user = await authService.getProfile(payload.userId);
      const res = ok({ user, accessToken: tokens.accessToken });
      const remainingSeconds = getTokenRemainingSeconds(tokens.refreshToken) ?? 7 * 24 * 60 * 60;
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, remainingSeconds);
      return res;
    } catch (error) {
      const res = fail(error instanceof AppError ? error : new AppError("Session expired.", 401));
      clearAuthCookies(res);
      return res;
    }
  }

  return fail(new AppError("Not authenticated.", 401));
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = updateProfileValidator.parse(body);

    const { authService } = getServices();
    const user = await authService.updateProfile(auth.userId, dto);
    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
