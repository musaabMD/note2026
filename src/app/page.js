"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { ExamCard, ExamCardSkeleton } from "../components/exam-card";

export default function Home() {
  const exams = useQuery(api.exams.get);
  const togglePin = useMutation(api.exams.togglePin);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExams =
    exams?.filter((exam) =>
      exam.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Separate pinned and unpinned exams
  const pinnedExams = filteredExams.filter((exam) => exam.isPinned);
  const unpinnedExams = filteredExams.filter((exam) => !exam.isPinned);

  const handlePinToggle = async (e, examId) => {
    e.preventDefault();
    e.stopPropagation();
    await togglePin({ id: examId });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Your exam companion</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Master your{" "}
                <span className="text-primary">medical exams</span>
              </h1>

              {/* Search Bar */}
              <div className="mt-8 sm:mt-10">
                <div className="relative mx-auto max-w-xl">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-11 pr-4 text-base rounded-xl border-border/60 bg-background shadow-sm focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exams Section */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            {/* Pinned Exams */}
            {pinnedExams.length > 0 && (
              <div className="mb-10">
                <div className="mb-5 flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Pinned
                  </h2>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {pinnedExams.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pinnedExams.map((exam) => (
                    <ExamCard
                      key={exam._id}
                      exam={exam}
                      href={`/exams/${exam.slug}`}
                      onPinToggle={handlePinToggle}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Exams */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {pinnedExams.length > 0 ? "All Exams" : "Exams"}
                  </h2>
                  {exams && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {unpinnedExams.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {exams === undefined && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <ExamCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {exams !== undefined && filteredExams.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No exams found matching your search."
                      : "No exams available."}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}

              {/* Exams Grid */}
              {exams !== undefined && unpinnedExams.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {unpinnedExams.map((exam) => (
                    <ExamCard
                      key={exam._id}
                      exam={exam}
                      href={`/exams/${exam.slug}`}
                      onPinToggle={handlePinToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
