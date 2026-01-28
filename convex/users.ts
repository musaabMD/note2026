import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create user from Clerk webhook
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      createdAt: now,
      updatedAt: now,
    });

    // Initialize usage tracking
    await ctx.db.insert("totalUsage", {
      userId: args.clerkId,
      fileStorageUsedMB: 0,
      totalExamsCreated: 0,
      totalSubjectsCreated: 0,
      totalFilesUploaded: 0,
      totalNotesCreated: 0,
      updatedAt: now,
    });

    return userId;
  },
});

// Update user from Clerk webhook
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      updatedAt: Date.now(),
    });
  },
});

// Delete user from Clerk webhook
export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }

    // Also delete usage tracking
    const totalUsage = await ctx.db
      .query("totalUsage")
      .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
      .first();

    if (totalUsage) {
      await ctx.db.delete(totalUsage._id);
    }
  },
});

// Update user subscription from Clerk webhook
export const updateSubscription = mutation({
  args: {
    clerkId: v.string(),
    subscriptionTier: v.string(),
    subscriptionStatus: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      subscriptionTier: args.subscriptionTier,
      subscriptionStatus: args.subscriptionStatus,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      updatedAt: Date.now(),
    });
  },
});

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const clerkId = identity.subject;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

// Get user by Clerk ID (for backward compatibility)
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Check if user can access feature based on subscription
export const canAccessFeature = query({
  args: {
    clerkId: v.string(),
    feature: v.string(), // "premium_content", "ai_generation", etc.
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return false;

    const plan = await ctx.db
      .query("subscriptionPlans")
      .withIndex("by_tier", (q) => q.eq("tier", user.subscriptionTier))
      .first();

    if (!plan) return false;

    // Check feature access based on plan
    switch (args.feature) {
      case "premium_content":
        return plan.features.accessToPremiumContent;
      case "library":
        return plan.features.accessToLibrary;
      case "high_yield":
        return plan.features.accessToHighYield;
      case "download_pdfs":
        return plan.features.downloadPDFs;
      case "custom_assessments":
        return plan.features.customAssessments;
      default:
        return false;
    }
  },
});
