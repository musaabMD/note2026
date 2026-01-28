import { mutation } from "./_generated/server";

/**
 * Migration function to move data from old "tasks" table to new "exams" table
 * 
 * This should be run once after deploying the new schema.
 * 
 * Usage: Call this mutation from Convex dashboard or via API once to migrate existing data.
 * 
 * Note: After migration, you can delete the old "tasks" table entries and the tasks.ts file.
 */
export const migrateTasksToExams = mutation({
  handler: async (ctx) => {
    // Check if tasks table still exists (it might not if schema was already updated)
    try {
      const oldTasks = await ctx.db.query("tasks" as any).collect();
      
      if (!oldTasks || oldTasks.length === 0) {
        return { migrated: 0, message: "No tasks to migrate or tasks table doesn't exist" };
      }

      let migrated = 0;
      const now = Date.now();

      for (const task of oldTasks) {
        // Check if exam already exists (by name match)
        const existingExam = await ctx.db
          .query("exams")
          .filter((q) => q.eq(q.field("name"), task.text || ""))
          .first();

        if (!existingExam) {
          // Migrate task to exam
          await ctx.db.insert("exams", {
            name: task.text || "Untitled Exam",
            description: task.description,
            category: task.category,
            createdBy: task.createdBy || "system", // Default to system if no creator
            isPublic: task.isPublic || false,
            isPremium: task.isPremium || false,
            requiredTier: task.requiredTier || "free",
            isActive: task.isActive !== false, // Default to true
            isCompleted: task.isCompleted || false,
            isPinned: task.pinned || false,
            totalSubjects: task.totalSubjects || 0,
            totalQuestions: task.totalQuestions || 0,
            totalFiles: task.totalFiles || 0,
            createdAt: task.createdAt || now,
            updatedAt: task.updatedAt || now,
          });
          migrated++;
        }
      }

      return { 
        migrated, 
        total: oldTasks.length,
        message: `Migrated ${migrated} tasks to exams` 
      };
    } catch (error: any) {
      // If tasks table doesn't exist, that's fine - migration already done
      if (error.message?.includes("tasks") || error.message?.includes("not found")) {
        return { 
          migrated: 0, 
          message: "Tasks table doesn't exist - migration may have already been completed" 
        };
      }
      throw error;
    }
  },
});
