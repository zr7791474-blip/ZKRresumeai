import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { registerValidator } from "@/validators/auth.validator";
import { ok, fail } from "@/lib/api-response";
import { setAuthCookies } from "@/lib/auth-cookies";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api-auth";
import { AppError } from "@/core/errors/app.error";

const limiter = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = limiter(`register:${ip}`);
    if (!success) {
      throw new AppError("Too many attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const dto = registerValidator.parse(body);

    const { authService } = getServices();
    const userAgent = request.headers.get("user-agent");
    const { user, tokens } = await authService.register(dto, ip, userAgent);

    const res = ok({ user, accessToken: tokens.accessToken }, 201);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return res;
  } catch (error) {
    return fail(error);
  }
}
