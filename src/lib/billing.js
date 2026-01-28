import { auth } from "@clerk/nextjs/server";

/**
 * Server-side billing utilities for Clerk Billing
 * Use these in Server Components and API routes
 */

/**
 * Check if user has a specific plan
 * @param {string} plan - Plan slug (e.g., "basic", "premium", "enterprise")
 * @returns {Promise<boolean>}
 */
export async function hasPlan(plan) {
  const { has } = await auth();
  return has({ plan });
}

/**
 * Check if user has a specific feature
 * @param {string} feature - Feature slug
 * @returns {Promise<boolean>}
 */
export async function hasFeature(feature) {
  const { has } = await auth();
  return has({ feature });
}

/**
 * Get user's current plan tier
 * Returns the highest tier plan the user has
 * @returns {Promise<string>} Plan tier or "free"
 */
export async function getCurrentPlan() {
  const { has } = await auth();

  // Check plans in order of tier (highest first)
  if (has({ plan: "enterprise" })) return "enterprise";
  if (has({ plan: "premium" })) return "premium";
  if (has({ plan: "basic" })) return "basic";

  return "free";
}

/**
 * Check if user can access premium content
 * @returns {Promise<boolean>}
 */
export async function canAccessPremium() {
  const { has } = await auth();
  return has({ plan: "premium" }) || has({ plan: "enterprise" });
}

/**
 * Check multiple features at once
 * @param {string[]} features - Array of feature slugs
 * @returns {Promise<Record<string, boolean>>}
 */
export async function checkFeatures(features) {
  const { has } = await auth();
  const result = {};

  for (const feature of features) {
    result[feature] = has({ feature });
  }

  return result;
}

/**
 * Usage limits based on plan
 * Configure these in Clerk Dashboard as Features
 */
export const PLAN_LIMITS = {
  free: {
    exams: 3,
    questionsPerDay: 50,
    aiQuestionsPerDay: 0,
    downloads: false,
    offlineAccess: false,
  },
  basic: {
    exams: 10,
    questionsPerDay: 200,
    aiQuestionsPerDay: 10,
    downloads: true,
    offlineAccess: false,
  },
  premium: {
    exams: -1, // unlimited
    questionsPerDay: -1, // unlimited
    aiQuestionsPerDay: 50,
    downloads: true,
    offlineAccess: true,
  },
  enterprise: {
    exams: -1,
    questionsPerDay: -1,
    aiQuestionsPerDay: -1, // unlimited
    downloads: true,
    offlineAccess: true,
  },
};

/**
 * Get limits for current user's plan
 * @returns {Promise<object>}
 */
export async function getPlanLimits() {
  const plan = await getCurrentPlan();
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}
