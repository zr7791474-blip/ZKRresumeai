import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { resetPasswordValidator } from "@/validators/auth.validator";
import { ok, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api-auth";
import { AppError } from "@/core/errors/app.error";

// Tokens are unguessable UUIDs, so this isn't primarily brute-force protection —
// it's a defense against enumeration/DoS hammering this endpoint.
const limiter = rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = limiter(`reset-password:${ip}`);
    if (!success) {
      throw new AppError("Too many attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const dto = resetPasswordValidator.parse(body);

    const { authService } = getServices();
    await authService.resetPassword(dto);

    return ok({ reset: true });
  } catch (error) {
    return fail(error);
  }
}
