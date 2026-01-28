"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "../../components/app-layout";
import { PageHeader } from "../../components/page-header";
import { MCQ } from "../../components/mcq";
import { Pagination } from "../../components/pagination";
import { ClipboardCheck, Heart, Brain, Stethoscope, Activity, Microscope } from "lucide-react";

const subjects = [
  { name: "All", icon: ClipboardCheck },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Example questions data
const exampleQuestions = [
  {
    id: "1",
    question: "In a lean environment, the decoupling point CANNOT be located at which of the following points?",
    options: [
      { id: "1-1", text: "Final assembly point" },
      { id: "1-2", text: "A point at the beginning of the assembly process" },
      { id: "1-3", text: "Suppliers" },
      { id: "1-4", text: "Finished goods inventory" },
    ],
  },
  {
    id: "2",
    question: "What is the primary function of the cardiovascular system?",
    options: [
      { id: "2-1", text: "Digestion of food" },
      { id: "2-2", text: "Transport of oxygen and nutrients" },
      { id: "2-3", text: "Production of hormones" },
      { id: "2-4", text: "Filtration of waste products" },
    ],
  },
];

export default function SelfAssessmentPage() {
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

  // Calculate pagination
  const totalPages = Math.ceil(exampleQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = exampleQuestions.slice(startIndex, endIndex);

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
            title="Self Assessment"
            description="Test your knowledge with self-assessment questions"
            searchPlaceholder="Search assessments, subjects, and more..."
            searchValue={searchQuery}
            filterButtons={subjects}
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
