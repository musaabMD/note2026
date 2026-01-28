"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { AppLayout } from "../../../../../components/app-layout";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { FileText, HelpCircle, Image as ImageIcon, BookOpen } from "lucide-react";

export default function SubjectPage() {
  const params = useParams();
  const examSlug = params?.slug;
  const subjectSlug = params?.subjectSlug;

  // First get the exam by slug
  const exam = useQuery(
    api.exams.getBySlug,
    examSlug ? { slug: examSlug } : "skip"
  );

  // Then get the subject by slug within that exam
  const subject = useQuery(
    api.subjects.getBySlug,
    exam?._id && subjectSlug
      ? { examId: exam._id, slug: subjectSlug }
      : "skip"
  );

  // Get questions for this subject
  const questions = useQuery(
    api.questions.getBySubject,
    subject?._id ? { subjectId: subject._id } : "skip"
  );

  // Get files for this subject
  const files = useQuery(
    api.files.getByExam,
    exam?._id ? { examId: exam._id } : "skip"
  );

  // Filter files for this subject
  const subjectFiles = files?.filter(
    (file) => file.subjectId === subject?._id
  ) || [];

  const isLoading = exam === undefined || subject === undefined;

  return (
    <AppLayout>
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        ) : !exam ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-muted-foreground">
              Exam not found
            </h1>
            <p className="text-muted-foreground mt-2">
              The exam &quot;{examSlug}&quot; does not exist.
            </p>
          </div>
        ) : !subject ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-muted-foreground">
              Subject not found
            </h1>
            <p className="text-muted-foreground mt-2">
              The subject &quot;{subjectSlug}&quot; does not exist in {exam.name}.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{exam.abbreviation || exam.name}</span>
                <span>/</span>
                <span>{subject.name}</span>
              </div>
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              {subject.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  {subject.description}
                </p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Questions
                  </CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {questions?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Practice questions available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Files</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {subjectFiles.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Study materials
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Your Progress
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0%</div>
                  <p className="text-xs text-muted-foreground">
                    Questions completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Accuracy
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">
                    --
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average score
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              {/* Questions Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Practice Questions
                </h2>
                {questions && questions.length > 0 ? (
                  <div className="grid gap-4">
                    {questions.slice(0, 5).map((question, index) => (
                      <Card key={question._id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="shrink-0">
                              Q{index + 1}
                            </Badge>
                            <div>
                              <p className="text-sm">{question.questionText}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  variant={
                                    question.difficulty === "easy"
                                      ? "secondary"
                                      : question.difficulty === "hard"
                                        ? "destructive"
                                        : "default"
                                  }
                                >
                                  {question.difficulty}
                                </Badge>
                                {question.isNew && (
                                  <Badge variant="outline">New</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {questions.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground">
                        +{questions.length - 5} more questions
                      </p>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No questions available yet for this subject.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Files Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Study Materials</h2>
                {subjectFiles.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subjectFiles.map((file) => (
                      <Card key={file._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.fileType.toUpperCase()} •{" "}
                                {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No study materials available yet for this subject.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
