"use client";

import Link from "next/link";
import { CalendarCheck, Check, Clock, Minus, Play } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useDailyChallenge } from "@/hooks/use-app";
import { problemsById } from "@/data/problems";
import { topicsBySlug } from "@/data/topics";
import { addDays, dayKey, parseDay } from "@/lib/engine/dates";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyBadge, DifficultyText } from "@/components/shared/difficulty";
import { RichText } from "@/components/problems/rich-text";

export default function DailyPage() {
  const { problem, completed, today } = useDailyChallenge();
  const history = useAppStore((s) => s.dailyChallenges);
  const days = Array.from({ length: 14 }, (_, i) => dayKey(addDays(new Date(), -i - 1)));
  const doneCount = Object.values(history).filter((d) => d.completed).length;
  let run = 0;
  for (const k of [today, ...days]) { if (history[k]?.completed) run++; else if (k !== today) break; }

  return (
    <div className="space-y-6">
      <PageHeader title="Daily challenge" description="One problem a day, picked from your unlocked topics at the right difficulty. Solving it today earns 20 bonus XP." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div><CardDescription>{parseDay(today).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</CardDescription><CardTitle className="mt-1 text-xl">{problem.title}</CardTitle></div>
            {completed ? <Badge variant="success"><Check className="size-3" /> Completed</Badge> : <Badge variant="primary">+20 XP bonus</Badge>}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <DifficultyBadge difficulty={problem.difficulty} />
              <Link href={`/topics/${problem.topic}`}><Badge variant="outline">{topicsBySlug[problem.topic]?.name}</Badge></Link>
              <span className="inline-flex items-center gap-1 text-muted"><Clock className="size-3.5" /> ~{problem.estimatedMinutes} min</span>
            </div>
            <RichText text={problem.description} className="mt-4 text-sm text-muted" />
            <Link href={`/problems/${problem.slug}`}><Button className="mt-5"><Play /> {completed ? "Review" : "Start challenge"}</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary" /> Your record</CardTitle></div></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border p-3"><p className="text-xs text-muted">Current run</p><p className="text-2xl font-semibold tabular-nums">{run}</p></div>
            <div className="rounded-md border border-border p-3"><p className="text-xs text-muted">Completed</p><p className="text-2xl font-semibold tabular-nums">{doneCount}</p></div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><div><CardTitle>Past challenges</CardTitle><CardDescription>Missed ones are still worth solving, without the bonus.</CardDescription></div></CardHeader>
        <CardContent className="px-0">
          <ul className="divide-y divide-border">
            {days.map((k) => {
              const rec = history[k];
              const p = rec ? problemsById[rec.problemId] : undefined;
              return (
                <li key={k} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  <span className="w-28 shrink-0 text-muted">{parseDay(k).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
                  {p ? <Link href={`/problems/${p.slug}`} className="min-w-0 flex-1 truncate font-medium hover:text-primary">{p.title}</Link> : <span className="flex-1 text-muted">No challenge opened</span>}
                  {p && <DifficultyText difficulty={p.difficulty} className="hidden text-xs sm:block" />}
                  {rec?.completed ? <Check className="size-4 text-success" aria-label="Completed" /> : <Minus className="size-4 text-muted" aria-label="Not completed" />}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
