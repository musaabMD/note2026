"use client"

import * as React from "react"
import Link from "next/link"
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
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavFooter } from "./nav-footer"
import { ExamSwitcher } from "./exam-switcher"
import { CreditsCard } from "./credits-card"
import { useActiveExam } from "../contexts/ActiveExamContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"

// Default data
const defaultData = {
  user: {
    name: "DrNote User",
    email: "user@drnote.com",
    avatar: "",
  },
  exams: [
    {
      name: "DrNote",
      logo: BookOpen,
      plan: "Study",
    },
  ],
  navMain: [
    {
      title: "Subjects",
      url: "#",
      icon: FolderOpen,
      isActive: false,
      items: [
        {
          title: "Cardiology",
          url: "#",
        },
        {
          title: "Neurology",
          url: "#",
        },
        {
          title: "Internal Medicine",
          url: "#",
        },
      ],
    },
    {
      title: "Files",
      url: "#", // URL is dynamically set based on active exam
      icon: FileText,
      isActive: false,
      items: [],
    },
  ],
  navItems: [
    {
      title: "Images",
      segment: "images",
      icon: ImageIcon,
    },
    {
      title: "New",
      segment: "new",
      icon: FileText,
    },
    {
      title: "Bookmarked",
      segment: "bookmarked",
      icon: Bookmark,
    },
    {
      title: "Self Assessment",
      segment: "self-assessment",
      icon: ClipboardCheck,
    },
    {
      title: "Notes",
      segment: "notes",
      icon: StickyNote,
    },
    {
      title: "Library",
      segment: "library",
      icon: Library,
    },
    {
      title: "HY",
      segment: "hy",
      icon: GraduationCap,
    },
  ],
}

export function AppSidebar({
  user = defaultData.user,
  exams = defaultData.exams,
  navMain = defaultData.navMain,
  navItems = defaultData.navItems,
  credits = 0,
  totalCredits = 50,
  resetDate = "Feb 1, 2026 at 3:00 AM",
  rank = 1,
  totalUsers = 1000,
  streakDays = 0,
  overallScore = 0,
  contribution = 0,
  ...props
}) {
  const { activeExam } = useActiveExam();

  // Generate dynamic URL based on active exam
  const getExamUrl = (segment) => {
    if (activeExam?.slug) {
      return `/exams/${activeExam.slug}/${segment}`;
    }
    return `#`; // Fallback if no exam selected
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ExamSwitcher exams={exams} />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2">
          <NavMain items={navMain} examSlug={activeExam?.slug} />
          {navItems.map((item) => {
            const Icon = item.icon;
            const url = getExamUrl(item.segment);
            return (
              <Link
                key={item.title}
                href={url}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2">
          <CreditsCard
            credits={credits}
            total={totalCredits}
            resetDate={resetDate}
            rank={rank}
            totalUsers={totalUsers}
            streakDays={streakDays}
            overallScore={overallScore}
            contribution={contribution}
          />
        </div>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
