"use client"

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"

export function NavMain({
  items,
  examSlug = "",
}) {
  // Generate URL for subject items
  const getSubjectUrl = (subItem) => {
    if (subItem.url && subItem.url !== "#") {
      return subItem.url;
    }
    if (examSlug && subItem.slug) {
      return `/exams/${examSlug}/subjects/${subItem.slug}`;
    }
    return "#";
  };

  // Generate URL for main items (like Files, Subjects header)
  const getMainItemUrl = (item) => {
    if (item.url && item.url !== "#") {
      return item.url;
    }
    if (examSlug && item.segment) {
      return `/exams/${examSlug}/${item.segment}`;
    }
    return "#";
  };

  return (
    <SidebarGroup className="mb-0 pb-0 px-0">
      <SidebarMenu>
        {items.map((item) => {
          // If item has no sub-items, render as a simple link
          if (!item.items || item.items.length === 0) {
            const url = getMainItemUrl(item);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} className="px-3 py-2 gap-3">
                  <Link href={url}>
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Otherwise, render as collapsible
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="px-3 py-2 gap-3">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subUrl = getSubjectUrl(subItem);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subUrl}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
