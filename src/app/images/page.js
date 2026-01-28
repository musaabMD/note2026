"use client";

import { useState } from "react";
import { AppLayout } from "../../components/app-layout";
import { PageHeader } from "../../components/page-header";
import { Image as ImageIcon, Heart, Brain, Stethoscope, Activity, Microscope } from "lucide-react";

// Mock data - replace with Convex query later
const mockQuestions = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    subject: "Cardiology",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    subject: "Neurology",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    subject: "Internal Medicine",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    subject: "Cardiology",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    subject: "Emergency Medicine",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    subject: "Pathology",
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    subject: "Internal Medicine",
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    subject: "Neurology",
  },
  {
    id: "9",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    subject: "Cardiology",
  },
];

const subjects = [
  { name: "All", icon: ImageIcon },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

export default function ImagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const filteredImages = mockQuestions.filter((item) => {
    const matchesSearch = searchQuery === "" || item.id.includes(searchQuery);
    const matchesSubject = selectedSubject === "All" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          <PageHeader
            title="Images"
            description="All the medical images you need for your studies"
            searchPlaceholder="Search images, subjects, and more..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {/* Grouped Images - Attachment Style */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No images found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group images by subject */}
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
                        className="relative w-full overflow-hidden bg-secondary rounded-lg border border-border"
                      >
                        <img
                          src={item.image}
                          alt={`Image ${item.id}`}
                          className="w-full h-auto object-contain"
                          style={{ display: "block", maxHeight: "500px" }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/800x600?text=Image";
                          }}
                        />
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
