import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { ok, fail } from "@/lib/api-response";
import { requireAuth, getClientIp } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/core/errors/app.error";

const limiter = rateLimit({ maxRequests: 3, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const ip = getClientIp(request);
    const { success } = limiter(`resend-verification:${auth.userId}:${ip}`);
    if (!success) {
      throw new AppError("Too many attempts. Please try again later.", 429);
    }

    const { authService } = getServices();
    await authService.resendVerificationEmail(auth.userId);
    return ok({ sent: true });
  } catch (error) {
    return fail(error);
  }
}
