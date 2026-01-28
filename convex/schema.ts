import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // USER & SUBSCRIPTION MANAGEMENT (Clerk)
  // ============================================
  
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (primary identifier)
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Subscription info (synced from Clerk)
    subscriptionTier: v.string(), // "free", "basic", "premium", "enterprise"
    subscriptionStatus: v.string(), // "active", "canceled", "past_due", "trialing", "incomplete"
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()), // Unix timestamp
    cancelAtPeriodEnd: v.optional(v.boolean()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_subscription", ["subscriptionTier", "subscriptionStatus"]),

  // Subscription plans configuration
  subscriptionPlans: defineTable({
    name: v.string(), // "Free", "Basic", "Premium", "Enterprise"
    tier: v.string(), // "free", "basic", "premium", "enterprise"
    stripePriceId: v.optional(v.string()), // Stripe price ID from Clerk
    clerkPlanId: v.optional(v.string()), // Clerk plan ID
    price: v.number(), // Monthly price in cents
    yearlyPrice: v.optional(v.number()), // Yearly price in cents
    currency: v.string(), // "usd", "eur", etc.
    
    // Feature limits
    features: v.object({
      maxExams: v.number(), // -1 for unlimited
      maxSubjectsPerExam: v.number(),
      maxAssessmentsPerDay: v.number(),
      aiQuestionsPerDay: v.number(),
      fileStorageGB: v.number(),
      maxFilesPerExam: v.number(),
      maxNotesPerExam: v.number(),
      
      // Feature access
      accessToAllExams: v.boolean(),
      accessToLibrary: v.boolean(),
      accessToHighYield: v.boolean(),
      accessToPremiumContent: v.boolean(),
      downloadPDFs: v.boolean(),
      offlineAccess: v.boolean(),
      prioritySupport: v.boolean(),
      customAssessments: v.boolean(),
      bulkQuestionGeneration: v.boolean(),
      advancedAnalytics: v.boolean(),
      whiteLabel: v.boolean(),
    }),
    
    isActive: v.boolean(),
    displayOrder: v.number(),
    createdAt: v.number(),
  }).index("by_tier", ["tier"])
    .index("by_active", ["isActive"]),

  // Daily usage tracking (resets daily)
  dailyUsage: defineTable({
    userId: v.string(), // Clerk ID
    date: v.string(), // "YYYY-MM-DD"
    
    // Usage counters
    assessmentsTaken: v.number(),
    aiQuestionsGenerated: v.number(),
    filesUploaded: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_date", ["userId", "date"])
    .index("by_date", ["date"]),

  // Total usage tracking (lifetime)
  totalUsage: defineTable({
    userId: v.string(), // Clerk ID
    
    // Current storage usage
    fileStorageUsedMB: v.number(),
    totalExamsCreated: v.number(),
    totalSubjectsCreated: v.number(),
    totalFilesUploaded: v.number(),
    totalNotesCreated: v.number(),
    
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ============================================
  // EXAM STRUCTURE
  // ============================================
  
  // Main exams table (renamed from tasks)
  exams: defineTable({
    name: v.string(),
    slug: v.optional(v.string()), // URL-friendly slug (auto-generated from abbreviation or name)
    abbreviation: v.optional(v.string()), // "SMLE", "SNLE", etc.
    description: v.optional(v.string()),
    category: v.optional(v.string()), // "Medical", "Engineering", "Banking", etc.
    difficulty: v.optional(v.string()), // "easy", "medium", "hard"
    icon: v.optional(v.string()),
    color: v.optional(v.string()),

    // Access control
    createdBy: v.string(), // Clerk user ID
    isPublic: v.boolean(), // Public exams visible to all
    isPremium: v.boolean(), // Requires premium subscription
    requiredTier: v.string(), // "free", "basic", "premium", "enterprise"

    // Metadata
    isActive: v.boolean(),
    isCompleted: v.boolean(),
    isPinned: v.boolean(),

    // Stats (denormalized for performance)
    totalSubjects: v.optional(v.number()),
    totalQuestions: v.optional(v.number()),
    totalFiles: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_creator", ["createdBy"])
    .index("by_public", ["isPublic"])
    .index("by_premium", ["isPremium"])
    .index("by_category", ["category"])
    .index("by_creator_active", ["createdBy", "isActive"])
    .index("by_tier", ["requiredTier"])
    .index("by_slug", ["slug"]),

  // Subjects belong to an exam
  subjects: defineTable({
    examId: v.id("exams"),
    name: v.string(),
    slug: v.optional(v.string()), // URL-friendly slug
    description: v.optional(v.string()),
    order: v.number(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),

    // Stats
    totalQuestions: v.optional(v.number()),
    totalFiles: v.optional(v.number()),

    createdAt: v.number(),
  }).index("by_exam", ["examId"])
    .index("by_exam_order", ["examId", "order"])
    .index("by_exam_slug", ["examId", "slug"]),

  // Topics (optional sub-division of subjects)
  topics: defineTable({
    subjectId: v.id("subjects"),
    examId: v.id("exams"),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    
    createdAt: v.number(),
  }).index("by_subject", ["subjectId"])
    .index("by_exam", ["examId"])
    .index("by_subject_order", ["subjectId", "order"]),

  // ============================================
  // CONTENT & RESOURCES
  // ============================================
  
  // Files (PDFs, documents, etc.)
  files: defineTable({
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
    
    name: v.string(),
    description: v.optional(v.string()),
    fileUrl: v.string(),
    storageId: v.string(), // Convex storage ID
    fileType: v.string(), // "pdf", "docx", "pptx", etc.
    fileSize: v.number(), // in bytes
    
    uploadedBy: v.string(), // Clerk user ID
    isNew: v.boolean(),
    isPremium: v.boolean(),
    
    uploadedAt: v.number(),
    tags: v.optional(v.array(v.string())),
  }).index("by_exam", ["examId"])
    .index("by_subject", ["subjectId"])
    .index("by_exam_new", ["examId", "isNew"])
    .index("by_uploader", ["uploadedBy"]),

  // Images
  images: defineTable({
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
    
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(),
    storageId: v.string(),
    thumbnailUrl: v.optional(v.string()),
    
    uploadedBy: v.string(),
    isNew: v.boolean(),
    isPremium: v.boolean(),
    
    uploadedAt: v.number(),
    tags: v.optional(v.array(v.string())),
  }).index("by_exam", ["examId"])
    .index("by_subject", ["subjectId"])
    .index("by_exam_new", ["examId", "isNew"]),

  // Questions
  questions: defineTable({
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
    
    questionText: v.string(),
    questionType: v.string(), // "mcq", "numerical", "true-false", "subjective"
    options: v.optional(v.array(v.object({
      text: v.string(),
      isCorrect: v.boolean(),
    }))),
    correctAnswer: v.optional(v.string()),
    explanation: v.optional(v.string()),
    
    difficulty: v.string(), // "easy", "medium", "hard"
    marks: v.number(),
    isNew: v.boolean(),
    isPremium: v.boolean(),
    
    aiGenerated: v.boolean(),
    createdBy: v.string(), // Clerk user ID or "ai"
    imageUrl: v.optional(v.string()),
    
    createdAt: v.number(),
    tags: v.optional(v.array(v.string())),
  }).index("by_exam", ["examId"])
    .index("by_subject", ["subjectId"])
    .index("by_exam_new", ["examId", "isNew"])
    .index("by_difficulty", ["difficulty"])
    .index("by_ai", ["aiGenerated"]),

  // Self-assessments/Tests
  assessments: defineTable({
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    
    title: v.string(),
    description: v.optional(v.string()),
    duration: v.number(), // in minutes
    totalMarks: v.number(),
    passingMarks: v.number(),
    questionIds: v.array(v.id("questions")),
    
    isActive: v.boolean(),
    isPremium: v.boolean(),
    
    createdBy: v.string(), // Clerk user ID or "ai"
    type: v.string(), // "practice", "mock", "previous-year", "custom"
    
    createdAt: v.number(),
  }).index("by_exam", ["examId"])
    .index("by_subject", ["subjectId"])
    .index("by_type", ["type"])
    .index("by_creator", ["createdBy"]),

  // User assessment attempts
  assessmentAttempts: defineTable({
    assessmentId: v.id("assessments"),
    userId: v.string(), // Clerk user ID
    examId: v.id("exams"),
    
    answers: v.array(v.object({
      questionId: v.id("questions"),
      selectedAnswer: v.optional(v.string()),
      isCorrect: v.boolean(),
      marksAwarded: v.number(),
      timeTaken: v.optional(v.number()),
    })),
    
    totalScore: v.number(),
    percentage: v.number(),
    timeTaken: v.number(),
    
    startedAt: v.number(),
    completedAt: v.number(),
    status: v.string(), // "in-progress", "completed", "abandoned"
  }).index("by_user", ["userId"])
    .index("by_assessment", ["assessmentId"])
    .index("by_user_exam", ["userId", "examId"]),

  // User notes
  notes: defineTable({
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
    
    userId: v.string(), // Clerk user ID
    title: v.string(),
    content: v.string(),
    isPinned: v.boolean(),
    
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_exam", ["userId", "examId"])
    .index("by_user_subject", ["userId", "subjectId"]),

  // Bookmarks
  bookmarks: defineTable({
    userId: v.string(), // Clerk user ID
    examId: v.id("exams"),
    resourceType: v.string(), // "file", "image", "question", "note", "topic", "assessment"
    resourceId: v.string(),
    subjectId: v.optional(v.id("subjects")),
    
    createdAt: v.number(),
  }).index("by_user_exam", ["userId", "examId"])
    .index("by_user_exam_type", ["userId", "examId", "resourceType"])
    .index("by_user_resource", ["userId", "resourceType", "resourceId"]),

  // Library/Study materials
  libraryResources: defineTable({
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    
    title: v.string(),
    description: v.string(),
    resourceType: v.string(), // "video", "article", "book", "course", "reference"
    url: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    storageId: v.optional(v.string()),
    
    author: v.optional(v.string()),
    duration: v.optional(v.number()),
    isPremium: v.boolean(),
    isExternal: v.boolean(),
    thumbnailUrl: v.optional(v.string()),
    
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_exam", ["examId"])
    .index("by_subject", ["subjectId"])
    .index("by_type", ["resourceType"])
    .index("by_premium", ["isPremium"]),

  // High-Yield (HY) topics
  highYield: defineTable({
    examId: v.id("exams"),
    subjectId: v.id("subjects"),
    topicId: v.optional(v.id("topics")),
    
    title: v.string(),
    description: v.string(),
    content: v.string(),
    importance: v.number(), // 1-10
    frequency: v.optional(v.string()),
    
    tips: v.optional(v.array(v.string())),
    relatedQuestionIds: v.optional(v.array(v.id("questions"))),
    
    isPremium: v.boolean(),
    createdBy: v.string(), // "ai" or Clerk user ID
    createdAt: v.number(),
  }).index("by_exam", ["examId"])
    .index("by_subject", ["subjectId"])
    .index("by_importance", ["importance"])
    .index("by_premium", ["isPremium"]),

  // User progress tracking
  userProgress: defineTable({
    userId: v.string(), // Clerk user ID
    examId: v.id("exams"),
    subjectId: v.optional(v.id("subjects")),
    
    totalQuestionsAttempted: v.number(),
    correctAnswers: v.number(),
    averageScore: v.number(),
    timeSpent: v.number(),
    
    lastActivityAt: v.number(),
    streak: v.number(),
    updatedAt: v.number(),
  }).index("by_user_exam", ["userId", "examId"])
    .index("by_user_subject", ["userId", "subjectId"]),
});
