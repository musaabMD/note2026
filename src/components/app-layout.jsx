"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import {
  SidebarInset,
  SidebarProvider,
} from "./ui/sidebar";
import { FilterSidebar, RightSidebarProvider, RightSidebarTrigger } from "./filter-sidebar";
import { 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Bookmark, 
  ClipboardCheck, 
  StickyNote, 
  Library, 
  GraduationCap,
  FolderOpen,
} from "lucide-react";
import { ActiveExamProvider, useActiveExam } from "../contexts/ActiveExamContext";
import { useUser } from "@clerk/nextjs";

function AppLayoutContent({ children }) {
  const { user } = useUser();
  const allExams = useQuery(api.exams.get);
  const { activeExam } = useActiveExam();

  // Fetch subjects for the active exam
  const examSubjects = useQuery(
    api.subjects.getByExam,
    activeExam?.id ? { examId: activeExam.id } : "skip"
  );

  // Filter pinned exams and map them to the format expected by ExamSwitcher
  const pinnedExams = allExams
    ?.filter((exam) => exam.isPinned)
    .map((exam) => ({
      id: exam._id,
      name: exam.name || "Untitled Exam",
      abbreviation: exam.abbreviation,
      logo: BookOpen,
      plan: "Study",
      slug: exam.slug, // Use slug directly from database
    })) || [];

  // Get active exam slug, default to first exam or empty string
  const activeExamSlug = activeExam?.slug || pinnedExams[0]?.slug || "";

  // Map real subjects from database with their slugs
  const subjects = examSubjects?.map((subject) => ({
    title: subject.name,
    slug: subject.slug || subject.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, ""),
  })) || [];

  // Build user display name from Clerk user
  const userName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "User"
    : "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userAvatar = user?.imageUrl || "";

  const sidebarData = {
    user: {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
    },
    exams: pinnedExams.length > 0 ? pinnedExams : [
      {
        id: null,
        name: "DrNote",
        logo: BookOpen,
        plan: "Study",
        slug: "",
      },
    ],
    navMain: [
      {
        title: "Subjects",
        url: "#",
        icon: FolderOpen,
        isActive: true, // Default open to show subjects
        items: subjects,
      },
      {
        title: "Files",
        segment: "files",
        icon: FileText,
        isActive: false,
        items: [],
      },
    ],
    navItems: [
      { title: "Images", segment: "images", icon: ImageIcon },
      { title: "New", segment: "new", icon: FileText },
      { title: "Bookmarked", segment: "bookmarked", icon: Bookmark },
      { title: "Self Assessment", segment: "self-assessment", icon: ClipboardCheck },
      { title: "Notes", segment: "notes", icon: StickyNote },
      { title: "Library", segment: "library", icon: Library },
      { title: "HY", segment: "hy", icon: GraduationCap },
    ],
    credits: 0,
    totalCredits: 50,
    resetDate: "Feb 1, 2026 at 3:00 AM",
    rank: 442,
    totalUsers: 1000,
    streakDays: 4,
    overallScore: 85,
    contribution: 42,
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        user={sidebarData.user}
        exams={sidebarData.exams}
        navMain={sidebarData.navMain}
        navItems={sidebarData.navItems}
        credits={sidebarData.credits}
        totalCredits={sidebarData.totalCredits}
        resetDate={sidebarData.resetDate}
        rank={sidebarData.rank}
        totalUsers={sidebarData.totalUsers}
        streakDays={sidebarData.streakDays}
        overallScore={sidebarData.overallScore}
        contribution={sidebarData.contribution}
      />
      <SidebarInset>
        <RightSidebarProvider defaultOpen={false}>
          <div className="flex-1 min-w-0">
            <AppHeader />
            {children}
          </div>
          <FilterSidebar />
          <RightSidebarTrigger />
        </RightSidebarProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppLayout({ children }) {
  const { user } = useUser();
  const allExams = useQuery(api.exams.get);

  // Map ALL exams for the context (so it can detect any exam from URL)
  const examsForContext = allExams?.map((exam) => ({
    id: exam._id,
    name: exam.name || "Untitled Exam",
    abbreviation: exam.abbreviation,
    logo: BookOpen,
    plan: "Study",
    slug: exam.slug,
    isPinned: exam.isPinned,
  })) || [];

  const exams = examsForContext.length > 0 ? examsForContext : [
    {
      id: null,
      name: "DrNote",
      logo: BookOpen,
      plan: "Study",
      slug: "",
    },
  ];

  return (
    <ActiveExamProvider exams={exams}>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ActiveExamProvider>
  );
}
