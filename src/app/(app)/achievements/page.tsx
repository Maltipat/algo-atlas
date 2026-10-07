"use client";

import { Flame, Lock, Star, Target, Zap } from "lucide-react";
import { achievements } from "@/data/achievements";
import { achievementProgress } from "@/lib/engine/achievements";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Milestone", "Streak", "Mastery", "Skill", "Habit"] as const;

export default function AchievementsPage() {
  const state = useAppStore();
  const stats = useStats();
  const prog = achievementProgress(state);
  const unlockedCount = Object.keys(state.achievements).length;
  const goals = [
    { label: "Daily goal", detail: `Solve ${state.settings.dailyGoal} problems today`, value: stats.today.solved, target: state.settings.dailyGoal, icon: Target },
    { label: "Weekly goal", detail: `Solve ${state.settings.weeklyGoal} problems this week`, value: stats.week.solved, target: state.settings.weeklyGoal, icon: Star },
    { label: "Weekly consistency", detail: "Practise on 5 days this week", value: stats.week.activeDays, target: 5, icon: Flame },
    { label: "Weekly revision", detail: "Complete 10 revision reviews", value: stats.week.reviews, target: 10, icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Achievements" description={`${unlockedCount} of ${achievements.length} badges earned. XP comes from solving problems, lessons, reviews and badges.`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-5 pt-5">
            <ProgressRing value={stats.level.percent} size={92} stroke={8}><div className="text-center"><div className="text-xs text-muted">Level</div><div className="text-2xl font-semibold tabular-nums">{stats.level.level}</div></div></ProgressRing>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{state.xp.toLocaleString("en-IN")} XP</p>
              <p className="text-sm text-muted">{stats.level.needed - stats.level.intoLevel} XP to level {stats.level.level + 1}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm"><Flame className="size-4 text-warning" /> {stats.currentStreak}-day streak, best {stats.longestStreak}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><div><CardTitle>Goals</CardTitle><CardDescription>Change your daily and weekly targets in Settings</CardDescription></div></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {goals.map((g) => (
              <div key={g.label}>
                <div className="mb-1 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium"><g.icon className="size-4 text-primary" />{g.label}</span><span className="tabular-nums text-muted">{Math.min(g.value, g.target)}/{g.target}</span></div>
                <Progress value={(g.value / g.target) * 100} barClassName={g.value >= g.target ? "bg-success" : undefined} label={g.label} />
                <p className="mt-1 text-xs text-muted">{g.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {CATEGORIES.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 font-semibold">{cat}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {achievements.filter((a) => a.category === cat).map((a) => {
              const at = state.achievements[a.id];
              const p = prog[a.id]!;
              return (
                <div key={a.id} className={cn("flex flex-col items-center rounded-[var(--radius-panel)] border p-4 text-center", at ? "border-border bg-surface" : "border-dashed border-border-strong bg-transparent")}>
                  <div className={cn("relative grid size-14 place-items-center rounded-full text-3xl", at ? "bg-primary-soft" : "bg-surface-2 grayscale")} aria-hidden>
                    <span className={cn(!at && "opacity-40")}>{a.emoji}</span>
                    {!at && <Lock className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-surface p-0.5 text-muted" />}
                  </div>
                  <p className="mt-2 text-sm font-medium">{a.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{a.description}</p>
                  {at ? (
                    <Badge variant="success" className="mt-2">Earned {new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</Badge>
                  ) : (
                    <div className="mt-2 w-full"><Progress value={(p.current / p.target) * 100} label={`${a.name} progress`} /><p className="mt-1 text-[11px] tabular-nums text-muted">{Math.min(p.current, p.target)}/{p.target}, +{a.xp} XP</p></div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
