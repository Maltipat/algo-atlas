"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight, Award, BookOpen, CalendarCheck, Check, CircleCheck, CircleDot, Clock, Lightbulb, Play, Sparkles, Target, TrendingDown,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useDailyChallenge, useStats, useToday } from "@/hooks/use-app";
import { problemsById } from "@/data/problems";
import { topics, topicsBySlug } from "@/data/topics";
import { achievementsById } from "@/data/achievements";
import { buildDailyPlan } from "@/lib/engine/daily-plan";
import { recommendedSteps, weakestTopics } from "@/lib/engine/weak";
import { recommendProblems } from "@/lib/engine/recommend";
import { lastNDays } from "@/lib/engine/dates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { DifficultyBadge, DifficultyText } from "@/components/shared/difficulty";
import { TopicIcon } from "@/components/shared/topic-icon";
import { BarSeries } from "@/components/charts/charts";
import { EmptyState } from "@/components/shared/states";
import { MetroStrip } from "@/components/roadmap/metro-strip";
import { cn, formatMinutes, timeAgo } from "@/lib/utils";

export function ProgressOverview() {
  const stats = useStats();
  const levelTopics = [1, 2, 3, 4, 5].map((lvl) => {
    const list = topics.filter((t) => t.level === lvl);
    return { lvl, pct: Math.round(list.reduce((s, t) => s + stats.topicProgress[t.slug]!.percent, 0) / list.length) };
  });
  const LEVEL_NAMES = ["Foundations", "Core DS", "Trees", "Graphs", "Advanced"];
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div><CardTitle>Progress</CardTitle><CardDescription>Across all 44 topics and {stats.totalProblems} problems</CardDescription></div>
        <Link href="/analytics" className="text-sm text-primary hover:underline">Analytics</Link>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[auto_1fr_1fr]">
        <div className="flex flex-col items-center justify-center gap-2">
          <ProgressRing value={stats.overall} size={112} stroke={9}>
            <div className="text-center"><div className="text-2xl font-semibold tabular-nums">{stats.overall}%</div><div className="text-[11px] text-muted">overall</div></div>
          </ProgressRing>
        </div>
        <div className="space-y-3.5">
          {(["Easy", "Medium", "Hard"] as const).map((d) => {
            const b = stats.byDifficulty[d];
            return (
              <div key={d}>
                <div className="mb-1 flex justify-between text-sm"><DifficultyText difficulty={d} /><span className="tabular-nums text-muted">{b.solved} / {b.total}</span></div>
                <Progress value={(b.solved / b.total) * 100} barClassName={d === "Easy" ? "bg-easy" : d === "Medium" ? "bg-medium" : "bg-hard"} label={`${d} progress`} />
              </div>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {levelTopics.map(({ lvl, pct }) => (
            <div key={lvl} className="flex items-center gap-3 text-sm">
              <span className="w-28 truncate text-muted">L{lvl} {LEVEL_NAMES[lvl - 1]}</span>
              <Progress value={pct} className="flex-1" label={`Level ${lvl} progress`} />
              <span className="w-9 text-right tabular-nums text-muted">{pct}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyPlanCard() {
  const state = useAppStore();
  const stats = useStats();
  const today = useToday();
  const { problem } = useDailyChallenge();
  const plan = buildDailyPlan(state, stats, today, problem?.slug);
  return (
    <Card>
      <CardHeader>
        <div><CardTitle>Today&apos;s plan</CardTitle><CardDescription>{plan.percent}% complete</CardDescription></div>
        <ProgressRing value={plan.percent} size={40} stroke={4}><span className="text-[10px] font-semibold tabular-nums">{plan.percent}</span></ProgressRing>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {plan.items.map((item) => {
            const done = item.progress >= item.target;
            return (
              <li key={item.id} className="flex items-center gap-3 rounded-md px-1 py-1.5">
                <button
                  disabled={!item.manual}
                  onClick={() => state.toggleDailyPlanItem(today, item.id)}
                  className={cn("grid size-5 shrink-0 place-items-center rounded-full border", done ? "border-success bg-success text-white" : "border-border-strong", item.manual && "hover:border-primary")}
                  aria-label={item.manual ? `Mark ${item.label} as ${done ? "not done" : "done"}` : `${item.label}: ${done ? "done" : "in progress"}`}
                >
                  {done && <Check className="size-3" />}
                </button>
                <Link href={item.href} className="min-w-0 flex-1 hover:text-primary">
                  <span className={cn("block truncate text-sm", done && "text-muted line-through")}>{item.label}</span>
                </Link>
                <span className="shrink-0 text-xs tabular-nums text-muted">{item.detail}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ContinueLearning() {
  const stats = useStats();
  const cur = stats.currentTopic;
  const lesson = useAppStore((s) => s.lessons[cur.slug]);
  const tp = stats.topicProgress[cur.slug]!;
  return (
    <Card>
      <CardHeader>
        <div><CardTitle>Continue learning</CardTitle><CardDescription>Your position on the roadmap</CardDescription></div>
        <Link href="/roadmap" className="text-sm text-primary hover:underline">Full roadmap</Link>
      </CardHeader>
      <CardContent className="space-y-5">
        <MetroStrip progress={stats.topicProgress} current={cur.slug} />
        <div className="flex flex-col gap-4 rounded-[var(--radius-control)] border border-border bg-surface-2/60 p-4 sm:flex-row sm:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><TopicIcon name={cur.icon} className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">Continue: <span className="font-semibold text-foreground">{cur.name}</span></p>
            <p className="mt-0.5 text-sm text-muted">Step {Math.min(8, (lesson?.completedSteps.length ?? 0) + 1)} of 8, {tp.solved}/{tp.total} problems solved</p>
            <Progress value={tp.percent} className="mt-2 max-w-sm" label={`${cur.name} progress`} />
          </div>
          <Link href={`/learn/${cur.slug}`}><Button><Play /> Continue Learning</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyChallengeCard() {
  const { problem, completed } = useDailyChallenge();
  if (!problem) return null;
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div><CardTitle className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary" /> Daily challenge</CardTitle><CardDescription>+20 bonus XP when solved today</CardDescription></div>
        {completed && <Badge variant="success"><Check className="size-3" /> Done</Badge>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <Link href={`/problems/${problem.slug}`} className="text-lg font-semibold leading-snug hover:text-primary">{problem.title}</Link>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <DifficultyBadge difficulty={problem.difficulty} />
          <Badge variant="outline">{topicsBySlug[problem.topic]?.name}</Badge>
          <span className="inline-flex items-center gap-1 text-muted"><Clock className="size-3.5" /> ~{problem.estimatedMinutes} min</span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-muted">{problem.description.replace(/`/g, "")}</p>
        <Link href={`/problems/${problem.slug}`} className="mt-auto pt-4"><Button className="w-full" variant={completed ? "outline" : "primary"}>{completed ? "Review solution" : "Start challenge"}</Button></Link>
      </CardContent>
    </Card>
  );
}

export function WeeklyActivity() {
  const activity = useAppStore((s) => s.activity);
  const data = lastNDays(7).map((k) => {
    const d = new Date(k + "T00:00:00");
    return { day: d.toLocaleDateString("en-GB", { weekday: "short" }), solved: activity[k]?.solved ?? 0, reviews: activity[k]?.reviews ?? 0 };
  });
  const total = data.reduce((s, d) => s + d.solved, 0);
  return (
    <Card className="lg:col-span-2">
      <CardHeader><div><CardTitle>Weekly activity</CardTitle><CardDescription>{total} problems solved in the last 7 days</CardDescription></div></CardHeader>
      <CardContent className="pt-2"><BarSeries data={data} x="day" stacked bars={[{ key: "solved", name: "Solved", color: "var(--chart-1)" }, { key: "reviews", name: "Reviews", color: "var(--chart-2)" }]} /></CardContent>
    </Card>
  );
}

export function WeakAreas() {
  const state = useAppStore();
  const stats = useStats();
  const weak = weakestTopics(state, stats.topicProgress, 3);
  const steps = recommendedSteps(state, stats.topicProgress);
  return (
    <Card>
      <CardHeader><div><CardTitle className="flex items-center gap-2"><TrendingDown className="size-4 text-warning" /> Your weakest topics</CardTitle><CardDescription>Based on accuracy, coverage and lessons</CardDescription></div></CardHeader>
      <CardContent>
        {weak.length === 0 ? (
          <p className="text-sm text-muted">No weak areas yet. Keep solving and this will update.</p>
        ) : (
          <ul className="space-y-3">
            {weak.map((w) => (
              <li key={w.slug}>
                <div className="mb-1 flex justify-between text-sm"><Link href={`/topics/${w.slug}`} className="hover:text-primary">{w.name}</Link><span className="tabular-nums text-warning">{w.mastery}%</span></div>
                <Progress value={w.mastery} barClassName="bg-warning" label={`${w.name} mastery`} />
              </li>
            ))}
          </ul>
        )}
        {steps.length > 0 && (
          <>
            <p className="mb-2 mt-5 text-sm font-medium">Recommended next steps</p>
            <ul className="space-y-1">
              {steps.map((s) => (
                <li key={s.label}><Link href={s.href} className="flex items-center gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-surface-2"><Lightbulb className="size-4 shrink-0 text-primary" />{s.label}</Link></li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}

type ActivityRow = { id: string; icon: React.ReactNode; label: React.ReactNode; at: string; href?: string };

export function RecentActivity() {
  const submissions = useAppStore((s) => s.submissions);
  const studyLog = useAppStore((s) => s.studyLog);
  const unlocked = useAppStore((s) => s.achievements);
  const rows = useMemo<ActivityRow[]>(() => {
    const out: ActivityRow[] = [];
    const seen = new Set<string>();
    for (const s of submissions.slice(0, 40)) {
      const p = problemsById[s.problemId];
      if (!p || seen.has(p.id + s.status)) continue;
      seen.add(p.id + s.status);
      out.push(s.status === "Accepted"
        ? { id: s.id, icon: <CircleCheck className="size-4 text-success" />, label: <>Solved <span className="font-medium">{p.title}</span></>, at: s.createdAt, href: `/problems/${p.slug}` }
        : { id: s.id, icon: <CircleDot className="size-4 text-warning" />, label: <>Attempted <span className="font-medium">{p.title}</span></>, at: s.createdAt, href: `/problems/${p.slug}` });
    }
    for (const e of studyLog.slice(0, 15)) out.push({ id: e.id, icon: <BookOpen className="size-4 text-primary" />, label: e.label, at: e.createdAt, href: e.href });
    for (const [id, at] of Object.entries(unlocked)) { const a = achievementsById[id]; if (a) out.push({ id, icon: <Award className="size-4 text-warning" />, label: <>Earned <span className="font-medium">{a.name}</span> {a.emoji}</>, at, href: "/achievements" }); }
    return out.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
  }, [submissions, studyLog, unlocked]);
  return (
    <Card>
      <CardHeader><div><CardTitle>Recent activity</CardTitle></div><Link href="/profile" className="text-sm text-primary hover:underline">History</Link></CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState icon={Sparkles} title="Nothing here yet" description="Solve a problem or start a lesson to see your activity." action={{ label: "Open the roadmap", href: "/roadmap" }} />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={r.href ?? "#"} className="flex items-center gap-3 py-2.5 text-sm hover:text-primary">
                  {r.icon}
                  <span className="min-w-0 flex-1 truncate">{r.label}</span>
                  <span className="shrink-0 text-xs text-muted">{timeAgo(r.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function RecommendedList({ limit = 5 }: { limit?: number }) {
  const state = useAppStore();
  const stats = useStats();
  const recs = recommendProblems(state, stats.topicProgress, limit);
  return (
    <Card>
      <CardHeader><div><CardTitle className="flex items-center gap-2"><Target className="size-4 text-primary" /> Recommended for you</CardTitle><CardDescription>Picked from your level, weak topics and roadmap position</CardDescription></div><Link href="/recommended" className="text-sm text-primary hover:underline">More</Link></CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {recs.map((r) => (
            <li key={r.problem.id}>
              <Link href={`/problems/${r.problem.slug}`} className="group flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-primary">{r.problem.title}</p>
                  <p className="truncate text-xs text-muted">{r.reason}</p>
                </div>
                <DifficultyText difficulty={r.problem.difficulty} className="text-xs" />
                <ArrowRight className="size-4 text-muted group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

