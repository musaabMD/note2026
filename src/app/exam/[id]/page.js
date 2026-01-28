"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppSidebar } from "../../../components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Separator } from "../../../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import Link from "next/link";
import { use, useState } from "react";
import { BookOpen } from "lucide-react";

export default function ExamDetailPage({ params }) {
  const { id } = use(params);
  const exam = useQuery(api.exams.getById, { id });
  const allExams = useQuery(api.exams.get);

  // Create sidebar data from exams
  const sidebarData = {
    user: {
      name: "DrNote User",
      email: "user@drnote.com",
      avatar: "",
    },
    teams: [
      {
        name: "DrNote",
        logo: BookOpen,
        plan: "Study",
      },
    ],
    navMain: [
      {
        title: "Exams",
        url: "/",
        icon: BookOpen,
        isActive: false,
        items: allExams?.map((examItem) => ({
          title: examItem.name,
          url: `/exam/${examItem._id}`,
        })) || [],
      },
    ],
    projects: [],
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        user={sidebarData.user}
        teams={sidebarData.teams}
        navMain={sidebarData.navMain}
        projects={sidebarData.projects}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/">Exams</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {exam ? exam.name : "Loading..."}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {exam === undefined ? (
            <div className="text-muted-foreground">Loading exam details...</div>
          ) : exam === null ? (
            <div className="text-muted-foreground">Exam not found.</div>
          ) : (
            <div className="bg-background rounded-xl border border-border shadow-sm p-6">
              <h1 className="text-3xl font-bold text-foreground mb-4">{exam.name}</h1>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Exam Information</h2>
                  <p className="text-muted-foreground">
                    This is the detail page for {exam.name}. You can add more content here such as:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Study materials</li>
                    <li>Practice questions</li>
                    <li>Notes and highlights</li>
                    <li>Progress tracking</li>
                  </ul>
                </div>
                {exam.isPinned && (
                  <div className="inline-block text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
                    Pinned Exam
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
