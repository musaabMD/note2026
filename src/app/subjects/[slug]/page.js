"use client";

import { useState } from "react";
import { use } from "react";
import { AppLayout } from "../../../components/app-layout";
import { PageHeader } from "../../../components/page-header";
import { MCQ } from "../../../components/mcq";
import { Pagination } from "../../../components/pagination";
import { FolderOpen, Heart, Brain, Stethoscope, Activity, Microscope, Users, Scissors, ShieldCheck, Building } from "lucide-react";

const allSubjects = [
  { name: "All", icon: FolderOpen },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
  { name: "Family Medicine", icon: Users },
  { name: "Surgery", icon: Scissors },
  { name: "Preventive Medicine", icon: ShieldCheck },
  { name: "ICU", icon: Building },
];

// Helper to get subject name from slug
function getSubjectNameFromSlug(slug) {
  const subjectMap = {
    "cardiology": "Cardiology",
    "neurology": "Neurology",
    "internal-medicine": "Internal Medicine",
    "emergency-medicine": "Emergency Medicine",
    "pathology": "Pathology",
    "family-medicine": "Family Medicine",
    "surgery": "Surgery",
    "preventive-medicine": "Preventive Medicine",
    "icu": "ICU",
  };
  return subjectMap[slug.toLowerCase()] || slug;
}

// Sample question data
const sampleQuestion = {
  question: "In a lean environment, the decoupling point CANNOT be located at which of the following points?",
  options: [
    { id: "1", text: "Final assembly point" },
    { id: "2", text: "A point at the beginning of the assembly process" },
    { id: "3", text: "Suppliers" },
    { id: "4", text: "Finished goods inventory" },
  ],
};

export default function SubjectPage({ params }) {
  const { slug } = use(params);
  const subjectName = getSubjectNameFromSlug(slug);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [crossedOptions, setCrossedOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleOptionCross = (questionId, optionId, isCrossed) => {
    const key = `${questionId}-${optionId}`;
    setCrossedOptions((prev) => ({
      ...prev,
      [key]: isCrossed,
    }));
  };

  // Generate 20 questions
  const questions = Array.from({ length: 20 }, (_, i) => ({
    id: `q-${i + 1}`,
    ...sampleQuestion,
  }));

  // Calculate pagination
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of questions
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl flex-1 flex flex-col">
          <PageHeader
            title={subjectName}
            description={`All content and resources for ${subjectName}`}
            searchPlaceholder={`Search ${subjectName} content, questions, and more...`}
            searchValue={searchQuery}
            filterButtons={allSubjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />
          
          <div className="space-y-8 mt-8 flex-1 pb-20">
            {currentQuestions.map((questionData) => {
              const questionCrossedOptions = {};
              questionData.options.forEach((option) => {
                const key = `${questionData.id}-${option.id}`;
                if (crossedOptions[key]) {
                  questionCrossedOptions[option.id] = true;
                }
              });

              return (
                <div key={questionData.id} className="bg-background rounded-xl border border-border shadow-sm p-6">
                  <MCQ
                    question={questionData.question}
                    options={questionData.options}
                    selectedOptionId={selectedOptions[questionData.id]}
                    onOptionSelect={(optionId) => handleOptionSelect(questionData.id, optionId)}
                    onOptionCross={(optionId, isCrossed) => 
                      handleOptionCross(questionData.id, optionId, isCrossed)
                    }
                    crossedOptions={questionCrossedOptions}
                    questionId={questionData.id}
                  />
                </div>
              );
            })}
          </div>

          {/* Pagination - Fixed at bottom */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
