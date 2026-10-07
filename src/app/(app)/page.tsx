"use client";

import Link from "next/link";
import { Award, BookOpenCheck, CircleCheck, Clock, Flame, Gauge, Target, Trophy, Zap } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { greeting } from "@/lib/engine/dates";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ActivityHeatmap } from "@/components/shared/heatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContinueLearning, DailyChallengeCard, DailyPlanCard, ProgressOverview, RecentActivity, RecommendedList, WeakAreas, WeeklyActivity } from "@/components/dashboard/sections";
import { formatMinutes } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user)!;
  const activity = useAppStore((s) => s.activity);
  const stats = useStats();
  const first = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{greeting()}, {first} 👋</h1>
          <p className="mt-1.5 text-sm text-muted">
            You are working on <Link href={`/topics/${stats.currentTopic.slug}`} className="font-medium text-foreground hover:text-primary">{stats.currentTopic.name}</Link>.
            {stats.activeToday ? " You have practised today. Nice." : stats.currentStreak > 0 ? ` Solve one problem today to keep your ${stats.currentStreak}-day streak.` : " Solve one problem today to start a streak."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="primary" className="px-2.5 py-1 text-sm">{stats.dsaLevel}</Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm"><Flame className="size-3.5 text-warning" /> {stats.currentStreak} day streak</Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm"><CircleCheck className="size-3.5 text-success" /> {stats.solved} solved</Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm">{stats.overall}% overall</Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm"><Zap className="size-3.5 text-primary" /> Level {stats.level.level}</Badge>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4" aria-label="Statistics">
        <StatCard label="Problems solved" value={stats.solved} hint={`of ${stats.totalProblems}`} icon={CircleCheck} tone="success" />
        <StatCard label="Problems attempted" value={stats.attempted} hint={`${stats.totalSubmissions} submissions`} icon={Target} />
        <StatCard label="Success rate" value={`${stats.successRate}%`} hint="accepted submissions" icon={Gauge} tone="primary" />
        <StatCard label="Current streak" value={`${stats.currentStreak}d`} hint={stats.activeToday ? "active today" : "practise today to extend"} icon={Flame} tone="warning" />
        <StatCard label="Longest streak" value={`${stats.longestStreak}d`} hint="personal best" icon={Trophy} />
        <StatCard label="Topics completed" value={`${stats.topicsCompleted}/${stats.totalTopics}`} hint="Learning Mode finished" icon={BookOpenCheck} />
        <StatCard label="Total study time" value={formatMinutes(stats.studyMinutes)} hint={`${formatMinutes(stats.today.minutes)} today`} icon={Clock} />
        <StatCard label="Interview readiness" value={`${stats.readiness}%`} hint="frequent problems, medium/hard, accuracy" icon={Award} tone="primary" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <ProgressOverview />
        <DailyPlanCard />
      </div>

      <ContinueLearning />

      <div className="grid gap-4 lg:grid-cols-3">
        <WeeklyActivity />
        <DailyChallengeCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><div><CardTitle>Problem-solving heatmap</CardTitle><CardDescription>Daily activity over the last five months</CardDescription></div></CardHeader>
          <CardContent><ActivityHeatmap activity={activity} weeks={22} /></CardContent>
        </Card>
        <WeakAreas />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity />
        <RecommendedList />
      </div>
    </div>
  );
}
