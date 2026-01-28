# Migration Guide: Tasks to Exams with Clerk Integration

This document outlines the changes made to rename the `tasks` table to `exams` and integrate Clerk authentication with subscription management.

## ✅ Completed Changes

### 1. Schema Updates (`convex/schema.ts`)
- Created comprehensive schema with:
  - `users` table for Clerk user management
  - `subscriptionPlans` table for plan configuration
  - `dailyUsage` and `totalUsage` tables for usage tracking
  - `exams` table (renamed from `tasks`) with access control
  - Supporting tables: `subjects`, `topics`, `files`, `images`, `questions`, `assessments`, `notes`, `bookmarks`, `libraryResources`, `highYield`, `userProgress`

### 2. Backend Functions
- **`convex/users.ts`**: User management and subscription sync functions
- **`convex/usageLimits.ts`**: Daily and total usage limit checking
- **`convex/exams.ts`**: Exam CRUD operations with access control (replaces `tasks.ts`)
- **`convex/migrations.ts`**: Migration helper to move data from `tasks` to `exams`

### 3. Clerk Integration
- **Webhook Handler** (`src/app/api/webhooks/clerk/route.ts`): Handles user creation, updates, deletion, and subscription events
- **Middleware** (`src/middleware.ts`): Updated with route protection
- **Subscription Hook** (`src/hooks/useSubscription.ts`): Client-side hook for subscription checks

### 4. Frontend Updates
- Updated all components to use `api.exams.*` instead of `api.tasks.*`
- Updated field names: `exam.text` → `exam.name`, `exam.pinned` → `exam.isPinned`
- Added Clerk user context to exam queries

### 5. Dependencies
- Installed `svix` package for webhook verification

## 🔧 Setup Required

### 1. Environment Variables
Add to your `.env.local`:
```env
CLERK_WEBHOOK_SECRET=whsec_... # Get from Clerk Dashboard > Webhooks
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 2. Clerk Webhook Configuration
1. Go to Clerk Dashboard > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `subscription.created` (if using Clerk Billing)
   - `subscription.updated`
   - `subscription.deleted`
4. Copy the webhook secret to `.env.local`

### 3. Initialize Subscription Plans
Run this in Convex dashboard or via API to set up default plans:

```typescript
// Example: Create default subscription plans
await convex.mutation(api.subscriptionPlans.createPlan, {
  name: "Free",
  tier: "free",
  price: 0,
  currency: "usd",
  features: {
    maxExams: 3,
    maxSubjectsPerExam: 10,
    maxAssessmentsPerDay: 5,
    aiQuestionsPerDay: 10,
    fileStorageGB: 1,
    maxFilesPerExam: 20,
    maxNotesPerExam: 50,
    accessToAllExams: false,
    accessToLibrary: false,
    accessToHighYield: false,
    accessToPremiumContent: false,
    downloadPDFs: false,
    offlineAccess: false,
    prioritySupport: false,
    customAssessments: false,
    bulkQuestionGeneration: false,
    advancedAnalytics: false,
    whiteLabel: false,
  },
  isActive: true,
  displayOrder: 0,
});
```

### 4. Data Migration
If you have existing data in the `tasks` table:

1. **Option A: Use Migration Function**
   ```typescript
   // Run once from Convex dashboard
   await convex.mutation(api.migrations.migrateTasksToExams, {});
   ```

2. **Option B: Manual Migration**
   - Export data from `tasks` table
   - Transform field names (`text` → `name`, `pinned` → `isPinned`)
   - Import into `exams` table

### 5. Update Clerk Plan Mapping
In `src/app/api/webhooks/clerk/route.ts`, update the `tierMap` to match your Clerk plan IDs:

```typescript
const tierMap: Record<string, string> = {
  "clerk_basic_plan_id": "basic",
  "clerk_premium_plan_id": "premium",
  "clerk_enterprise_plan_id": "enterprise",
};
```

## 📝 Field Name Changes

| Old (tasks) | New (exams) |
|------------|-------------|
| `text` | `name` |
| `pinned` | `isPinned` |
| N/A | `createdBy` (Clerk user ID) |
| N/A | `isPublic` |
| N/A | `isPremium` |
| N/A | `requiredTier` |

## 🚀 Next Steps

1. **Deploy Schema**: Run `npx convex dev` to deploy the new schema
2. **Set Up Webhooks**: Configure Clerk webhooks as described above
3. **Initialize Plans**: Create subscription plans in Convex
4. **Run Migration**: Migrate existing tasks data if applicable
5. **Test**: Verify user creation, subscription sync, and access control
6. **Clean Up**: After migration, you can delete `convex/tasks.ts` if no longer needed

## 🔒 Access Control

The new system enforces:
- **User's own exams**: Always accessible
- **Public free exams**: Accessible to all
- **Premium exams**: Require appropriate subscription tier
- **Usage limits**: Enforced based on subscription plan

## 📚 Usage Examples

### Check Subscription Status
```typescript
const { tier, status } = useSubscription();
```

### Check Feature Access
```typescript
const { checkFeatureAccess } = useSubscription();
const canAccess = checkFeatureAccess("premium_content");
```

### Check Daily Limits
```typescript
const { checkDailyLimit } = useSubscription();
const limit = checkDailyLimit("assessment");
if (limit?.allowed) {
  // Proceed with action
}
```

### Create Exam with Access Control
```typescript
const createExam = useMutation(api.exams.createExam);
await createExam({
  clerkId: user.id,
  name: "USMLE Step 1",
  isPremium: false,
});
```

## ⚠️ Important Notes

- The old `tasks` table will continue to exist until you manually delete it or run the migration
- All new exams should be created through `api.exams.createExam` to ensure proper access control
- Subscription status is automatically synced via Clerk webhooks
- Usage limits reset daily at midnight UTC
