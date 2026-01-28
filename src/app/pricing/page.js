"use client";

import { PricingTable } from "@clerk/nextjs";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { Sparkles } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40 bg-linear-to-b from-muted/50 to-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Simple, transparent pricing</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Choose your <span className="text-primary">plan</span>
              </h1>

              <p className="mt-4 text-muted-foreground">
                Start free and upgrade as you grow. All plans include a 7-day
                free trial.
              </p>
            </div>
          </div>
        </section>

        {/* Clerk Pricing Table */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <PricingTable />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 border-t border-border/40">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll
                  continue to have access until the end of your billing period.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards (Visa, MasterCard, American
                  Express) through Stripe.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes! All paid plans come with a 7-day free trial. No credit
                  card required to start.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can change your plan at any time. When
                  upgrading, you'll be charged the prorated difference.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
