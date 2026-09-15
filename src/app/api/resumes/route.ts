import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { createResumeValidator } from "@/validators/resume.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { resumeService } = getServices();
    const resumes = await resumeService.getAll(auth.userId);
    return ok(resumes);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = createResumeValidator.parse(body);

    const { resumeService } = getServices();
    const resume = await resumeService.create(auth.userId, dto);
    return ok(resume, 201);
  } catch (error) {
    return fail(error);
  }
}
