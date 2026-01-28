"use client";

import { useState } from "react";
import { PricingTable } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";

export function UpgradeDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 bg-transparent shadow-none p-0"
        hideCloseButton
      >
        <div className="bg-background rounded-lg shadow-xl p-6">
          <div className="text-center pb-4">
            <h2 className="text-2xl font-semibold">Upgrade Your Plan</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a plan that works best for your exam preparation
            </p>
          </div>

          <div className="py-4">
            <PricingTable />
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Secure payment powered by Stripe via Clerk Billing.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to use the upgrade dialog anywhere
export function useUpgradeDialog() {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    openUpgrade: () => setOpen(true),
    closeUpgrade: () => setOpen(false),
  };
}
