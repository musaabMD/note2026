"use client";

import { Protect } from "@clerk/nextjs";
import { Lock, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { UpgradeDialog } from "./upgrade-dialog";

/**
 * PlanGate - Wraps content that requires a specific plan
 * Uses Clerk's <Protect> component for plan-based access control
 *
 * @param {string} plan - Required plan (e.g., "basic", "premium", "enterprise")
 * @param {string} feature - Required feature (alternative to plan)
 * @param {React.ReactNode} children - Content to show if user has access
 * @param {React.ReactNode} fallback - Custom fallback (optional)
 */
export function PlanGate({ plan, feature, children, fallback }) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const defaultFallback = (
    <Card className="border-dashed">
      <CardContent className="py-8 text-center">
        <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-semibold mb-1">Premium Content</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to {plan || "a paid plan"} to access this content.
        </p>
        <Button onClick={() => setUpgradeOpen(true)} size="sm">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade Now
        </Button>
        <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      </CardContent>
    </Card>
  );

  // Use plan or feature for protection
  const protectProps = plan ? { plan } : feature ? { feature } : {};

  return (
    <Protect {...protectProps} fallback={fallback || defaultFallback}>
      {children}
    </Protect>
  );
}

/**
 * PremiumBadge - Shows a badge for premium content
 */
export function PremiumBadge({ plan = "premium" }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Crown className="h-3 w-3" />
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

/**
 * FeatureGate - Check for specific feature access
 */
export function FeatureGate({ feature, children, fallback }) {
  return (
    <PlanGate feature={feature} fallback={fallback}>
      {children}
    </PlanGate>
  );
}
