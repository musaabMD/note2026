"use client";

import { Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-xl font-bold text-foreground tracking-tight drop-shadow-sm">
              DrNote
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="bg-secondary hover:bg-accent text-foreground border-0 rounded-full px-4 py-2 font-medium transition-colors shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-foreground hover:bg-accent hover:text-foreground drop-shadow-sm">
            <Link href="/">
              <Home className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
