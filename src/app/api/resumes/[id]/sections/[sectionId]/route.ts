import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { updateSectionValidator } from "@/validators/resume.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string; sectionId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id, sectionId } = await params;
    const body = await request.json();
    const dto = updateSectionValidator.parse(body);

    const { resumeService } = getServices();
    const section = await resumeService.updateSection(sectionId, id, auth.userId, dto);
    return ok(section);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id, sectionId } = await params;

    const { resumeService } = getServices();
    await resumeService.deleteSection(sectionId, id, auth.userId);
    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}
