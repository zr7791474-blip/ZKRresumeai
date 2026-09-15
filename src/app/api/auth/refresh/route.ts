import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { getTokenRemainingSeconds } from "@/lib/jwt";
import { ok, fail } from "@/lib/api-response";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";
import { AppError } from "@/core/errors/app.error";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      throw new AppError("No refresh token found.", 401);
    }

    const { authService } = getServices();
    const tokens = await authService.refreshTokens(refreshToken);

    const res = ok({ accessToken: tokens.accessToken });
    const remainingSeconds = getTokenRemainingSeconds(tokens.refreshToken) ?? 7 * 24 * 60 * 60;
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, remainingSeconds);
    return res;
  } catch (error) {
    const res = fail(error);
    clearAuthCookies(res);
    return res;
  }
}
