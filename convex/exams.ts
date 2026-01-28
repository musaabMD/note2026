import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { QueryCtx } from "./_generated/server";

// Helper function to generate URL-friendly slug
function generateSlug(name: string, abbreviation?: string): string {
  // Prefer abbreviation if available
  if (abbreviation && abbreviation.trim()) {
    return abbreviation
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  // Fall back to name
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Helper function to get accessible exams for a user
async function getAccessibleExamsHelper(ctx: QueryCtx, clerkId: string | null) {
  try {
    // Try to get user, but if users table doesn't exist, continue without user
    let user = null;
    if (clerkId) {
      try {
        user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
          .first();
      } catch (error: any) {
        // Users table might not exist yet - that's okay, continue without user
        console.warn("Users table not found - continuing without user context");
      }
    }

    if (!user || !clerkId) {
      // If no user, return only public free exams
      try {
        const publicExams = await ctx.db
          .query("exams")
          .withIndex("by_public", (q) => q.eq("isPublic", true))
          .collect();
        return publicExams.filter((exam) => !exam.isPremium);
      } catch (error: any) {
        // Exams table doesn't exist yet
        return [];
      }
    }

    const allExams = await ctx.db.query("exams").collect();

    // Filter exams based on subscription tier
    return allExams.filter((exam) => {
      // User's own exams are always accessible
      if (exam.createdBy === clerkId) return true;

      // Public free exams
      if (exam.isPublic && !exam.isPremium) return true;

      // Premium exams require appropriate subscription
      if (exam.isPremium) {
        const tierOrder = ["free", "basic", "premium", "enterprise"];
        const userTierIndex = tierOrder.indexOf(user.subscriptionTier);
        const requiredTierIndex = tierOrder.indexOf(exam.requiredTier);
        return userTierIndex >= requiredTierIndex;
      }

      return false;
    });
  } catch (error: any) {
    // If any table doesn't exist yet, return empty array
    console.warn("Error querying exams:", error.message);
    return [];
  }
}

// Get exams with access control
export const getAccessibleExams = query({
  args: {},
  handler: async (ctx) => {
    // Get user identity from JWT token
    const identity = await ctx.auth.getUserIdentity();
    const clerkId = identity?.subject || null;
    return await getAccessibleExamsHelper(ctx, clerkId);
  },
});

// Get all exams (for backward compatibility, but with access control)
export const get = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Get user identity from JWT token
      const identity = await ctx.auth.getUserIdentity();
      const clerkId = identity?.subject || null;

      return await getAccessibleExamsHelper(ctx, clerkId);
    } catch (error: any) {
      // If exams table doesn't exist yet (schema not deployed), return empty array
      if (error.message?.includes("exams") || error.message?.includes("not found")) {
        console.warn("Exams table not found - schema may not be deployed yet");
        return [];
      }
      throw error;
    }
  },
});

// Get exam by ID
export const getById = query({
  args: { id: v.id("exams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get exam by slug (uses index for fast lookup)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!args.slug || args.slug.trim() === "") {
        return undefined;
      }

      const normalizedSlug = args.slug.toLowerCase().trim();

      // Use index for fast lookup
      const exam = await ctx.db
        .query("exams")
        .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
        .first();

      if (exam) {
        return exam;
      }

      // Fallback: search by abbreviation or slugified name for backward compatibility
      const exams = await ctx.db.query("exams").collect();
      return exams.find((exam) => {
        // Check abbreviation
        if (exam.abbreviation) {
          const abbrevLower = exam.abbreviation.toLowerCase().trim();
          if (abbrevLower === normalizedSlug) {
            return true;
          }
        }

        // Check slugified name
        const examSlug = generateSlug(exam.name, exam.abbreviation);
        return examSlug === normalizedSlug;
      });
    } catch (error: any) {
      if (error.message?.includes("exams") || error.message?.includes("not found")) {
        console.warn("Exams table not found - schema may not be deployed yet");
        return undefined;
      }
      console.error("Error in getBySlug:", error);
      return undefined;
    }
  },
});

