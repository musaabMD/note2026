"use client";

import * as React from "react"
import { ChevronsUpDown, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"
import { useActiveExam } from "../contexts/ActiveExamContext"

const ACTIVE_EXAM_STORAGE_KEY = "drnote-active-exam"

export function ExamSwitcher({
  exams = []
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { activeExam, updateActiveExam } = useActiveExam()

  // Handle keyboard shortcuts (⌘1, ⌘2, etc.)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for ⌘ (Mac) or Ctrl (Windows/Linux) + number
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1
        if (exams[index]) {
          e.preventDefault()
          const exam = exams[index]
          updateActiveExam(exam)
          
          // Navigate to the exam's page if it has a slug
          if (exam.slug) {
            router.push(`/exams/${exam.slug}`)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [exams, router, updateActiveExam])

  const handleExamSwitch = (exam) => {
    updateActiveExam(exam)
    
    // Navigate to the exam's page if it has a slug
    if (exam.slug) {
      router.push(`/exams/${exam.slug}`)
    }
  }

  if (!activeExam || exams.length === 0) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeExam.logo ? <activeExam.logo className="size-4" /> : <BookOpen className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeExam.name}</span>
                <span className="truncate text-xs">{activeExam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Exams
            </DropdownMenuLabel>
            {exams.map((exam, index) => (
              <DropdownMenuItem 
                key={exam.id || exam.name} 
                onClick={() => handleExamSwitch(exam)} 
                className="gap-2 p-2"
                data-active={activeExam.id === exam.id || activeExam.slug === exam.slug}>
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {exam.logo ? <exam.logo className="size-3.5 shrink-0" /> : <BookOpen className="size-3.5 shrink-0" />}
                </div>
                {exam.name}
                {exams.length > 1 && (
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
