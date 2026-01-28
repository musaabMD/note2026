# How to Seed Exams into Convex Database

## Option 1: Run from Convex Dashboard (Recommended)

1. Go to your Convex Dashboard: https://dashboard.convex.dev
2. Navigate to **Functions** tab
3. Find `seedExams:seedExams` in the function list
4. Click **Run** button
5. The function will add all 15 exams to your database

## Option 2: Run from Terminal

Make sure `npx convex dev` is running in a separate terminal, then run:

```bash
npx convex run seedExams:seedExams
```

## Option 3: Manual Entry via Dashboard

If the function isn't available yet, you can manually add exams through the Convex Dashboard:

1. Go to **Data** tab in Convex Dashboard
2. Select the `exams` table
3. Click **"+ Add Documents"**
4. Use this JSON template for each exam:

### General Licensure Exams:

**SMLE:**
```json
{
  "name": "Saudi Medical Licensure Examination",
  "description": "SMLE - General Practitioner licensure examination",
  "category": "Doctor (General Practitioner)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**SDLE:**
```json
{
  "name": "Saudi Dental Licensure Examination",
  "description": "SDLE - General Dentist licensure examination",
  "category": "Dentist (General)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**SPLE:**
```json
{
  "name": "Saudi Pharmacist Licensure Examination",
  "description": "SPLE - Pharmacist licensure examination",
  "category": "Pharmacist",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**SNLE:**
```json
{
  "name": "Saudi Nursing Licensure Examination",
  "description": "SNLE - Nurse licensure examination",
  "category": "Nurse",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**SLLE:**
```json
{
  "name": "Saudi Laboratory Licensure Examination",
  "description": "SLLE - Laboratory Specialist/Technician licensure examination",
  "category": "Laboratory Specialist/Technician",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**SRTLE:**
```json
{
  "name": "Saudi Radiologic Technologist Licensure Examination",
  "description": "SRTLE - Radiologic Technologist/Technician licensure examination",
  "category": "Radiologic Technologist/Technician",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**SRCLE:**
```json
{
  "name": "Saudi Respiratory Care Licensure Examination",
  "description": "SRCLE - Respiratory Care Practitioner licensure examination",
  "category": "Respiratory Care Practitioner",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

### Specialty Board Exams:

**Internal Medicine Board:**
```json
{
  "name": "Internal Medicine Board",
  "description": "Internal Medicine specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Family Medicine Board:**
```json
{
  "name": "Family Medicine Board",
  "description": "Family Medicine specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Pediatrics Board:**
```json
{
  "name": "Pediatrics Board",
  "description": "Pediatrics specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Surgery Board:**
```json
{
  "name": "Surgery Board",
  "description": "Surgery specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Obstetrics & Gynecology Board:**
```json
{
  "name": "Obstetrics & Gynecology Board",
  "description": "Obstetrics & Gynecology specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Emergency Medicine Board:**
```json
{
  "name": "Emergency Medicine Board",
  "description": "Emergency Medicine specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Psychiatry Board:**
```json
{
  "name": "Psychiatry Board",
  "description": "Psychiatry specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

**Critical Care Medicine:**
```json
{
  "name": "Critical Care Medicine",
  "description": "Critical Care Medicine specialty board examination",
  "category": "Doctor (Specialist)",
  "createdBy": "system",
  "isActive": true,
  "isPublic": true,
  "isPremium": false,
  "requiredTier": "free",
  "isCompleted": false,
  "isPinned": false,
  "totalSubjects": 0,
  "totalQuestions": 0,
  "totalFiles": 0,
  "createdAt": 1737892800000,
  "updatedAt": 1737892800000
}
```

## What the seedExams function does:

- Adds all 15 exams (7 general licensure + 8 specialty boards)
- Sets them as public and free (accessible to all users)
- Marks them as active
- Prevents duplicates (skips if exam with same name already exists)
- Returns a summary of how many were added/skipped

## After Seeding:

Once the exams are added, they will appear in your application's exam list. Users will be able to:
- View all exams on the home page
- Filter by category (General Practitioner, Specialist, etc.)
- Access exam details and subjects
- Pin favorite exams
