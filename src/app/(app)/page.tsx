"use client";

import Link from "next/link";
import { Award, BookOpenCheck, CircleCheck, Clock, Flame, Gauge, Target, Trophy, Zap } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { greeting } from "@/lib/engine/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { ActivityHeatmap } from "@/components/shared/heatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContinueLearning, DailyChallengeCard, DailyPlanCard, ProgressOverview, RecentActivity, RecommendedList, WeakAreas, WeeklyActivity } from "@/components/dashboard/sections";
import { formatMinutes } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const activity = useAppStore((s) => s.activity);
  const stats = useStats();

  // The dashboard is public, so a visitor without an account sees what the app
  // offers instead of a wall of zeroed personal statistics.
  if (!user) return <SignedOutDashboard />;

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

const TOUR: { href: string; title: string; description: string }[] = [
  { href: "/roadmap", title: "Roadmap", description: "44 topics across five levels, with prerequisites and estimated time." },
  { href: "/problems", title: "264 problems", description: "Filter by topic, difficulty, company or pattern. Statements are open to read." },
  { href: "/patterns", title: "17 interview patterns", description: "When each applies, how to recognise it, and a template to start from." },
  { href: "/topics", title: "Lessons", description: "Explanations, worked examples, complexity and common mistakes." },
  { href: "/courses", title: "Courses", description: "Guided tracks that sequence the roadmap for you." },
];

/** What a logged-out visitor sees at `/`: the offer, not an empty profile. */
function SignedOutDashboard() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">From your first loop to your final interview round</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          A five-level roadmap, 264 practice problems with an in-browser judge, spaced-repetition revision and interview preparation.
          Browse everything below without an account. Log in when you want to run code and track progress.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href="/signup"><Button>Create an account</Button></Link>
          <Link href="/login"><Button variant="outline">Log in</Button></Link>
          <span className="text-xs text-muted">Or try the demo account from the login page.</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4" aria-label="What is inside">
        <StatCard label="Practice problems" value={264} hint="with hints and solutions" icon={Target} tone="primary" />
        <StatCard label="Topics" value={44} hint="across five levels" icon={BookOpenCheck} />
        <StatCard label="Interview patterns" value={17} hint="with templates" icon={Zap} tone="warning" />
        <StatCard label="Companies" value={8} hint="topic mix and process" icon={Award} tone="success" />
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Explore">
        {TOUR.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-[var(--radius-card)] focus-visible:outline-2 focus-visible:outline-primary">
            <Card className="h-full transition-colors hover:border-border-strong">
              <CardHeader><div><CardTitle>{card.title}</CardTitle><CardDescription>{card.description}</CardDescription></div></CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>What needs an account</CardTitle>
            <CardDescription>
              Running and submitting code, bookmarks, revision, recommendations, achievements, analytics, and the interview and company
              preparation sections are all behind login. Everything above is open.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
