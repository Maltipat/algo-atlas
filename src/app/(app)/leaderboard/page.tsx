"use client";

import { useState } from "react";
import { Crown, Flame } from "lucide-react";
import { leaderboardPeers } from "@/data/leaderboard";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/shared/avatar";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const [range, setRange] = useState<"all" | "week">("all");
  const user = useAppStore((s) => s.user)!;
  const xp = useAppStore((s) => s.xp);
  const activity = useAppStore((s) => s.activity);
  const stats = useStats();
  const weeklyXp = stats.week.keys.reduce((s, k) => s + (activity[k]?.xp ?? 0), 0);
  const me = { id: "me", name: user.name, username: user.username, country: "IN", xp, weeklyXp, solved: stats.solved, streak: stats.currentStreak, avatarHue: user.avatarHue };
  const rows = [...leaderboardPeers, me].sort((a, b) => (range === "all" ? b.xp - a.xp : b.weeklyXp - a.weeklyXp));
  const myRank = rows.findIndex((r) => r.id === "me") + 1;

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description={`You are ranked #${myRank} of ${rows.length} learners ${range === "all" ? "by total XP" : "by XP earned this week"}.`}
        actions={
          <div className="flex rounded-[var(--radius-control)] bg-surface-2 p-0.5" role="tablist">
            {(["all", "week"] as const).map((r) => <button key={r} role="tab" aria-selected={range === r} onClick={() => setRange(r)} className={cn("rounded-md px-3 py-1.5 text-sm", range === r ? "bg-surface font-medium shadow-sm" : "text-muted")}>{r === "all" ? "All time" : "This week"}</button>)}
          </div>
        }
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted"><th className="w-16 py-2.5 pl-5 font-medium">Rank</th><th className="py-2.5 font-medium">Learner</th><th className="py-2.5 pr-4 text-right font-medium">{range === "all" ? "XP" : "XP this week"}</th><th className="py-2.5 pr-4 text-right font-medium">Solved</th><th className="py-2.5 pr-5 text-right font-medium">Streak</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={cn("border-b border-border/70 last:border-0", r.id === "me" && "bg-primary-soft/60")}>
                  <td className="py-2.5 pl-5 tabular-nums">{i < 3 ? <span className="inline-flex items-center gap-1 font-semibold"><Crown className={cn("size-4", i === 0 ? "text-warning" : "text-muted")} />{i + 1}</span> : i + 1}</td>
                  <td className="py-2.5"><div className="flex items-center gap-3"><Avatar name={r.name} hue={r.avatarHue} size={28} /><div><p className="font-medium">{r.name}{r.id === "me" && <span className="ml-1.5 text-xs text-primary">(you)</span>}</p><p className="text-xs text-muted">@{r.username}</p></div></div></td>
                  <td className="py-2.5 pr-4 text-right font-medium tabular-nums">{(range === "all" ? r.xp : r.weeklyXp).toLocaleString("en-IN")}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-muted">{r.solved}</td>
                  <td className="py-2.5 pr-5 text-right tabular-nums text-muted"><span className="inline-flex items-center gap-1"><Flame className="size-3.5 text-warning" />{r.streak}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
