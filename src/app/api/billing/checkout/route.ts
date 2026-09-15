import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/core/errors/app.error";

const limiter = rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { success } = limiter(`billing-checkout:${auth.userId}`);
    if (!success) {
      throw new AppError("Too many attempts. Please try again in a bit.", 429);
    }

    const { billingService } = getServices();
    const result = await billingService.createCheckoutSession(auth.userId);
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
