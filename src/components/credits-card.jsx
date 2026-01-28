"use client";

import { useState } from "react";
import { Sparkles, Trophy, Flame, Star, Flag, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { UpgradeDialog } from "./upgrade-dialog";

export function CreditsCard({
  credits = 0,
  total = 50,
  resetDate = "Feb 1, 2026 at 3:00 AM",
  rank = 1,
  totalUsers = 1000,
  streakDays = 0,
  overallScore = 0,
  contribution = 0,
}) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Upgrade Button */}
      <Button
        onClick={() => setUpgradeOpen(true)}
        className="w-full mb-2 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        size="sm"
      >
        <Crown className="w-4 h-4 mr-2" />
        Upgrade
      </Button>

      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
      />

      {/* Credits */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4" />
          <span>Credits</span>
        </div>
        <span className="font-medium">{credits.toLocaleString()}</span>
      </div>

      {/* Rank */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors">
        <div className="flex items-center gap-3">
          <Trophy className="w-4 h-4" />
          <span>Rank</span>
        </div>
        <span className="font-medium">{rank}</span>
      </div>

      {/* Streak Days */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors">
        <div className="flex items-center gap-3">
          <Flame className="w-4 h-4" />
          <span>Streak</span>
        </div>
        <span className="font-medium">{streakDays} days</span>
      </div>

      {/* Overall Score */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors">
        <div className="flex items-center gap-3">
          <Star className="w-4 h-4" />
          <span>Score</span>
        </div>
        <span className="font-medium">{overallScore}%</span>
      </div>

      {/* Contribution */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors">
        <div className="flex items-center gap-3">
          <Flag className="w-4 h-4" />
          <span>Contribution</span>
        </div>
        <span className="font-medium">{contribution}</span>
      </div>
    </div>
  );
}
