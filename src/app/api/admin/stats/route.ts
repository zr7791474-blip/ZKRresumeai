import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { ok, fail } from "@/lib/api-response";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const { adminService } = getServices();
    const stats = await adminService.getStats();
    return ok(stats);
  } catch (error) {
    return fail(error);
  }
}
