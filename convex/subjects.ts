import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to generate URL-friendly slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Get all subjects for an exam
export const getByExam = query({
  args: {
    examId: v.id("exams"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subjects")
      .withIndex("by_exam_order", (q) => q.eq("examId", args.examId))
      .collect();
  },
});

// Get subject by ID
export const getById = query({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get subject by slug within an exam
export const getBySlug = query({
  args: {
    examId: v.id("exams"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    // Try to use the index first
    const subjectByIndex = await ctx.db
      .query("subjects")
      .withIndex("by_exam_slug", (q) =>
        q.eq("examId", args.examId).eq("slug", args.slug.toLowerCase().trim())
      )
      .first();

    if (subjectByIndex) {
      return subjectByIndex;
    }

    // Fallback: search through subjects (for subjects without slug field)
    const subjects = await ctx.db
      .query("subjects")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    const normalizedSlug = args.slug.toLowerCase().trim();

    return subjects.find((subject) => {
      // Check stored slug first
      if (subject.slug === normalizedSlug) {
        return true;
      }
      // Fallback to generated slug from name
      const generatedSlug = generateSlug(subject.name);
      return generatedSlug === normalizedSlug;
    });
  },
});

// Create a new subject
export const create = mutation({
  args: {
    examId: v.id("exams"),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get current max order
    const existingSubjects = await ctx.db
      .query("subjects")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();

    const maxOrder = existingSubjects.reduce(
      (max, s) => Math.max(max, s.order),
      0
    );

    // Generate slug from name
    const slug = generateSlug(args.name);

    const subjectId = await ctx.db.insert("subjects", {
      examId: args.examId,
      name: args.name,
      slug: slug,
      description: args.description,
      icon: args.icon,
      color: args.color,
      order: maxOrder + 1,
      totalQuestions: 0,
      totalFiles: 0,
      createdAt: Date.now(),
    });

    // Update exam subject count
    const exam = await ctx.db.get(args.examId);
    if (exam) {
      await ctx.db.patch(args.examId, {
        totalSubjects: (exam.totalSubjects || 0) + 1,
        updatedAt: Date.now(),
      });
    }

    return subjectId;
  },
});

// Update subject
export const update = mutation({
  args: {
    id: v.id("subjects"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // If name is being updated, also update slug
    if (updates.name && !updates.slug) {
      updates.slug = generateSlug(updates.name);
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Delete subject
export const remove = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    if (!subject) return false;

    // Update exam subject count
    const exam = await ctx.db.get(subject.examId);
    if (exam) {
      await ctx.db.patch(subject.examId, {
        totalSubjects: Math.max((exam.totalSubjects || 1) - 1, 0),
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(args.id);
    return true;
  },
});

// Migration: Add slugs to existing subjects that don't have them
export const migrateAddSlugs = mutation({
  handler: async (ctx) => {
    const subjects = await ctx.db.query("subjects").collect();
    let updated = 0;

    for (const subject of subjects) {
      if (!subject.slug) {
        const slug = generateSlug(subject.name);
        await ctx.db.patch(subject._id, { slug });
        updated++;
      }
    }

    return {
      success: true,
      message: `Updated ${updated} subjects with slugs`,
      updated,
      total: subjects.length,
    };
  },
});

// Seed SMLE subjects with real medical specialties
export const seedSMLESubjects = mutation({
  handler: async (ctx) => {
    // Find SMLE exam
    const smleExam = await ctx.db
      .query("exams")
      .withIndex("by_slug", (q) => q.eq("slug", "smle"))
      .first();

    if (!smleExam) {
      return {
        success: false,
        message: "SMLE exam not found. Please seed exams first.",
      };
    }

    // Check for existing subjects
    const existingSubjects = await ctx.db
      .query("subjects")
      .withIndex("by_exam", (q) => q.eq("examId", smleExam._id))
      .collect();

    const existingSlugs = new Set(existingSubjects.map((s) => s.slug));

    // Real SMLE subjects based on exam blueprint
    const smleSubjects = [
      {
        name: "Internal Medicine",
        description: "Cardiology, Pulmonology, Gastroenterology, Nephrology, Endocrinology, Hematology, Rheumatology, Infectious Diseases",
        icon: "heart",
        color: "#ef4444",
      },
      {
        name: "Surgery",
        description: "General Surgery, Orthopedics, Urology, Neurosurgery, Vascular Surgery, Plastic Surgery",
        icon: "scissors",
        color: "#f97316",
      },
      {
        name: "Pediatrics",
        description: "Neonatology, Growth & Development, Pediatric Infections, Childhood Diseases, Pediatric Emergencies",
        icon: "baby",
        color: "#eab308",
      },
      {
        name: "Obstetrics & Gynecology",
        description: "Prenatal Care, Labor & Delivery, Gynecological Disorders, Reproductive Health, Maternal Medicine",
        icon: "heart-pulse",
        color: "#ec4899",
      },
      {
        name: "Psychiatry",
        description: "Mood Disorders, Psychotic Disorders, Anxiety, Personality Disorders, Substance Abuse, Child Psychiatry",
        icon: "brain",
        color: "#8b5cf6",
      },
      {
        name: "Family Medicine",
        description: "Preventive Care, Chronic Disease Management, Health Promotion, Primary Care Procedures",
        icon: "users",
        color: "#22c55e",
      },
      {
        name: "Emergency Medicine",
        description: "Trauma, Resuscitation, Acute Care, Toxicology, Environmental Emergencies",
        icon: "siren",
        color: "#dc2626",
      },
      {
        name: "ENT (Otolaryngology)",
        description: "Ear Disorders, Nose & Sinus, Throat Conditions, Head & Neck Surgery",
        icon: "ear",
        color: "#06b6d4",
      },
      {
        name: "Ophthalmology",
        description: "Eye Diseases, Visual Disorders, Ocular Emergencies, Refractive Errors",
        icon: "eye",
        color: "#0ea5e9",
      },
      {
        name: "Dermatology",
        description: "Skin Diseases, Infectious Skin Conditions, Dermatological Emergencies, Cosmetic Dermatology",
        icon: "scan-face",
        color: "#f59e0b",
      },
      {
        name: "Orthopedics",
        description: "Fractures, Joint Disorders, Sports Medicine, Spine Conditions, Pediatric Orthopedics",
        icon: "bone",
        color: "#64748b",
      },
      {
        name: "Radiology",
        description: "X-ray Interpretation, CT Imaging, MRI, Ultrasound, Nuclear Medicine",
        icon: "scan",
        color: "#6366f1",
      },
      {
        name: "Pathology",
        description: "Clinical Pathology, Anatomical Pathology, Laboratory Medicine, Cytology",
        icon: "microscope",
        color: "#a855f7",
      },
      {
        name: "Pharmacology",
        description: "Drug Classes, Mechanisms of Action, Adverse Effects, Drug Interactions, Therapeutics",
        icon: "pill",
        color: "#14b8a6",
      },
      {
        name: "Biostatistics & Ethics",
        description: "Study Design, Statistical Analysis, Medical Ethics, Research Methodology, Evidence-Based Medicine",
        icon: "chart-bar",
        color: "#78716c",
      },
    ];

    let added = 0;
    let skipped = 0;
    const now = Date.now();

    for (let i = 0; i < smleSubjects.length; i++) {
      const subject = smleSubjects[i];
      const slug = generateSlug(subject.name);

      // Skip if subject with same slug exists
      if (existingSlugs.has(slug)) {
        skipped++;
        continue;
      }

      await ctx.db.insert("subjects", {
        examId: smleExam._id,
        name: subject.name,
        slug: slug,
        description: subject.description,
        icon: subject.icon,
        color: subject.color,
        order: i + 1,
        totalQuestions: 0,
        totalFiles: 0,
        createdAt: now,
      });
      added++;
    }

    // Update exam subject count
    await ctx.db.patch(smleExam._id, {
      totalSubjects: existingSubjects.length + added,
      updatedAt: now,
    });

    return {
      success: true,
      message: `Added ${added} SMLE subjects. ${skipped} were skipped (already exist).`,
      added,
      skipped,
      total: smleSubjects.length,
    };
  },
});

// Seed subjects for other SCFHS exams
export const seedExamSubjects = mutation({
  args: {
    examSlug: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the exam by slug
    const exam = await ctx.db
      .query("exams")
      .withIndex("by_slug", (q) => q.eq("slug", args.examSlug))
      .first();

    if (!exam) {
      return {
        success: false,
        message: `Exam with slug "${args.examSlug}" not found.`,
      };
    }

    // Check for existing subjects
    const existingSubjects = await ctx.db
      .query("subjects")
      .withIndex("by_exam", (q) => q.eq("examId", exam._id))
      .collect();

    const existingSlugs = new Set(existingSubjects.map((s) => s.slug));

    // Define subjects based on exam type
    const examSubjectsMap: Record<string, Array<{ name: string; description: string; icon: string; color: string }>> = {
      // SNLE - Nursing
      snle: [
        { name: "Medical-Surgical Nursing", description: "Adult health nursing, perioperative care, chronic illness management", icon: "stethoscope", color: "#ef4444" },
        { name: "Fundamentals of Nursing", description: "Basic nursing skills, patient assessment, documentation", icon: "clipboard", color: "#f97316" },
        { name: "Maternal & Child Health", description: "Obstetric nursing, pediatric nursing, neonatal care", icon: "baby", color: "#ec4899" },
        { name: "Mental Health Nursing", description: "Psychiatric nursing, therapeutic communication, crisis intervention", icon: "brain", color: "#8b5cf6" },
        { name: "Community Health Nursing", description: "Public health, health promotion, disease prevention", icon: "users", color: "#22c55e" },
        { name: "Pharmacology for Nurses", description: "Drug administration, medication safety, pharmacokinetics", icon: "pill", color: "#14b8a6" },
        { name: "Leadership & Management", description: "Healthcare management, quality improvement, nursing ethics", icon: "briefcase", color: "#6366f1" },
        { name: "Critical Care Nursing", description: "ICU care, emergency nursing, advanced monitoring", icon: "heart-pulse", color: "#dc2626" },
      ],
      // SDLE - Dental
      sdle: [
        { name: "Oral Medicine & Pathology", description: "Oral diseases, mucosal conditions, diagnostic procedures", icon: "scan-face", color: "#ef4444" },
        { name: "Restorative Dentistry", description: "Fillings, crowns, bridges, dental materials", icon: "hammer", color: "#f97316" },
        { name: "Oral Surgery", description: "Extractions, implants, maxillofacial surgery", icon: "scissors", color: "#dc2626" },
        { name: "Periodontics", description: "Gum diseases, periodontal treatment, dental hygiene", icon: "droplet", color: "#ec4899" },
        { name: "Prosthodontics", description: "Dentures, dental prosthetics, implant restoration", icon: "box", color: "#8b5cf6" },
        { name: "Endodontics", description: "Root canal therapy, pulp diseases, periapical conditions", icon: "target", color: "#22c55e" },
        { name: "Orthodontics", description: "Teeth alignment, braces, malocclusion treatment", icon: "align-center", color: "#06b6d4" },
        { name: "Pediatric Dentistry", description: "Children's dental care, preventive dentistry, behavior management", icon: "baby", color: "#eab308" },
      ],
      // SPLE - Pharmacy
      sple: [
        { name: "Pharmacology", description: "Drug mechanisms, pharmacokinetics, pharmacodynamics", icon: "pill", color: "#ef4444" },
        { name: "Pharmaceutical Chemistry", description: "Drug structures, medicinal chemistry, drug design", icon: "flask", color: "#f97316" },
        { name: "Clinical Pharmacy", description: "Drug therapy management, patient counseling, medication review", icon: "stethoscope", color: "#22c55e" },
        { name: "Pharmaceutics", description: "Dosage forms, drug delivery systems, formulation", icon: "box", color: "#8b5cf6" },
        { name: "Pharmacognosy", description: "Natural products, herbal medicine, phytochemistry", icon: "leaf", color: "#14b8a6" },
        { name: "Hospital Pharmacy", description: "Drug distribution, sterile preparations, pharmacy management", icon: "building", color: "#6366f1" },
        { name: "Community Pharmacy", description: "OTC medications, patient education, pharmacy law", icon: "users", color: "#ec4899" },
        { name: "Saudi Pharmacy Regulations", description: "SFDA guidelines, controlled substances, pharmacy practice law", icon: "scale", color: "#64748b" },
      ],
      // Critical Care Board
      "critical-care-board": [
        { name: "Internal Medicine (ICU)", description: "Critical care aspects of internal medicine, sepsis, organ failure", icon: "heart", color: "#ef4444" },
        { name: "Surgery (ICU)", description: "Post-operative ICU care, trauma surgery, surgical complications", icon: "scissors", color: "#f97316" },
        { name: "Pediatric Critical Care", description: "PICU management, pediatric emergencies, neonatal ICU", icon: "baby", color: "#eab308" },
        { name: "Cardiac Critical Care", description: "Cardiac ICU, post-cardiac surgery, hemodynamic monitoring", icon: "heart-pulse", color: "#dc2626" },
        { name: "Respiratory Critical Care", description: "Mechanical ventilation, ARDS, respiratory failure", icon: "wind", color: "#06b6d4" },
        { name: "Neurological Critical Care", description: "Neuro ICU, stroke, traumatic brain injury", icon: "brain", color: "#8b5cf6" },
        { name: "Renal Critical Care", description: "Acute kidney injury, dialysis, fluid management", icon: "droplet", color: "#22c55e" },
        { name: "Infectious Diseases (ICU)", description: "ICU infections, antibiotic stewardship, sepsis protocols", icon: "bug", color: "#f59e0b" },
      ],
    };

    const subjects = examSubjectsMap[args.examSlug];

    if (!subjects) {
      return {
        success: false,
        message: `No predefined subjects for exam "${args.examSlug}". Add subjects manually or update the seed data.`,
      };
    }

    let added = 0;
    let skipped = 0;
    const now = Date.now();

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const slug = generateSlug(subject.name);

      if (existingSlugs.has(slug)) {
        skipped++;
        continue;
      }

      await ctx.db.insert("subjects", {
        examId: exam._id,
        name: subject.name,
        slug: slug,
        description: subject.description,
        icon: subject.icon,
        color: subject.color,
        order: existingSubjects.length + i + 1,
        totalQuestions: 0,
        totalFiles: 0,
        createdAt: now,
      });
      added++;
    }

    // Update exam subject count
    await ctx.db.patch(exam._id, {
      totalSubjects: existingSubjects.length + added,
      updatedAt: now,
    });

    return {
      success: true,
      examName: exam.name,
      message: `Added ${added} subjects to ${exam.name}. ${skipped} were skipped (already exist).`,
      added,
      skipped,
      total: subjects.length,
    };
  },
});
