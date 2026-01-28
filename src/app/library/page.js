"use client";

import { AppLayout } from "../../components/app-layout";
import { PageHeader } from "../../components/page-header";

export default function LibraryPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          <PageHeader
            title="Library"
            description="Browse your medical library and resources"
            searchPlaceholder="Search library, subjects, and more..."
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Library page coming soon...</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
