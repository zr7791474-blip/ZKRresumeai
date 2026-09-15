import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/infra/database/prisma/client";
import { AppError } from "@/core/errors/app.error";
import { APP_URL } from "@/constants";
import type { IUserRepository } from "@/core/interfaces/repositories";

export class BillingService {
  constructor(private userRepo: IUserRepository) {}

  private requireStripe() {
    const stripe = getStripe();
    if (!stripe || !isStripeConfigured()) {
      throw new AppError("Billing isn't configured on this deployment yet.", 501);
    }
    return stripe;
  }

  private async getOrCreateCustomer(stripe: Stripe, userId: string): Promise<string> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found.", 404);

    if (user.stripeCustomerId) return user.stripeCustomerId;

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });

    await this.userRepo.update(userId, { stripeCustomerId: customer.id });
    return customer.id;
  }

  async createCheckoutSession(userId: string): Promise<{ url: string }> {
    const stripe = this.requireStripe();
    const customerId = await this.getOrCreateCustomer(stripe, userId);
    const priceId = process.env.STRIPE_PRO_PRICE_ID as string;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/settings?checkout=success`,
      cancel_url: `${APP_URL}/pricing?checkout=cancelled`,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
    });

    if (!session.url) {
      throw new AppError("Couldn't start checkout. Please try again.", 502);
    }
    return { url: session.url };
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    const stripe = this.requireStripe();
    const user = await this.userRepo.findById(userId);
    if (!user?.stripeCustomerId) {
      throw new AppError("You don't have an active subscription yet.", 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${APP_URL}/settings`,
    });

    return { url: session.url };
  }

  /**
   * Cancels a user's active Stripe subscription immediately, if one exists.
   * Safe to call unconditionally (e.g. from account deletion) — it's a no-op
   * when Stripe isn't configured or the user never subscribed, so it never
   * blocks the surrounding flow.
   */
  async cancelSubscriptionForUser(userId: string): Promise<void> {
    const stripe = getStripe();
    if (!stripe) return;

    const user = await this.userRepo.findById(userId);
    if (!user?.stripeSubscriptionId) return;

    try {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    } catch (err) {
      // Already-cancelled or missing-on-Stripe's-side subscriptions shouldn't
      // block account deletion — log and move on.
      console.error(`Failed to cancel Stripe subscription for user ${userId}:`, err);
    }
  }

  /** Verifies the Stripe signature and applies the event. Throws on an invalid signature. */
  async handleWebhook(rawBody: string, signature: string): Promise<void> {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !webhookSecret) {
      throw new AppError("Billing isn't configured on this deployment yet.", 501);
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new AppError(`Invalid webhook signature: ${err instanceof Error ? err.message : "unknown error"}`, 400);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "PRO", stripeSubscriptionId: String(session.subscription) },
          });
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const isActive = subscription.status === "active" || subscription.status === "trialing";
        const periodEnd = new Date(subscription.current_period_end * 1000);
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: isActive ? "PRO" : "FREE",
              stripeCurrentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "FREE", stripeSubscriptionId: null },
          });
        }
        break;
      }
      default:
        // Unhandled event types are intentionally ignored — Stripe sends many
        // more than we act on, and silently skipping is the correct response.
        break;
    }
  }
}
