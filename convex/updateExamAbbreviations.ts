import { mutation } from "./_generated/server";

/**
 * Update existing exams with abbreviations
 * This will add abbreviations to exams that don't have them yet
 */
export const updateExamAbbreviations = mutation({
  handler: async (ctx) => {
    const allExams = await ctx.db.query("exams").collect();
    
    // Map of exam names to abbreviations
    const abbreviationMap: Record<string, string> = {
      "Saudi Medical Licensure Examination": "SMLE",
      "Saudi Dental Licensure Examination": "SDLE",
      "Saudi Pharmacist Licensure Examination": "SPLE",
      "Saudi Nursing Licensure Examination": "SNLE",
      "Saudi Laboratory Licensure Examination": "SLLE",
      "Saudi Radiologic Technologist Licensure Examination": "SRTLE",
      "Saudi Respiratory Care Licensure Examination": "SRCLE",
      "Saudi Board Certification in Internal Medicine": "Internal Medicine Board",
      "Saudi Board Certification in Family Medicine": "Family Medicine Board",
      "Saudi Board Certification in Pediatrics": "Pediatrics Board",
      "Saudi Board Certification in General Surgery": "Surgery Board",
      "Saudi Board Certification in Obstetrics and Gynecology": "OB/GYN Board",
      "Saudi Board Certification in Emergency Medicine": "Emergency Medicine Board",
      "Saudi Board Certification in Psychiatry": "Psychiatry Board",
      "Saudi Board Certification in Critical Care Medicine": "Critical Care Medicine",
      "Saudi Board Certification in Otolaryngology (ENT)": "ENT Board",
      "Saudi Board Certification in Dermatology": "Dermatology Board",
      "SCFHS Classification Exam in Restorative Dentistry": "Restorative Dentistry",
      "SCFHS Classification Exam in Implant Dentistry": "Implant Dentistry",
      "SCFHS Classification Exam in Medical Microbiology": "Medical Microbiology",
      "SCFHS Exam for Genomic and Biotechnology Technician": "Genomics & Biotech",
      "SCFHS Exam for Prosthetics Technician": "Prosthetics Tech",
      "SCFHS Health Administration Specialist Exam": "Health Admin Specialist",
      "SCFHS Health Administration Technician Exam": "Health Admin Tech",
      "SCFHS Public Health Technician Exam": "Public Health Tech",
    };

    let updated = 0;
    let skipped = 0;

    for (const exam of allExams) {
      const abbreviation = abbreviationMap[exam.name];
      
      if (abbreviation && !exam.abbreviation) {
        await ctx.db.patch(exam._id, {
          abbreviation: abbreviation,
          updatedAt: Date.now(),
        });
        updated++;
      } else {
        skipped++;
      }
    }

    return {
      success: true,
      message: `Updated ${updated} exams with abbreviations. ${skipped} were skipped (already have abbreviation or not in map).`,
      updated,
      skipped,
      total: allExams.length,
    };
  },
});
