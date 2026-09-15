import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { ok, fail } from "@/lib/api-response";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 10));
    const search = searchParams.get("search") || undefined;

    const { adminService } = getServices();
    const result = await adminService.listUsers({ page, pageSize, search });
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
