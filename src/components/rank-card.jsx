"use client";

import { Trophy } from "lucide-react";

export function RankCard({ rank = 1, totalUsers = 1000 }) {
  const percentile = (((totalUsers - rank) / totalUsers) * 100).toFixed(1);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <div className="bg-secondary rounded-full p-2">
          <Trophy className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Your Rank</p>
          <p className="text-2xl font-bold text-foreground">#{rank}</p>
          <p className="text-xs text-muted-foreground">Top {percentile}%</p>
        </div>
      </div>
    </div>
  );
}
