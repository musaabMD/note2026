"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, ClerkLoaded } from "@clerk/nextjs";
import {
  CheckoutProvider,
  useCheckout,
  PaymentElementProvider,
  PaymentElement,
  usePaymentElement,
} from "@clerk/nextjs/experimental";
import { SiteHeader } from "../../components/site-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2, Check, Shield, CreditCard } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();

  return (
    <ClerkLoaded>
      <SignedIn>
        <CustomCheckout onComplete={() => router.push("/dashboard")} />
      </SignedIn>
    </ClerkLoaded>
  );
}

function CustomCheckout({ onComplete }) {
  const { checkout } = useCheckout();
  const { status } = checkout;

  if (status === "needs_initialization") {
    return <CheckoutInitialization />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentElementProvider checkout={checkout}>
              <PaymentSection onComplete={onComplete} />
            </PaymentElementProvider>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </div>

      <div>
        <CheckoutSummary />
      </div>
    </div>
  );
}

function CheckoutInitialization() {
  const { checkout } = useCheckout();
  const { start, status, fetchStatus } = checkout;

  if (status !== "needs_initialization") {
    return null;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Ready to checkout?</h2>
          <p className="text-muted-foreground">
            Click below to start the secure checkout process.
          </p>
          <Button
            onClick={start}
            disabled={fetchStatus === "fetching"}
            size="lg"
            className="w-full"
          >
            {fetchStatus === "fetching" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Start Checkout"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentSection({ onComplete }) {
  const { checkout } = useCheckout();
  const { isConfirming, confirm, finalize, error } = checkout;
  const { isFormReady, submit } = usePaymentElement();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormReady || isProcessing) return;
    setIsProcessing(true);

    try {
      // Submit payment form to get payment method
      const { data, error: submitError } = await submit();
      if (submitError) {
        setIsProcessing(false);
        return;
      }

      // Confirm checkout with payment method
      await confirm(data);

      // Complete checkout and redirect
      await finalize({
        navigate: onComplete,
      });
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        fallback={
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      />

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!isFormReady || isProcessing || isConfirming}
        size="lg"
        className="w-full"
      >
        {isProcessing || isConfirming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Purchase"
        )}
      </Button>
    </form>
  );
}

function CheckoutSummary() {
  const { checkout } = useCheckout();
  const { plan, totals } = checkout;

  if (!plan) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">
              {plan.description || "Subscription plan"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">
              {totals?.totalDueNow?.currencySymbol}
              {totals?.totalDueNow?.amountFormatted}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          {plan.features?.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>{feature.name || feature}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total due today</span>
            <span>
              {totals?.totalDueNow?.currencySymbol}
              {totals?.totalDueNow?.amountFormatted}
            </span>
          </div>
          {totals?.recurring && (
            <p className="text-xs text-muted-foreground mt-1">
              Then {totals.recurring.currencySymbol}
              {totals.recurring.amountFormatted}/{plan.period || "month"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId") || "";
  const planPeriod = searchParams.get("period") || "month";

  if (!planId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No plan selected. Please choose a plan from the pricing page.
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = "/pricing")}
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your subscription
          </p>
        </div>

        <CheckoutProvider for="user" planId={planId} planPeriod={planPeriod}>
          <CheckoutContent />
        </CheckoutProvider>
      </main>
    </div>
  );
}
