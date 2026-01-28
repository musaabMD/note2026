"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppLayout } from "../../../components/app-layout";
import { PageHeader } from "../../../components/page-header";
import { use, useEffect, useState } from "react";
import {
  FolderOpen,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";

const filterButtons = [
  { name: "All", icon: FolderOpen },
];

export default function ExamDetailPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(
    api.exams.getBySlug,
    slug ? { slug } : "skip"
  );

  // Fetch real subjects from database
  const subjects = useQuery(
    api.subjects.getByExam,
    exam?._id ? { examId: exam._id } : "skip"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Update page title for SEO
  useEffect(() => {
    if (exam?.name) {
      document.title = `${exam.name} - Subjects - DrNote`;
    }
  }, [exam]);

  const examName = exam?.name || slug || "Exam";
  const examAbbreviation = exam?.abbreviation || "";
  const safeSlug = slug || "";
  const isLoading = exam === undefined || subjects === undefined;

  // Filter subjects by search query
  const filteredSubjects = subjects?.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          <PageHeader
            title={examAbbreviation ? `${examAbbreviation} Subjects` : "Subjects"}
            description={exam?.description || `Study materials for ${examName}`}
            searchPlaceholder="Search subjects..."
            searchValue={searchQuery}
            filterButtons={filterButtons}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedFilter}
            selectedFilter={selectedFilter}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : !exam ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-muted-foreground">
                Exam not found
              </h2>
              <p className="text-muted-foreground mt-2">
                The exam &quot;{slug}&quot; does not exist.
              </p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground">
                No subjects found
              </h2>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? `No subjects matching "${searchQuery}"`
                  : "No subjects have been added to this exam yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filteredSubjects.map((subject) => (
                <Link
                  key={subject._id}
                  href={`/exams/${safeSlug}/subjects/${subject.slug || subject.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block p-4 rounded-lg border border-border hover:border-foreground/30 hover:shadow-md transition-all bg-card group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: subject.color ? `${subject.color}20` : "var(--muted)" }}
                    >
                      <FolderOpen
                        className="w-5 h-5"
                        style={{ color: subject.color || "var(--foreground)" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {subject.name}
                      </h3>
                      {subject.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {subject.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {subject.totalQuestions > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {subject.totalQuestions} questions
                          </Badge>
                        )}
                        {subject.totalFiles > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {subject.totalFiles} files
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
