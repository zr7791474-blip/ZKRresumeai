"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/components/ui/use-toast";

const freePlan = {
  name: "Free",
  price: "$0",
  period: "forever",
  description: "Everything you need to build a great first resume.",
  features: ["1 active resume", "50 AI credits", "PDF, DOCX & JSON export", "6 premium templates", "ATS optimization"],
};

const proPlan = {
  name: "Pro",
  price: "$9",
  period: "/month",
  description: "For active job seekers who want unlimited iterations.",
  features: [
    "Unlimited resumes",
    "500 AI credits / month",
    "Cover letter generator",
    "All templates & export formats",
    "Email support",
  ],
};

export default function PricingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const [checkingOut, setCheckingOut] = useState(false);

  const isPro = user?.plan === "PRO";

  async function handleUpgrade() {
    if (!isAuthenticated) {
      router.push("/register?next=pricing");
      return;
    }

    setCheckingOut(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (res.status === 501) {
          toast({ title: "Billing not enabled yet", description: "This deployment hasn't configured Stripe. Sign up for free in the meantime." });
          return;
        }
        throw new Error(json.error || "Couldn't start checkout.");
      }
      window.location.href = json.data.url;
    } catch (error) {
      toast({ title: "Checkout failed", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="relative mb-14 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 overflow-hidden rounded-2xl">
            <Image src="/hero/hero.jpg" alt="" fill className="object-cover object-[75%_15%] -z-20 opacity-[0.22] dark:opacity-[0.16]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/98 to-background/70" />
            <h1 className="relative text-3xl sm:text-4xl font-bold tracking-tight">Simple, honest pricing</h1>
            <p className="relative mt-3 text-muted-foreground max-w-lg">
              Start free. Upgrade to Pro whenever unlimited resumes and a bigger AI credit pool are worth it to you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border">
            <div className="bg-background p-8 sm:p-10">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{freePlan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{freePlan.price}</span>
                <span className="text-sm text-muted-foreground">{freePlan.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{freePlan.description}</p>
              <ul className="mt-8 space-y-3">
                {freePlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8" variant="outline" asChild>
                <Link href="/register">Get started free</Link>
              </Button>
            </div>

            <div className="bg-background p-8 sm:p-10 relative">
              <div className="absolute top-8 right-8 sm:top-10 sm:right-10">
                <span className="text-[11px] font-semibold text-brand uppercase tracking-wide">Most chosen</span>
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{proPlan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{proPlan.price}</span>
                <span className="text-sm text-muted-foreground">{proPlan.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{proPlan.description}</p>
              <ul className="mt-8 space-y-3">
                {proPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8" onClick={handleUpgrade} disabled={checkingOut || isPro}>
                {checkingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPro ? "Current plan" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Cancel anytime from your account settings. No trial period — Pro starts billing immediately at checkout.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
