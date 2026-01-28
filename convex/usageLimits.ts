import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Check if user can perform action based on daily limits
export const checkDailyLimit = query({
  args: {
    clerkId: v.string(),
    action: v.string(), // "assessment", "ai_question", "file_upload"
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    const plan = await ctx.db
      .query("subscriptionPlans")
      .withIndex("by_tier", (q) => q.eq("tier", user.subscriptionTier))
      .first();

    if (!plan) throw new Error("Plan not found");

    const today = new Date().toISOString().split("T")[0];
    const usage = await ctx.db
      .query("dailyUsage")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", args.clerkId).eq("date", today)
      )
      .first();

    const currentUsage = usage || {
      assessmentsTaken: 0,
      aiQuestionsGenerated: 0,
      filesUploaded: 0,
    };

    switch (args.action) {
      case "assessment":
        return {
          allowed: plan.features.maxAssessmentsPerDay === -1 || 
                   currentUsage.assessmentsTaken < plan.features.maxAssessmentsPerDay,
          current: currentUsage.assessmentsTaken,
          limit: plan.features.maxAssessmentsPerDay,
        };
      case "ai_question":
        return {
          allowed: plan.features.aiQuestionsPerDay === -1 || 
                   currentUsage.aiQuestionsGenerated < plan.features.aiQuestionsPerDay,
          current: currentUsage.aiQuestionsGenerated,
          limit: plan.features.aiQuestionsPerDay,
        };
      case "file_upload":
        const totalUsage = await ctx.db
          .query("totalUsage")
          .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
          .first();
        
        if (!totalUsage) {
          return { 
            allowed: plan.features.fileStorageGB === -1 || 0 < plan.features.fileStorageGB, 
            current: 0, 
            limit: plan.features.fileStorageGB 
          };
        }
        
        return {
          allowed: plan.features.fileStorageGB === -1 || 
                   totalUsage.fileStorageUsedMB / 1024 < plan.features.fileStorageGB,
          current: totalUsage.fileStorageUsedMB / 1024,
          limit: plan.features.fileStorageGB,
        };
      default:
        return { allowed: false, current: 0, limit: 0 };
    }
  },
});

// Increment usage counter
export const incrementUsage = mutation({
  args: {
    clerkId: v.string(),
    action: v.string(),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    const usage = await ctx.db
      .query("dailyUsage")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", args.clerkId).eq("date", today)
      )
      .first();

    const now = Date.now();
    const increment = args.amount || 1;

    if (usage) {
      const updates: any = { updatedAt: now };
      
      switch (args.action) {
        case "assessment":
          updates.assessmentsTaken = usage.assessmentsTaken + increment;
          break;
        case "ai_question":
          updates.aiQuestionsGenerated = usage.aiQuestionsGenerated + increment;
          break;
        case "file_upload":
          updates.filesUploaded = usage.filesUploaded + increment;
          break;
      }
      
      await ctx.db.patch(usage._id, updates);
    } else {
      await ctx.db.insert("dailyUsage", {
        userId: args.clerkId,
        date: today,
        assessmentsTaken: args.action === "assessment" ? increment : 0,
        aiQuestionsGenerated: args.action === "ai_question" ? increment : 0,
        filesUploaded: args.action === "file_upload" ? increment : 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
