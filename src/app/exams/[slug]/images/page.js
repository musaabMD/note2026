"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AppLayout } from "../../../../components/app-layout";
import { PageHeader } from "../../../../components/page-header";
import { Image as ImageIcon, Heart, Brain, Stethoscope, Activity, Microscope } from "lucide-react";

const subjects = [
  { name: "All", icon: ImageIcon },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample images data
const sampleImages = [
  { id: "1", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop", subject: "Cardiology", title: "ECG Patterns" },
  { id: "2", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop", subject: "Neurology", title: "Brain MRI" },
  { id: "3", image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop", subject: "Internal Medicine", title: "Chest X-Ray" },
  { id: "4", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop", subject: "Cardiology", title: "Heart Anatomy" },
  { id: "5", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop", subject: "Emergency Medicine", title: "Trauma Assessment" },
  { id: "6", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop", subject: "Pathology", title: "Histology Slides" },
];

export default function ExamImagesPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  const filteredImages = sampleImages.filter((item) => {
    const matchesSearch = searchQuery === "" ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          <PageHeader
            title="Images"
            description={`Medical images for ${examName}`}
            searchPlaceholder="Search images..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No images found.</p>
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {Object.entries(
                filteredImages.reduce((acc, item) => {
                  const subject = item.subject || "Other";
                  if (!acc[subject]) acc[subject] = [];
                  acc[subject].push(item);
                  return acc;
                }, {})
              ).map(([subject, items]) => (
                <div key={subject} className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground px-2">
                    {subject} ({items.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative w-full overflow-hidden bg-secondary rounded-lg border border-border group cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.title || `Image ${item.id}`}
                          className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                          style={{ display: "block", maxHeight: "300px" }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-sm font-medium">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
