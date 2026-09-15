import { NextRequest, NextResponse } from "next/server";
import { getServices } from "@/lib/di";
import { exportResumeValidator } from "@/validators/resume.validator";
import { fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const dto = exportResumeValidator.parse(body);

    const { resumeService } = getServices();
    const { buffer, contentType, filename } = await resumeService.export(id, auth.userId, dto);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch (error) {
    return fail(error);
  }
}
