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
  Library,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Video,
  FileText,
  BookOpen,
  ExternalLink,
  Clock,
  Star,
  Play,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: Library },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

const resourceTypes = [
  { name: "All Types", value: "all" },
  { name: "Videos", value: "video", icon: Video },
  { name: "Articles", value: "article", icon: FileText },
  { name: "Books", value: "book", icon: BookOpen },
];

// Sample library resources
const resources = [
  {
    id: "1",
    title: "Complete ECG Interpretation Course",
    description: "Master ECG reading from basics to advanced patterns",
    type: "video",
    subject: "Cardiology",
    duration: 120,
    rating: 4.8,
    isPremium: false,
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
  },
  {
    id: "2",
    title: "Harrison's Principles of Internal Medicine",
    description: "The gold standard reference for internal medicine",
    type: "book",
    subject: "Internal Medicine",
    rating: 4.9,
    isPremium: true,
  },
  {
    id: "3",
    title: "Neuroanatomy Through Clinical Cases",
    description: "Learn neuroanatomy through real patient cases",
    type: "article",
    subject: "Neurology",
    rating: 4.6,
    isPremium: false,
  },
  {
    id: "4",
    title: "Emergency Medicine Procedures",
    description: "Step-by-step guide to common ED procedures",
    type: "video",
    subject: "Emergency Medicine",
    duration: 90,
    rating: 4.7,
    isPremium: true,
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
  },
  {
    id: "5",
    title: "Pathology Illustrated",
    description: "Visual guide to pathological specimens",
    type: "book",
    subject: "Pathology",
    rating: 4.5,
    isPremium: false,
  },
];

function getResourceIcon(type) {
  switch (type) {
    case "video": return Video;
    case "article": return FileText;
    case "book": return BookOpen;
    default: return Library;
  }
}

function ResourceCard({ resource }) {
  const Icon = getResourceIcon(resource.type);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {resource.thumbnail && (
          <div className="relative h-32 bg-muted">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
            {resource.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/90">
                  <Play className="h-5 w-5 text-foreground ml-0.5" />
                </div>
              </div>
            )}
            {resource.isPremium && (
              <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-yellow-500 text-white font-medium">
                Premium
              </span>
            )}
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            {!resource.thumbnail && (
              <div className={cn(
                "flex items-center justify-center h-10 w-10 rounded-lg shrink-0",
                resource.type === "video" && "bg-red-100",
                resource.type === "article" && "bg-blue-100",
                resource.type === "book" && "bg-green-100"
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  resource.type === "video" && "text-red-600",
                  resource.type === "article" && "text-blue-600",
                  resource.type === "book" && "text-green-600"
                )} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground line-clamp-1">{resource.title}</h3>
                {resource.isPremium && !resource.thumbnail && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 shrink-0">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-muted">{resource.subject}</span>
              {resource.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {resource.duration} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {resource.rating}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-7">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamLibraryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedType, setSelectedType] = useState("all");

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  const filteredResources = resources.filter((r) => {
    const matchesSearch = searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || r.subject === selectedSubject;
    const matchesType = selectedType === "all" || r.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          <PageHeader
            title="Library"
            description={`Study resources for ${examName}`}
            searchPlaceholder="Search library..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {/* Type Filter */}
          <div className="flex gap-2 mt-4 mb-6 overflow-x-auto pb-2">
            {resourceTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className="shrink-0"
              >
                {type.icon && <type.icon className="h-3.5 w-3.5 mr-1.5" />}
                {type.name}
              </Button>
            ))}
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Library className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
