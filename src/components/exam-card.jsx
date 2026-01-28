"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Pin, PinOff } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";

export function ExamCard({ exam, href, onPinToggle, className }) {
  const handlePinClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPinToggle?.(e, exam._id);
  };

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
          "cursor-pointer py-0",
          className
        )}
      >
        <CardContent className="p-0">
          {/* Pin Button - Top Right */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 z-10 h-8 w-8 rounded-full",
              "opacity-0 group-hover:opacity-100 transition-all duration-200",
              "hover:bg-primary/10",
              exam.isPinned && "opacity-100"
            )}
            onClick={handlePinClick}
          >
            {exam.isPinned ? (
              <Pin className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <PinOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          <div className="p-4">
            {/* Title - Show abbreviation if available, otherwise show name */}
            <h3 className="text-base font-semibold text-foreground mb-1 pr-8 line-clamp-2">
              {exam.abbreviation || exam.name}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ExamCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="h-5 w-3/4 rounded bg-muted animate-pulse mb-2" />
        </div>
      </CardContent>
    </Card>
  );
}
