import Stripe from "stripe";

/**
 * Stripe is entirely optional. If STRIPE_SECRET_KEY isn't set, getStripe()
 * returns null and every billing route responds with a clear 501 instead of
 * crashing — the Pricing page falls back to linking straight to signup and
 * the Settings page hides the billing section.
 */
let cachedClient: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cachedClient !== undefined) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  cachedClient = secretKey ? new Stripe(secretKey, { apiVersion: "2024-11-20.acacia" }) : null;
  return cachedClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRO_PRICE_ID);
}
