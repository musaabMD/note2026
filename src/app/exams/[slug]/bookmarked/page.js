"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AppLayout } from "../../../../components/app-layout";
import { PageHeader } from "../../../../components/page-header";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: Bookmark },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample bookmarked questions
const bookmarkedQuestions = [
  {
    _id: "bq1",
    questionText: "Which of the following is the most common cause of mitral stenosis?",
    options: [
      { text: "Rheumatic heart disease", isCorrect: true },
      { text: "Infective endocarditis", isCorrect: false },
      { text: "Mitral valve prolapse", isCorrect: false },
      { text: "Congenital heart disease", isCorrect: false },
    ],
    explanation: "Rheumatic heart disease accounts for approximately 90% of mitral stenosis cases worldwide.",
    difficulty: "medium",
    subject: "Cardiology",
  },
  {
    _id: "bq2",
    questionText: "A patient presents with sudden onset of severe headache described as 'the worst headache of my life'. What is the most likely diagnosis?",
    options: [
      { text: "Subarachnoid hemorrhage", isCorrect: true },
      { text: "Migraine", isCorrect: false },
      { text: "Tension headache", isCorrect: false },
      { text: "Cluster headache", isCorrect: false },
    ],
    explanation: "The classic presentation of 'thunderclap headache' - worst headache of life with sudden onset - is highly suggestive of subarachnoid hemorrhage until proven otherwise.",
    difficulty: "easy",
    subject: "Neurology",
  },
  {
    _id: "bq3",
    questionText: "Which medication is first-line for the treatment of community-acquired pneumonia in an outpatient setting?",
    options: [
      { text: "Amoxicillin or Azithromycin", isCorrect: true },
      { text: "Vancomycin", isCorrect: false },
      { text: "Ciprofloxacin", isCorrect: false },
      { text: "Metronidazole", isCorrect: false },
    ],
    explanation: "For healthy adults without comorbidities, a macrolide (azithromycin) or amoxicillin is recommended as first-line therapy for community-acquired pneumonia.",
    difficulty: "medium",
    subject: "Internal Medicine",
  },
];

function QuestionCard({ question, index, onRemoveBookmark }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (optionIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start justify-between p-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {index + 1}
            </span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                question.difficulty === "easy" && "bg-green-100 text-green-700",
                question.difficulty === "medium" && "bg-yellow-100 text-yellow-700",
                question.difficulty === "hard" && "bg-red-100 text-red-700"
              )}>
                {question.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">{question.subject}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRemoveBookmark(question._id)}
          >
            <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-foreground leading-relaxed">{question.questionText}</p>
        </div>

        <div className="px-4 pb-4 space-y-2">
          {question.options?.map((option, optIndex) => {
            const isSelected = selectedAnswer === optIndex;
            const isCorrectOption = option.isCorrect;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={optIndex}
                onClick={() => handleOptionSelect(optIndex)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  !showResult && "hover:bg-muted/50 hover:border-primary/30 cursor-pointer",
                  showResult && isCorrectOption && "bg-green-50 border-green-300",
                  showResult && isSelected && !isCorrectOption && "bg-red-50 border-red-300",
                  !showResult && "border-border"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium border",
                  showResult && isCorrectOption && "bg-green-500 text-white border-green-500",
                  showResult && isSelected && !isCorrectOption && "bg-red-500 text-white border-red-500",
                  !showResult && "border-muted-foreground/30"
                )}>
                  {showResult && isCorrectOption ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : showResult && isSelected ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + optIndex)
                  )}
                </span>
                <span className={cn(
                  "flex-1",
                  showResult && isCorrectOption && "text-green-700 font-medium",
                  showResult && isSelected && !isCorrectOption && "text-red-700"
                )}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {showExplanation && question.explanation && (
          <div className="mx-4 mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-800 mb-1">Explanation</p>
                <p className="text-blue-700 text-sm">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExamBookmarkedPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [questions, setQuestions] = useState(bookmarkedQuestions);
  const [currentPage, setCurrentPage] = useState(0);

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";
  const questionsPerPage = 5;

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = searchQuery === "" ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage);

  const handleRemoveBookmark = (questionId) => {
    setQuestions(prev => prev.filter(q => q._id !== questionId));
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <PageHeader
            title="Bookmarked"
            description={`Your saved questions for ${examName}`}
            searchPlaceholder="Search bookmarked questions..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          <div className="mt-6 mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredQuestions.length} bookmarked question{filteredQuestions.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No bookmarked questions</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bookmark questions while studying to review them later
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentQuestions.map((question, index) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    index={startIndex + index}
                    onRemoveBookmark={handleRemoveBookmark}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
