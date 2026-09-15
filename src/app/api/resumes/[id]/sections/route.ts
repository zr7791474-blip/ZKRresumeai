import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { createSectionValidator } from "@/validators/resume.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const dto = createSectionValidator.parse(body);

    const { resumeService } = getServices();
    const section = await resumeService.addSection(id, auth.userId, dto);
    return ok(section, 201);
  } catch (error) {
    return fail(error);
  }
}
