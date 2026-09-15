import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { deleteAccountValidator } from "@/validators/auth.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";
import { clearAuthCookies } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = deleteAccountValidator.parse(body);

    const { authService, billingService } = getServices();
    await authService.deleteAccount(auth.userId, dto);
    await billingService.cancelSubscriptionForUser(auth.userId);
    await authService.logout(auth.userId);

    const res = ok({ deleted: true });
    clearAuthCookies(res);
    return res;
  } catch (error) {
    return fail(error);
  }
}
