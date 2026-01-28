"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AppLayout } from "../../../../components/app-layout";
import { PageHeader } from "../../../../components/page-header";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  FileText,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Download,
  Eye,
  FileIcon,
  FilePdf,
  FileSpreadsheet,
  FileImage,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: FileText },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample files data for demo
const sampleFiles = [
  {
    _id: "f1",
    name: "SMLE Cardiology Review 2024.pdf",
    description: "Comprehensive cardiology review for SMLE exam",
    fileType: "pdf",
    fileSize: 2456000,
    isNew: true,
    isPremium: false,
    uploadedAt: Date.now() - 86400000,
    tags: ["cardiology", "review", "2024"],
  },
  {
    _id: "f2",
    name: "ECG Interpretation Guide.pdf",
    description: "Step-by-step ECG interpretation with examples",
    fileType: "pdf",
    fileSize: 1890000,
    isNew: true,
    isPremium: true,
    uploadedAt: Date.now() - 172800000,
    tags: ["ecg", "cardiology"],
  },
  {
    _id: "f3",
    name: "Pharmacology Quick Reference.xlsx",
    description: "Drug dosages and interactions spreadsheet",
    fileType: "xlsx",
    fileSize: 456000,
    isNew: false,
    isPremium: false,
    uploadedAt: Date.now() - 604800000,
    tags: ["pharmacology", "reference"],
  },
  {
    _id: "f4",
    name: "Internal Medicine Summary Notes.pdf",
    description: "High-yield internal medicine notes",
    fileType: "pdf",
    fileSize: 3200000,
    isNew: false,
    isPremium: true,
    uploadedAt: Date.now() - 1209600000,
    tags: ["internal medicine", "notes"],
  },
  {
    _id: "f5",
    name: "Anatomy Diagrams Collection.pdf",
    description: "Detailed anatomy diagrams for quick review",
    fileType: "pdf",
    fileSize: 8500000,
    isNew: false,
    isPremium: false,
    uploadedAt: Date.now() - 2592000000,
    tags: ["anatomy", "diagrams"],
  },
];

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function getFileIcon(fileType) {
  switch (fileType) {
    case "pdf":
      return FilePdf;
    case "xlsx":
    case "xls":
      return FileSpreadsheet;
    case "png":
    case "jpg":
    case "jpeg":
      return FileImage;
    default:
      return FileIcon;
  }
}

function FileCard({ file }) {
  const FileTypeIcon = getFileIcon(file.fileType);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-4">
          {/* File Icon */}
          <div className={cn(
            "flex items-center justify-center h-12 w-12 rounded-lg shrink-0",
            file.fileType === "pdf" && "bg-red-100",
            file.fileType === "xlsx" && "bg-green-100",
            !["pdf", "xlsx"].includes(file.fileType) && "bg-blue-100"
          )}>
            <FileTypeIcon className={cn(
              "h-6 w-6",
              file.fileType === "pdf" && "text-red-600",
              file.fileType === "xlsx" && "text-green-600",
              !["pdf", "xlsx"].includes(file.fileType) && "text-blue-600"
            )} />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground truncate">
                    {file.name}
                  </h3>
                  {file.isNew && (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                      <Sparkles className="h-3 w-3" />
                      New
                    </span>
                  )}
                  {file.isPremium && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 shrink-0">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                  {file.description}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {formatFileSize(file.fileSize)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(file.uploadedAt)}
              </span>
            </div>

            {/* Tags */}
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {file.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/50 bg-muted/30">
          <Button variant="outline" size="sm" className="h-8">
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Preview
          </Button>
          <Button size="sm" className="h-8">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamFilesPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(
    api.exams.getBySlug,
    slug ? { slug } : "skip"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  // Filter files based on search
  const filteredFiles = sampleFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Separate new and other files
  const newFiles = filteredFiles.filter(f => f.isNew);
  const otherFiles = filteredFiles.filter(f => !f.isNew);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <PageHeader
            title="Files"
            description={`Study materials for ${examName}`}
            searchPlaceholder="Search files..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {/* New Files Section */}
          {newFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-foreground">New Files</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {newFiles.length}
                </span>
              </div>
              <div className="space-y-3">
                {newFiles.map((file) => (
                  <FileCard key={file._id} file={file} />
                ))}
              </div>
            </div>
          )}

          {/* All Files Section */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {newFiles.length > 0 ? "All Files" : "Files"}
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {otherFiles.length}
              </span>
            </div>
            {otherFiles.length > 0 ? (
              <div className="space-y-3">
                {otherFiles.map((file) => (
                  <FileCard key={file._id} file={file} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No files found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
