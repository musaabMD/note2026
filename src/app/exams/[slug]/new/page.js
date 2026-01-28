"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AppLayout } from "../../../../components/app-layout";
import { PageHeader } from "../../../../components/page-header";
import { Card, CardContent } from "../../../../components/ui/card";
import { FileText, Heart, Brain, Stethoscope, Activity, Microscope, Sparkles, Clock, FileIcon, HelpCircle } from "lucide-react";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: FileText },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample new content
const newContent = [
  { id: "1", type: "question", title: "New Cardiology MCQs", count: 15, subject: "Cardiology", addedAt: Date.now() - 3600000 },
  { id: "2", type: "file", title: "Updated ECG Guide 2024", subject: "Cardiology", addedAt: Date.now() - 7200000 },
  { id: "3", type: "question", title: "Neurology Case Studies", count: 8, subject: "Neurology", addedAt: Date.now() - 86400000 },
  { id: "4", type: "file", title: "Pharmacology Quick Reference", subject: "Internal Medicine", addedAt: Date.now() - 172800000 },
  { id: "5", type: "question", title: "Emergency Medicine Scenarios", count: 12, subject: "Emergency Medicine", addedAt: Date.now() - 259200000 },
];

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function ExamNewPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  const filteredContent = newContent.filter((item) => {
    const matchesSearch = searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <PageHeader
            title="New"
            description={`Recently added content for ${examName}`}
            searchPlaceholder="Search new content..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          <div className="space-y-3 mt-6">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No new content found</p>
              </div>
            ) : (
              filteredContent.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-lg shrink-0",
                        item.type === "question" ? "bg-blue-100" : "bg-orange-100"
                      )}>
                        {item.type === "question" ? (
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                        ) : (
                          <FileIcon className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            <Sparkles className="h-3 w-3" />
                            New
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{item.subject}</span>
                          {item.count && <span>• {item.count} questions</span>}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(item.addedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
