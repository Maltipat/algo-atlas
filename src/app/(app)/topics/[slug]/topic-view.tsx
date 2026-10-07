"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronRight, Clock, Lock, Play } from "lucide-react";
import { topicsBySlug } from "@/data/topics";
import { topicProblems } from "@/lib/engine/progress";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TopicIcon } from "@/components/shared/topic-icon";
import { ProblemTable } from "@/components/problems/problem-table";
import { ConceptBody } from "@/components/learn/concept-card";
import { EmptyState } from "@/components/shared/states";
import { cn } from "@/lib/utils";

const DIFFS = ["All", "Easy", "Medium", "Hard"] as const;

export function TopicView({ slug }: { slug: string }) {
  const topic = topicsBySlug[slug]!;
  const stats = useStats();
  const lesson = useAppStore((s) => s.lessons[slug]);
  const tp = stats.topicProgress[slug]!;
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>("All");
  const list = topicProblems(slug).filter((p) => diff === "All" || p.difficulty === diff);
  const started = (lesson?.completedSteps.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
        <Link href="/topics" className="hover:text-foreground">Topics</Link><ChevronRight className="size-3.5" /><span className="text-foreground">{topic.name}</span>
      </nav>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><TopicIcon name={topic.icon} className="size-7" /></span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{topic.name}</h1>
            <p className="mt-1 max-w-[65ch] text-sm text-muted">{topic.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="primary">Level {topic.level}</Badge>
              <Badge variant="outline">{topic.tier}</Badge>
              <Badge variant="outline"><Clock className="size-3" /> ~{topic.estimatedHours} hours</Badge>
              <Badge variant="outline">{tp.total} problems</Badge>
            </div>
          </div>
        </div>
        <div className="w-full shrink-0 rounded-[var(--radius-panel)] border border-border bg-surface p-4 lg:w-72">
          <div className="flex justify-between text-sm"><span className="text-muted">Your progress</span><span className="font-semibold tabular-nums">{tp.percent}%</span></div>
          <Progress value={tp.percent} className="mt-2" label={`${topic.name} progress`} />
          <p className="mt-2 text-xs text-muted">{tp.solved}/{tp.total} solved, lesson {tp.lessonPercent}% complete</p>
          {!tp.unlocked && <p className="mt-3 flex items-start gap-1.5 text-xs text-warning"><Lock className="mt-0.5 size-3 shrink-0" /> Prerequisites are not finished yet. You can still read this page.</p>}
          <Link href={`/learn/${slug}`} className="mt-4 block"><Button className="w-full">{lesson?.completed ? <><BookOpen /> Review in Learning Mode</> : started ? <><Play /> Continue learning</> : <><Play /> Start Learning Mode</>}</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Topic overview</CardTitle></CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div><h3 className="text-sm font-medium">What is it?</h3><p className="mt-1 text-sm leading-relaxed text-muted">{topic.what}</p></div>
            <div><h3 className="text-sm font-medium">Why is it important?</h3><p className="mt-1 text-sm leading-relaxed text-muted">{topic.why}</p></div>
          </div>
          <div className="space-y-4">
            <div><h3 className="text-sm font-medium">Where is it used?</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">{topic.where.map((w) => <li key={w}>{w}</li>)}</ul></div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted">Difficulty</dt><dd className="font-medium">{topic.tier}</dd></div>
              <div><dt className="text-muted">Estimated time</dt><dd className="font-medium">{topic.estimatedHours} hours</dd></div>
              <div className="col-span-2"><dt className="text-muted">Prerequisites</dt><dd className="mt-1 flex flex-wrap gap-1.5">{topic.prerequisites.length ? topic.prerequisites.map((p) => <Link key={p} href={`/topics/${p}`}><Badge variant="outline" className="hover:text-foreground">{topicsBySlug[p]?.name}</Badge></Link>) : <span>None</span>}</dd></div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2 text-sm font-medium">Concepts</p>
          <ol className="space-y-0.5 text-sm">
            {topic.concepts.map((c, i) => (
              <li key={c.id}><a href={`#${c.id}`} className="flex gap-2 rounded-md px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-foreground"><span className="tabular-nums">{i + 1}.</span>{c.title}</a></li>
            ))}
          </ol>
        </aside>
        <div className="space-y-4">
          {topic.concepts.map((c, i) => (
            <Card key={c.id} id={c.id} className="scroll-mt-20">
              <CardHeader><CardTitle><span className="mr-2 text-muted tabular-nums">{i + 1}.</span>{c.title}</CardTitle></CardHeader>
              <CardContent><ConceptBody concept={c} /></CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card id="practice">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center">
          <div><CardTitle>Practice problems</CardTitle><CardDescription>Ordered from easiest to hardest</CardDescription></div>
          <div className="flex gap-1.5">
            {DIFFS.map((d) => <button key={d} onClick={() => setDiff(d)} className={cn("rounded-full px-3 py-1 text-xs font-medium", diff === d ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground")}>{d}</button>)}
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          {topicProblems(slug).length === 0 ? (
            <div className="px-5"><EmptyState icon={BookOpen} title="Theory topic" description="This topic has no coding problems. Work through the lesson and pass the quiz to complete it." action={{ label: "Open Learning Mode", href: `/learn/${slug}` }} /></div>
          ) : (
            <ProblemTable problems={[...list].sort((a, b) => ["Easy", "Medium", "Hard"].indexOf(a.difficulty) - ["Easy", "Medium", "Hard"].indexOf(b.difficulty))} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
