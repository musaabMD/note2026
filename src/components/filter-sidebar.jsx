"use client"

import * as React from "react"
import { Filter } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
  useSidebar,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import { cn } from "../lib/utils"

// Right Sidebar Trigger Button - Flutter-style FAB
export function RightSidebarTrigger({
  className,
  ...props
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="right-trigger"
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "h-14 w-14 rounded-full",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-200",
        "flex items-center justify-center",
        className
      )}
      onClick={(event) => {
        toggleSidebar()
      }}
      {...props}>
      <Filter className="w-6 h-6" />
      <span className="sr-only">Toggle Filter Sidebar</span>
    </Button>
  )
}

// Filter Sidebar Component
export function FilterSidebar({
  ...props
}) {
  return (
    <Sidebar side="right" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Filters</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sidebar-foreground">Search</label>
            <Input placeholder="Search..." className="w-full bg-background" />
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-sidebar-foreground">All Questions</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-sidebar-foreground/70 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>All Questions</span>
              </label>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-sidebar-foreground">Subject</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-sidebar-foreground/70 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Cardiology</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-sidebar-foreground/70 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Neurology</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-sidebar-foreground/70 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Internal Medicine</span>
              </label>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-sidebar-foreground">Status</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-sidebar-foreground/70 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-sidebar-foreground/70 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Archived</span>
              </label>
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export { SidebarProvider as RightSidebarProvider }
