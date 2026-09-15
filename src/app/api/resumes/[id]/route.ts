import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { updateResumeValidator } from "@/validators/resume.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id } = await params;
    const { resumeService } = getServices();
    const resume = await resumeService.getById(id, auth.userId);
    return ok(resume);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const dto = updateResumeValidator.parse(body);

    const { resumeService } = getServices();
    const resume = await resumeService.update(id, auth.userId, dto);
    return ok(resume);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id } = await params;
    const { resumeService } = getServices();
    await resumeService.delete(id, auth.userId);
    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}
