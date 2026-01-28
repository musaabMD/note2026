"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AppLayout } from "../../../../components/app-layout";
import { PageHeader } from "../../../../components/page-header";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  FolderOpen,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "../../../../lib/utils";

const allSubjects = [
  { name: "All", icon: FolderOpen },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample questions data for demo (will be replaced with real data)
const sampleQuestions = [
  {
    _id: "q1",
    questionText: "A 65-year-old man presents with chest pain radiating to the left arm. ECG shows ST elevation in leads V1-V4. What is the most likely diagnosis?",
    questionType: "mcq",
    options: [
      { text: "Anterior STEMI", isCorrect: true },
      { text: "Inferior STEMI", isCorrect: false },
      { text: "Unstable Angina", isCorrect: false },
      { text: "Pericarditis", isCorrect: false },
    ],
    explanation: "ST elevation in leads V1-V4 indicates anterior wall involvement, which is supplied by the LAD artery. This pattern is characteristic of anterior STEMI.",
    difficulty: "medium",
    marks: 1,
  },
  {
    _id: "q2",
    questionText: "Which of the following is the first-line treatment for a patient with newly diagnosed hypertension and diabetes?",
    questionType: "mcq",
    options: [
      { text: "ACE inhibitor", isCorrect: true },
      { text: "Beta blocker", isCorrect: false },
      { text: "Calcium channel blocker", isCorrect: false },
      { text: "Thiazide diuretic", isCorrect: false },
    ],
    explanation: "ACE inhibitors are preferred in diabetic patients due to their renoprotective effects and ability to reduce proteinuria.",
    difficulty: "easy",
    marks: 1,
  },
  {
    _id: "q3",
    questionText: "A patient with atrial fibrillation has a CHA2DS2-VASc score of 3. What is the recommended anticoagulation strategy?",
    questionType: "mcq",
    options: [
      { text: "Oral anticoagulation recommended", isCorrect: true },
      { text: "Aspirin only", isCorrect: false },
      { text: "No anticoagulation needed", isCorrect: false },
      { text: "Anticoagulation contraindicated", isCorrect: false },
    ],
    explanation: "A CHA2DS2-VASc score ≥2 in men or ≥3 in women indicates high stroke risk, and oral anticoagulation is recommended.",
    difficulty: "medium",
    marks: 1,
  },
];

function QuestionCard({ question, index, isBookmarked, onBookmarkToggle, examId }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (optionIndex) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
  };

  const isCorrect = selectedAnswer !== null && question.options[selectedAnswer]?.isCorrect;
  const correctIndex = question.options?.findIndex(opt => opt.isCorrect);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Question Header */}
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
              <span className="text-xs text-muted-foreground">
                {question.marks} mark{question.marks > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onBookmarkToggle(question._id)}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Question Text */}
        <div className="p-4">
          <p className="text-foreground leading-relaxed">{question.questionText}</p>
        </div>

        {/* Options */}
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

        {/* Explanation */}
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

export default function ExamSubjectPage({ params }) {
  const { slug: examSlug, subject: subjectSlug } = use(params);
  const { user } = useUser();
  const exam = useQuery(
    api.exams.getBySlug,
    examSlug ? { slug: examSlug } : "skip"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());

  const questionsPerPage = 5;
  const questions = sampleQuestions; // Will be replaced with real query

  // Format subject name (subject1 -> Subject 1)
  const subjectName = subjectSlug
    ? subjectSlug.replace(/subject/i, "Subject ").replace(/(\d+)/, "$1")
    : "Subject";

  const examName = exam?.name || exam?.abbreviation || examSlug;

  // Pagination
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const handleBookmarkToggle = (questionId) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <PageHeader
            title={subjectName}
            description={`${subjectName} questions for ${examName}`}
            searchPlaceholder={`Search ${subjectName} questions...`}
            searchValue={searchQuery}
            filterButtons={allSubjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {/* Questions Count */}
          <div className="mt-6 mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + questionsPerPage, questions.length)} of {questions.length} questions
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {bookmarkedQuestions.size} bookmarked
              </span>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {currentQuestions.map((question, index) => (
              <QuestionCard
                key={question._id}
                question={question}
                index={startIndex + index}
                isBookmarked={bookmarkedQuestions.has(question._id)}
                onBookmarkToggle={handleBookmarkToggle}
                examId={exam?._id}
              />
            ))}
          </div>

          {/* Pagination */}
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
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
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
        </div>
      </div>
    </AppLayout>
  );
}
