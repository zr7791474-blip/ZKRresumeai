import { NextRequest, NextResponse } from "next/server";
import { getServices } from "@/lib/di";
import { fail } from "@/lib/api-response";
import { AppError } from "@/core/errors/app.error";

// Stripe webhooks must read the raw request body (for signature verification)
// rather than parsed JSON, so this route reads text directly instead of
// using the shared ok()/request.json() helpers used elsewhere.
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new AppError("Missing Stripe signature header.", 400);
    }

    const rawBody = await request.text();
    const { billingService } = getServices();
    await billingService.handleWebhook(rawBody, signature);

    return NextResponse.json({ received: true });
  } catch (error) {
    return fail(error);
  }
}
