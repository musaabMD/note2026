"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function useSubscription() {
  const { user } = useUser();
  
  // Use auth-based query for current user
  const userData = useQuery(api.users.getCurrentUser);

  const checkFeatureAccess = (feature: string) => {
    if (!user || !userData) return false;
    return useQuery(
      api.users.canAccessFeature,
      userData ? { clerkId: userData.clerkId, feature } : "skip"
    );
  };

  const checkDailyLimit = (action: string) => {
    if (!userData) return null;
    return useQuery(
      api.usageLimits.checkDailyLimit,
      { clerkId: userData.clerkId, action }
    );
  };

  return {
    user: userData,
    isLoading: userData === undefined,
    tier: userData?.subscriptionTier,
    status: userData?.subscriptionStatus,
    checkFeatureAccess,
    checkDailyLimit,
  };
}
