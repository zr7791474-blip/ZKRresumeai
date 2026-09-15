import { NextRequest } from "next/server";
import { z } from "zod";
import { getServices } from "@/lib/di";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/api-auth";

const updateSettingsValidator = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  notifications: z
    .object({
      productUpdates: z.boolean().optional(),
      aiCreditAlerts: z.boolean().optional(),
      marketingEmails: z.boolean().optional(),
    })
    .optional(),
  privacy: z
    .object({
      profileVisible: z.boolean().optional(),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { settingsService } = getServices();
    const settings = await settingsService.getSettings(auth.userId);
    return ok(settings);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = updateSettingsValidator.parse(body);

    const { settingsService } = getServices();
    const settings = await settingsService.updateSettings(auth.userId, dto);
    return ok(settings);
  } catch (error) {
    return fail(error);
  }
}
