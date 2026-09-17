"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const freePlan = {
  name: "Free",
  price: "$0",
  period: "forever",
  description: "Everything you need to build a great first resume.",
  features: ["1 active resume", "AI writing tools", "PDF, DOCX & JSON export", "6 premium templates", "ATS optimization"],
};

const proPlan = {
  name: "Pro",
  price: "$9",
  period: "/month",
  description: "For active job seekers who want unlimited iterations.",
  features: [
    "Unlimited resumes",
    "Priority AI writing tools",
    "Cover letter generator",
    "All templates & export formats",
    "Email support",
  ],
};

export default function PricingPage() {
  const { toast } = useToast();

  function handleUpgrade() {
    toast({
      title: "This is a demo",
      description: "Billing isn't connected in this build — explore the dashboard for free instead.",
    });
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
              This is a demo build — pricing below is illustrative and no payment is processed.
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
                <Link href="/dashboard">Try the demo</Link>
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
              <Button className="w-full mt-8" onClick={handleUpgrade}>
                Upgrade to Pro
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            This is a demo product. No account, payment, or subscription is created anywhere on this page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
