import { NextRequest } from "next/server";
import { getServices } from "@/lib/di";
import { skillsSuggestValidator } from "@/validators/ai.validator";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = skillsSuggestValidator.parse(body);

    const { aiService } = getServices();
    const result = await aiService.suggestSkills(auth.userId, dto);
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
