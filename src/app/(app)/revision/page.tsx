"use client";

import Link from "next/link";
import { toast } from "sonner";
import { CalendarClock, CircleCheck, RotateCcw, TrendingDown, TriangleAlert, Trophy, X } from "lucide-react";
import type { RevisionItem, RevisionRating } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useStats, useToday } from "@/hooks/use-app";
import { problemsById } from "@/data/problems";
import { topicsBySlug } from "@/data/topics";
import { achievementsById } from "@/data/achievements";
import { categorizeRevision, RATING_LABELS } from "@/lib/engine/revision";
import { daysBetween } from "@/lib/engine/dates";
import { weakestTopics } from "@/lib/engine/weak";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DifficultyText } from "@/components/shared/difficulty";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/states";
import { StatCard } from "@/components/shared/stat-card";
import { cn } from "@/lib/utils";

const RATINGS: RevisionRating[] = ["easy", "practice", "difficult", "forgot"];
const RATING_BADGE = { easy: "success", practice: "primary", difficult: "warning", forgot: "danger" } as const;

function dueLabel(due: string, today: string) {
  const d = daysBetween(today, due);
  if (d < 0) return `${-d}d overdue`;
  if (d === 0) return "Due today";
  if (d === 1) return "Tomorrow";
  return `In ${d} days`;
}

function Row({ item, today, showRate }: { item: RevisionItem; today: string; showRate: boolean }) {
  const p = problemsById[item.problemId];
  const rate = useAppStore((s) => s.rateRevision);
  const remove = useAppStore((s) => s.removeFromRevision);
  if (!p) return null;
  return (
    <li className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <Link href={`/problems/${p.slug}`} className="font-medium hover:text-primary">{p.title}</Link>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
          <DifficultyText difficulty={p.difficulty} className="text-xs" />
          <span>{topicsBySlug[p.topic]?.name}</span>
          <Badge variant={RATING_BADGE[item.lastRating]}>Last: {RATING_LABELS[item.lastRating]}</Badge>
          <span>{item.reviews} {item.reviews === 1 ? "review" : "reviews"}</span>
          <span className={cn(item.dueDate < today && "text-danger")}>{dueLabel(item.dueDate, today)}</span>
        </div>
      </div>
      {showRate ? (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Rate ${p.title}`}>
          {RATINGS.map((r) => (
            <button key={r} onClick={() => { const earned = rate(p.id, r); toast.success(`${p.title} rescheduled`, { description: `${RATING_LABELS[r]}, +5 XP` }); earned.forEach((id) => toast.success(`Achievement unlocked: ${achievementsById[id]?.name}`)); }}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-surface-2">{RATING_LABELS[r]}</button>
          ))}
        </div>
      ) : (
        <button onClick={() => remove(p.id)} className="self-start rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-foreground sm:self-auto" aria-label={`Remove ${p.title} from revision`}><X className="size-4" /></button>
      )}
    </li>
  );
}

export default function RevisionPage() {
  const state = useAppStore();
  const stats = useStats();
  const today = useToday();
  const cats = categorizeRevision(state, today);
  const weak = weakestTopics(state, stats.topicProgress, 6);

  return (
    <div className="space-y-6">
      <PageHeader title="Revision" description="Spaced repetition for problems you have solved. Open a problem, re-solve it from memory, then rate how it went. Ratings decide when you see it next." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Review today" value={cats.dueToday.length} icon={RotateCcw} tone="warning" />
        <StatCard label="Review soon" value={cats.soon.length} hint="next 7 days" icon={CalendarClock} />
        <StatCard label="Mastered" value={cats.mastered.length} icon={Trophy} tone="success" />
        <StatCard label="Previously failed" value={cats.failed.length} icon={TriangleAlert} />
      </div>
      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Review Today ({cats.dueToday.length})</TabsTrigger>
          <TabsTrigger value="soon">Review Soon ({cats.soon.length})</TabsTrigger>
          <TabsTrigger value="mastered">Mastered ({cats.mastered.length})</TabsTrigger>
          <TabsTrigger value="weak">Weak Topics ({weak.length})</TabsTrigger>
          <TabsTrigger value="failed">Previously Failed ({cats.failed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">
          {cats.dueToday.length === 0 ? <EmptyState icon={CircleCheck} title="Nothing due today" description="Your revision queue is clear. Solve new problems to add more." action={{ label: "Find a problem", href: "/recommended" }} /> :
            <Card><ul className="divide-y divide-border">{cats.dueToday.map((i) => <Row key={i.problemId} item={i} today={today} showRate />)}</ul></Card>}
        </TabsContent>
        <TabsContent value="soon" className="mt-4">
          {cats.soon.length === 0 ? <EmptyState icon={CalendarClock} title="Nothing scheduled this week" description="Problems you solve are scheduled automatically." /> :
            <Card><ul className="divide-y divide-border">{[...cats.soon, ...cats.later].map((i) => <Row key={i.problemId} item={i} today={today} showRate={false} />)}</ul></Card>}
        </TabsContent>
        <TabsContent value="mastered" className="mt-4">
          {cats.mastered.length === 0 ? <EmptyState icon={Trophy} title="No mastered problems yet" description="Rate a problem Easy three reviews in a row to master it." /> :
            <Card><ul className="divide-y divide-border">{cats.mastered.map((i) => <Row key={i.problemId} item={i} today={today} showRate={false} />)}</ul></Card>}
        </TabsContent>
        <TabsContent value="weak" className="mt-4">
          {weak.length === 0 ? <EmptyState icon={TrendingDown} title="No weak topics detected" description="Weak topics appear once you have a few submissions in a topic." /> : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {weak.map((w) => (
                <Card key={w.slug}><CardContent className="pt-5">
                  <div className="flex justify-between"><Link href={`/topics/${w.slug}`} className="font-medium hover:text-primary">{w.name}</Link><span className="tabular-nums text-warning">{w.mastery}%</span></div>
                  <Progress value={w.mastery} className="mt-2" barClassName="bg-warning" label={`${w.name} mastery`} />
                  <p className="mt-2 text-xs text-muted">{w.accuracy}% accuracy over {w.submissions} submissions</p>
                  <div className="mt-3 flex gap-2 text-sm">
                    <Link href={`/learn/${w.slug}`} className="text-primary hover:underline">Revise lesson</Link>
                    <Link href={`/problems?topic=${w.slug}&status=unsolved`} className="text-primary hover:underline">Practise</Link>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="failed" className="mt-4">
          {cats.failed.length === 0 ? <EmptyState icon={CircleCheck} title="No failed problems" description="Problems you attempt without solving, or rate Forgot, appear here." /> : (
            <Card><ul className="divide-y divide-border">
              {cats.failed.map((id) => { const p = problemsById[id]; const pp = state.problemProgress[id]; if (!p) return null; return (
                <li key={id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <Link href={`/problems/${p.slug}`} className="min-w-0 flex-1 truncate font-medium hover:text-primary">{p.title}</Link>
                  <DifficultyText difficulty={p.difficulty} className="text-xs" />
                  <span className="text-xs text-muted">{pp?.attempts ?? 0} attempts</span>
                  <Link href={`/problems/${p.slug}`} className="text-xs font-medium text-primary">Retry</Link>
                </li>
              ); })}
            </ul></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
