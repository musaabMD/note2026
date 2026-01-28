import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get questions for an exam
export const getByExam = query({
  args: {
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("questions")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId));

    const questions = await query.collect();

    // Filter by subject if provided
    let filtered = args.subjectId
      ? questions.filter(q => q.subjectId === args.subjectId)
      : questions;

    // Apply limit if provided
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

// Get question by ID
export const getById = query({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get questions by subject
export const getBySubject = query({
  args: {
    subjectId: v.id("subjects"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let questions = await ctx.db
      .query("questions")
      .withIndex("by_subject", (q) => q.eq("subjectId", args.subjectId))
      .collect();

    if (args.limit) {
      questions = questions.slice(0, args.limit);
    }

    return questions;
  },
});

// Create a new question
export const create = mutation({
  args: {
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
    questionText: v.string(),
    questionType: v.string(),
    options: v.optional(v.array(v.object({
      text: v.string(),
      isCorrect: v.boolean(),
    }))),
    correctAnswer: v.optional(v.string()),
    explanation: v.optional(v.string()),
    difficulty: v.string(),
    marks: v.number(),
    isPremium: v.boolean(),
    createdBy: v.string(),
    imageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const questionId = await ctx.db.insert("questions", {
      ...args,
      isNew: true,
      aiGenerated: false,
      createdAt: Date.now(),
    });

    // Update exam question count
    const exam = await ctx.db.get(args.examId);
    if (exam) {
      await ctx.db.patch(args.examId, {
        totalQuestions: (exam.totalQuestions || 0) + 1,
        updatedAt: Date.now(),
      });
    }

    return questionId;
  },
});

// Submit answer for a question (for tracking)
export const submitAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    userId: v.string(),
    selectedAnswer: v.string(),
    isCorrect: v.boolean(),
    timeTaken: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // This could be used to track user answers outside of assessments
    // For now, just return success
    return { success: true, isCorrect: args.isCorrect };
  },
});
