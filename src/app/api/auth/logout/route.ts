import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { getAuthContext } from "@/lib/api-auth";
import { ok, fail } from "@/lib/api-response";
import { clearAuthCookies } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthContext(request);
    if (auth) {
      const { authService } = getServices();
      await authService.logout(auth.userId);
    }
    const res = ok({ loggedOut: true });
    clearAuthCookies(res);
    return res;
  } catch (error) {
    return fail(error);
  }
}
