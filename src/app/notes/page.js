"use client";

import { useState } from "react";
import { AppLayout } from "../../components/app-layout";
import { PageHeader } from "../../components/page-header";
import {
  StickyNote,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
} from "lucide-react";

const subjects = [
  { name: "All", icon: StickyNote },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          <PageHeader
            title="Notes"
            description="Your study notes and annotations"
            searchPlaceholder="Search notes, subjects, and more..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Notes page coming soon...</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
