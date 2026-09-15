import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { forgotPasswordValidator } from "@/validators/auth.validator";
import { ok, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api-auth";
import { AppError } from "@/core/errors/app.error";

const limiter = rateLimit({ maxRequests: 3, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = limiter(`forgot-password:${ip}`);
    if (!success) {
      throw new AppError("Too many attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const dto = forgotPasswordValidator.parse(body);

    const { authService } = getServices();
    await authService.forgotPassword(dto);

    // Always return success, regardless of whether the email exists, to avoid leaking account existence.
    return ok({ sent: true });
  } catch (error) {
    return fail(error);
  }
}
