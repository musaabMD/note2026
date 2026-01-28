import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all files for an exam
export const getByExam = query({
  args: {
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
  },
  handler: async (ctx, args) => {
    if (args.subjectId) {
      return await ctx.db
        .query("files")
        .withIndex("by_subject", (q) => q.eq("subjectId", args.subjectId))
        .collect();
    }

    return await ctx.db
      .query("files")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();
  },
});

// Get file by ID
export const getById = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get new files for an exam
export const getNewByExam = query({
  args: {
    examId: v.id("exams"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let files = await ctx.db
      .query("files")
      .withIndex("by_exam_new", (q) =>
        q.eq("examId", args.examId).eq("isNew", true)
      )
      .collect();

    if (args.limit) {
      files = files.slice(0, args.limit);
    }

    return files;
  },
});

// Create file record (after upload)
export const create = mutation({
  args: {
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
    name: v.string(),
    description: v.optional(v.string()),
    fileUrl: v.string(),
    storageId: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.string(),
    isPremium: v.boolean(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const fileId = await ctx.db.insert("files", {
      ...args,
      isNew: true,
      uploadedAt: Date.now(),
    });

    // Update exam file count
    const exam = await ctx.db.get(args.examId);
    if (exam) {
      await ctx.db.patch(args.examId, {
        totalFiles: (exam.totalFiles || 0) + 1,
        updatedAt: Date.now(),
      });
    }

    // Update subject file count if applicable
    if (args.subjectId) {
      const subject = await ctx.db.get(args.subjectId);
      if (subject) {
        await ctx.db.patch(args.subjectId, {
          totalFiles: (subject.totalFiles || 0) + 1,
        });
      }
    }

    return fileId;
  },
});

// Mark file as not new
export const markAsViewed = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isNew: false });
  },
});

// Delete file
export const remove = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) return false;

    // Update exam file count
    const exam = await ctx.db.get(file.examId);
    if (exam) {
      await ctx.db.patch(file.examId, {
        totalFiles: Math.max((exam.totalFiles || 1) - 1, 0),
        updatedAt: Date.now(),
      });
    }

    // Update subject file count if applicable
    if (file.subjectId) {
      const subject = await ctx.db.get(file.subjectId);
      if (subject) {
        await ctx.db.patch(file.subjectId, {
          totalFiles: Math.max((subject.totalFiles || 1) - 1, 0),
        });
      }
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Generate upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL from storage ID
export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
