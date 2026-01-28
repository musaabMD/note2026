import { mutation } from "./_generated/server";

/**
 * Seed function for SCFHS (Saudi Commission for Health Specialties) exams
 * 
 * This mutation seeds the database with all SCFHS exams including:
 * - Licensure exams (SMLE, SDLE, SPLE, SNLE, SLLE, SRTLE, SRCLE)
 * - Medical board certifications (Internal Medicine, Family Medicine, etc.)
 * - Dental specialty exams
 * - Allied health classification exams
 * 
 * Run with: npx convex run seedScfhsExams:seedScfhsExams
 */

export const seedScfhsExams = mutation({
  handler: async (ctx) => {
    const systemUserId = "system"; // Default creator for seeded exams

    // SCFHS Licensure Exams
    const licensureExams = [
      {
        abbreviation: "SMLE",
        fullName: "Saudi Medical Licensure Examination",
        professionType: "Doctor (General Practitioner)",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Comprehensive exam for general practitioners covering internal medicine, pediatrics, surgery, OB/GYN, and other core medical topics",
        duration: "4.5 hours",
        slug: "smle"
      },
      {
        abbreviation: "SDLE",
        fullName: "Saudi Dental Licensure Examination",
        professionType: "Dentist (General)",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Licensing exam for general dentists covering oral health, clinical dentistry skills, and dental practice",
        duration: "4.5 hours",
        slug: "sdle"
      },
      {
        abbreviation: "SPLE",
        fullName: "Saudi Pharmacist Licensure Examination",
        professionType: "Pharmacist",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Exam for pharmacists covering basic and clinical pharmacy, pharmaceutical care, and Saudi pharmacy regulations",
        duration: "4.5 hours",
        slug: "sple"
      },
      {
        abbreviation: "SNLE",
        fullName: "Saudi Nursing Licensure Examination",
        professionType: "Nurse",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Comprehensive nursing exam covering medical-surgical nursing, fundamentals, pharmacology, and patient safety",
        duration: "4 hours",
        slug: "snle"
      },
      {
        abbreviation: "SLLE",
        fullName: "Saudi Laboratory Licensure Examination",
        professionType: "Laboratory Specialist/Technician",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Exam for laboratory professionals covering clinical laboratory sciences and diagnostic testing",
        duration: "4 hours",
        slug: "slle"
      },
      {
        abbreviation: "SRTLE",
        fullName: "Saudi Radiologic Technologist Licensure Examination",
        professionType: "Radiologic Technologist/Technician",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Exam for radiologic technologists covering radiography, imaging techniques, and radiation safety",
        duration: "4 hours",
        slug: "srtle"
      },
      {
        abbreviation: "SRCLE",
        fullName: "Saudi Respiratory Care Licensure Examination",
        professionType: "Respiratory Care Practitioner",
        category: "SCFHS",
        examType: "Licensure",
        status: "Active",
        description: "Exam for respiratory care practitioners covering respiratory therapy and patient care",
        duration: "4 hours",
        slug: "srcle"
      }
    ];

    // SCFHS Board/Specialty Certification Exams - Medical
    const medicalBoardExams = [
      {
        abbreviation: "Internal Medicine Board",
        fullName: "Saudi Board Certification in Internal Medicine",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for internal medicine specialists - Part 1 and Part 2 exams",
        slug: "internal-medicine-board"
      },
      {
        abbreviation: "Family Medicine Board",
        fullName: "Saudi Board Certification in Family Medicine",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for family medicine specialists covering comprehensive primary care",
        slug: "family-medicine-board"
      },
      {
        abbreviation: "Pediatrics Board",
        fullName: "Saudi Board Certification in Pediatrics",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for pediatrics specialists",
        slug: "pediatrics-board"
      },
      {
        abbreviation: "Surgery Board",
        fullName: "Saudi Board Certification in General Surgery",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for general surgery specialists",
        slug: "surgery-board"
      },
      {
        abbreviation: "OB/GYN Board",
        fullName: "Saudi Board Certification in Obstetrics and Gynecology",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for obstetrics and gynecology specialists",
        slug: "obgyn-board"
      },
      {
        abbreviation: "Emergency Medicine Board",
        fullName: "Saudi Board Certification in Emergency Medicine",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for emergency medicine specialists",
        slug: "emergency-medicine-board"
      },
      {
        abbreviation: "Psychiatry Board",
        fullName: "Saudi Board Certification in Psychiatry",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for psychiatry specialists",
        slug: "psychiatry-board"
      },
      {
        abbreviation: "Critical Care Medicine",
        fullName: "Saudi Board Certification in Critical Care Medicine",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for critical care medicine specialists",
        slug: "critical-care-board"
      },
      {
        abbreviation: "ENT Board",
        fullName: "Saudi Board Certification in Otolaryngology (ENT)",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for ENT specialists",
        slug: "ent-board"
      },
      {
        abbreviation: "Dermatology Board",
        fullName: "Saudi Board Certification in Dermatology",
        professionType: "Doctor (Specialist)",
        category: "SCFHS",
        examType: "Board Certification",
        status: "Active",
        description: "Board certification for dermatology specialists",
        slug: "dermatology-board"
      }
    ];

    // SCFHS Dental Specialty Exams
    const dentalSpecialtyExams = [
      {
        abbreviation: "Restorative Dentistry",
        fullName: "SCFHS Classification Exam in Restorative Dentistry",
        professionType: "Dentist (Specialist)",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Classification exam for restorative dentistry specialists",
        slug: "restorative-dentistry"
      },
      {
        abbreviation: "Implant Dentistry",
        fullName: "SCFHS Classification Exam in Implant Dentistry",
        professionType: "Dentist (Specialist)",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Classification exam for implant dentistry specialists",
        slug: "implant-dentistry"
      }
    ];

    // SCFHS Allied Health & Technical Exams
    const alliedHealthExams = [
      {
        abbreviation: "Medical Microbiology",
        fullName: "SCFHS Classification Exam in Medical Microbiology",
        professionType: "Laboratory Specialist",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Classification exam for medical microbiology specialists",
        slug: "medical-microbiology"
      },
      {
        abbreviation: "Genomics & Biotech",
        fullName: "SCFHS Exam for Genomic and Biotechnology Technician",
        professionType: "Laboratory Technician",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Exam for genomic and biotechnology technicians",
        slug: "genomics-biotech"
      },
      {
        abbreviation: "Prosthetics Tech",
        fullName: "SCFHS Exam for Prosthetics Technician",
        professionType: "Allied Health Technician",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Exam for prosthetics technicians",
        slug: "prosthetics-tech"
      },
      {
        abbreviation: "Health Admin Specialist",
        fullName: "SCFHS Health Administration Specialist Exam",
        professionType: "Allied Health Professional",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Classification exam for health administration specialists (English & Arabic)",
        slug: "health-admin-specialist"
      },
      {
        abbreviation: "Health Admin Tech",
        fullName: "SCFHS Health Administration Technician Exam",
        professionType: "Allied Health Technician",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Exam for health administration technicians",
        slug: "health-admin-tech"
      },
      {
        abbreviation: "Public Health Tech",
        fullName: "SCFHS Public Health Technician Exam",
        professionType: "Allied Health Technician",
        category: "SCFHS",
        examType: "Classification",
        status: "Active",
        description: "Exam for public health technicians",
        slug: "public-health-tech"
      }
    ];

    // Combine all exams
    const allExams = [
      ...licensureExams,
      ...medicalBoardExams,
      ...dentalSpecialtyExams,
      ...alliedHealthExams
    ];

    // Check for existing exams to avoid duplicates
    const existingExams = await ctx.db.query("exams").collect();
    const existingNames = new Set(existingExams.map((e) => e.name.toLowerCase()));

    let added = 0;
    let skipped = 0;
    const insertedIds = [];
    const now = Date.now();

    for (const exam of allExams) {
      // Skip if exam with same name already exists
      if (existingNames.has(exam.fullName.toLowerCase())) {
        skipped++;
        continue;
      }

      // Map to schema format
      const examData = {
        name: exam.fullName,
        slug: exam.slug, // Use slug from exam data
        abbreviation: exam.abbreviation,
        description: exam.description,
        category: exam.professionType, // Use professionType as category
        isActive: exam.status === "Active",
        isPublic: true,
        isPremium: false,
        requiredTier: "free",
        createdBy: systemUserId,
        isCompleted: false,
        isPinned: false,
        totalSubjects: 0,
        totalQuestions: 0,
        totalFiles: 0,
        createdAt: now,
        updatedAt: now,
      };
      
      const id = await ctx.db.insert("exams", examData);
      insertedIds.push(id);
      added++;
    }

    return {
      success: true,
      message: `Successfully seeded ${added} SCFHS exams. ${skipped} were skipped (already exist).`,
      count: added,
      skipped,
      total: allExams.length,
      breakdown: {
        licensure: licensureExams.length,
        medicalBoard: medicalBoardExams.length,
        dentalSpecialty: dentalSpecialtyExams.length,
        alliedHealth: alliedHealthExams.length
      }
    };
  },
});
