import { NextRequest } from "next/server";
import { prisma } from "@/infra/database/prisma/client";
import { contactValidator } from "@/validators/contact.validator";
import { ok, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api-auth";
import { AppError } from "@/core/errors/app.error";

const limiter = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = limiter(`contact:${ip}`);
    if (!success) {
      throw new AppError("Too many messages sent. Please try again later.", 429);
    }

    const body = await request.json();
    const dto = contactValidator.parse(body);

    await prisma.contactSubmission.create({ data: dto });

    return ok({ sent: true }, 201);
  } catch (error) {
    return fail(error);
  }
}
