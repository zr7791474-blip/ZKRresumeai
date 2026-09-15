import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { billingService } = getServices();
    const result = await billingService.createPortalSession(auth.userId);
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
