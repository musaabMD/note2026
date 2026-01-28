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
  ClipboardCheck,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Clock,
  Target,
  Play,
  FileQuestion,
  Trophy,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: ClipboardCheck },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample assessments
const assessments = [
  {
    id: "1",
    title: "Cardiology Quick Quiz",
    description: "Test your knowledge on basic cardiology concepts",
    questionCount: 10,
    duration: 15,
    difficulty: "easy",
    subject: "Cardiology",
    completedCount: 245,
    averageScore: 78,
  },
  {
    id: "2",
    title: "Neurology Case Studies",
    description: "Complex case-based neurology questions",
    questionCount: 20,
    duration: 30,
    difficulty: "hard",
    subject: "Neurology",
    completedCount: 156,
    averageScore: 65,
  },
  {
    id: "3",
    title: "Internal Medicine Review",
    description: "Comprehensive internal medicine assessment",
    questionCount: 50,
    duration: 60,
    difficulty: "medium",
    subject: "Internal Medicine",
    completedCount: 312,
    averageScore: 72,
  },
  {
    id: "4",
    title: "Emergency Scenarios",
    description: "Time-critical emergency medicine questions",
    questionCount: 15,
    duration: 20,
    difficulty: "medium",
    subject: "Emergency Medicine",
    completedCount: 189,
    averageScore: 70,
  },
];

function AssessmentCard({ assessment }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{assessment.title}</h3>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  assessment.difficulty === "easy" && "bg-green-100 text-green-700",
                  assessment.difficulty === "medium" && "bg-yellow-100 text-yellow-700",
                  assessment.difficulty === "hard" && "bg-red-100 text-red-700"
                )}>
                  {assessment.difficulty}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{assessment.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileQuestion className="h-4 w-4" />
              {assessment.questionCount} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {assessment.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Avg: {assessment.averageScore}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/30">
          <span className="text-xs text-muted-foreground">
            {assessment.completedCount} completions
          </span>
          <Button size="sm" className="h-8">
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Start Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamSelfAssessmentPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch = searchQuery === "" ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || a.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <PageHeader
            title="Self Assessment"
            description={`Test your knowledge for ${examName}`}
            searchPlaceholder="Search assessments..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">76%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100">
                  <FileQuestion className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">320</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8.5h</p>
                  <p className="text-xs text-muted-foreground">Study Time</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Assessments List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Available Assessments</h2>
            {filteredAssessments.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No assessments found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssessments.map((assessment) => (
                  <AssessmentCard key={assessment.id} assessment={assessment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