// Toggle pin status
export const togglePin = mutation({
  args: { id: v.id("exams") },
  handler: async (ctx, args) => {
    const exam = await ctx.db.get(args.id);
    if (!exam) {
      throw new Error("Exam not found");
    }
    await ctx.db.patch(args.id, {
      isPinned: !exam.isPinned,
      updatedAt: Date.now(),
    });
  },
});

// Create exam with usage limit check and auto-generate slug
export const createExam = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    abbreviation: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isPremium: v.boolean(),
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

    const totalUsage = await ctx.db
      .query("totalUsage")
      .withIndex("by_user", (q) => q.eq("userId", args.clerkId))
      .first();

    if (!totalUsage) throw new Error("Usage tracking not found");

    // Check if user has reached exam limit
    if (plan.features.maxExams !== -1 &&
        totalUsage.totalExamsCreated >= plan.features.maxExams) {
      throw new Error(`Exam limit reached. Upgrade to create more exams.`);
    }

    // Generate slug
    let slug = generateSlug(args.name, args.abbreviation);

    // Check for uniqueness and append number if needed
    let existingExam = await ctx.db
      .query("exams")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    let counter = 1;
    const baseSlug = slug;
    while (existingExam) {
      slug = `${baseSlug}-${counter}`;
      existingExam = await ctx.db
        .query("exams")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      counter++;
    }

    const now = Date.now();
    const examId = await ctx.db.insert("exams", {
      name: args.name,
      slug,
      abbreviation: args.abbreviation,
      description: args.description,
      category: args.category,
      createdBy: args.clerkId,
      isPublic: false,
      isPremium: args.isPremium,
      requiredTier: user.subscriptionTier,
      isActive: true,
      isCompleted: false,
      isPinned: false,
      totalSubjects: 0,
      totalQuestions: 0,
      totalFiles: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Update usage
    await ctx.db.patch(totalUsage._id, {
      totalExamsCreated: totalUsage.totalExamsCreated + 1,
      updatedAt: now,
    });

    return examId;
  },
});

// Update exam (also updates slug if name/abbreviation changes)
export const updateExam = mutation({
  args: {
    id: v.id("exams"),
    name: v.optional(v.string()),
    abbreviation: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const exam = await ctx.db.get(args.id);
    if (!exam) throw new Error("Exam not found");

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.abbreviation !== undefined) updates.abbreviation = args.abbreviation;
    if (args.description !== undefined) updates.description = args.description;
    if (args.category !== undefined) updates.category = args.category;

    // Regenerate slug if name or abbreviation changed
    if (args.name !== undefined || args.abbreviation !== undefined) {
      const newName = args.name || exam.name;
      const newAbbrev = args.abbreviation !== undefined ? args.abbreviation : exam.abbreviation;
      let newSlug = generateSlug(newName, newAbbrev);

      // Check if slug already exists (excluding current exam)
      let existingExam = await ctx.db
        .query("exams")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();

      if (existingExam && existingExam._id !== args.id) {
        let counter = 1;
        const baseSlug = newSlug;
        while (existingExam && existingExam._id !== args.id) {
          newSlug = `${baseSlug}-${counter}`;
          existingExam = await ctx.db
            .query("exams")
            .withIndex("by_slug", (q) => q.eq("slug", newSlug))
            .first();
          counter++;
        }
      }

      updates.slug = newSlug;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Migration: Add slugs to existing exams
export const migrateAddSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const exams = await ctx.db.query("exams").collect();
    let updated = 0;

    for (const exam of exams) {
      // Skip if already has a slug
      if (exam.slug) continue;

      let slug = generateSlug(exam.name, exam.abbreviation);

      // Check for uniqueness
      let existingExam = await ctx.db
        .query("exams")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      let counter = 1;
      const baseSlug = slug;
      while (existingExam) {
        slug = `${baseSlug}-${counter}`;
        existingExam = await ctx.db
          .query("exams")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first();
        counter++;
      }

      await ctx.db.patch(exam._id, { slug });
      updated++;
    }

    return { updated, total: exams.length };
  },
});
