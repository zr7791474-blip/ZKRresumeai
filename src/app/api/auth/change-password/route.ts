import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { changePasswordValidator } from "@/validators/auth.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = changePasswordValidator.parse(body);

    const { authService } = getServices();
    const currentRefreshToken = request.cookies.get("refreshToken")?.value;
    await authService.changePassword(auth.userId, dto, currentRefreshToken);

    return ok({ changed: true });
  } catch (error) {
    return fail(error);
  }
}
