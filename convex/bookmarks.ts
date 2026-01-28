import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all bookmarks for a user
export const getByUser = query({
  args: {
    userId: v.string(),
    resourceType: v.optional(v.string()),
    examId: v.optional(v.id("exams")),
  },
  handler: async (ctx, args) => {
    let bookmarks;

    if (args.examId && args.resourceType) {
      bookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_user_exam_type", (q) =>
          q.eq("userId", args.userId)
            .eq("examId", args.examId)
            .eq("resourceType", args.resourceType)
        )
        .collect();
    } else if (args.examId) {
      bookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_user_exam", (q) =>
          q.eq("userId", args.userId).eq("examId", args.examId)
        )
        .collect();
    } else {
      // Get all bookmarks for user and filter by type if needed
      const allBookmarks = await ctx.db
        .query("bookmarks")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .collect();

      bookmarks = args.resourceType
        ? allBookmarks.filter(b => b.resourceType === args.resourceType)
        : allBookmarks;
    }

    return bookmarks;
  },
});

// Get bookmarked questions for a user
export const getBookmarkedQuestions = query({
  args: {
    userId: v.string(),
    examId: v.optional(v.id("exams")),
  },
  handler: async (ctx, args) => {
    const bookmarks = args.examId
      ? await ctx.db
          .query("bookmarks")
          .withIndex("by_user_exam_type", (q) =>
            q.eq("userId", args.userId)
              .eq("examId", args.examId)
              .eq("resourceType", "question")
          )
          .collect()
      : await ctx.db
          .query("bookmarks")
          .filter((q) =>
            q.and(
              q.eq(q.field("userId"), args.userId),
              q.eq(q.field("resourceType"), "question")
            )
          )
          .collect();

    // Fetch the actual questions
    const questions = await Promise.all(
      bookmarks.map(async (bookmark) => {
        try {
          const question = await ctx.db.get(bookmark.resourceId as any);
          return question ? { ...question, bookmarkId: bookmark._id } : null;
        } catch {
          return null;
        }
      })
    );

    return questions.filter(Boolean);
  },
});

// Check if a resource is bookmarked
export const isBookmarked = query({
  args: {
    userId: v.string(),
    resourceType: v.string(),
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_resource", (q) =>
        q.eq("userId", args.userId)
          .eq("resourceType", args.resourceType)
          .eq("resourceId", args.resourceId)
      )
      .first();

    return !!bookmark;
  },
});

// Toggle bookmark (add if not exists, remove if exists)
export const toggle = mutation({
  args: {
    userId: v.string(),
    examId: v.id("exams"),
    resourceType: v.string(),
    resourceId: v.string(),
    subjectId: v.optional(v.id("subjects")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_resource", (q) =>
        q.eq("userId", args.userId)
          .eq("resourceType", args.resourceType)
          .eq("resourceId", args.resourceId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed", bookmarkId: null };
    } else {
      const bookmarkId = await ctx.db.insert("bookmarks", {
        userId: args.userId,
        examId: args.examId,
        resourceType: args.resourceType,
        resourceId: args.resourceId,
        subjectId: args.subjectId,
        createdAt: Date.now(),
      });
      return { action: "added", bookmarkId };
    }
  },
});

// Add bookmark
export const add = mutation({
  args: {
    userId: v.string(),
    examId: v.id("exams"),
    resourceType: v.string(),
    resourceId: v.string(),
    subjectId: v.optional(v.id("subjects")),
  },
  handler: async (ctx, args) => {
    // Check if already bookmarked
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_resource", (q) =>
        q.eq("userId", args.userId)
          .eq("resourceType", args.resourceType)
          .eq("resourceId", args.resourceId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("bookmarks", {
      userId: args.userId,
      examId: args.examId,
      resourceType: args.resourceType,
      resourceId: args.resourceId,
      subjectId: args.subjectId,
      createdAt: Date.now(),
    });
  },
});

// Remove bookmark
export const remove = mutation({
  args: {
    userId: v.string(),
    resourceType: v.string(),
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_resource", (q) =>
        q.eq("userId", args.userId)
          .eq("resourceType", args.resourceType)
          .eq("resourceId", args.resourceId)
      )
      .first();

    if (bookmark) {
      await ctx.db.delete(bookmark._id);
      return true;
    }
    return false;
  },
});
