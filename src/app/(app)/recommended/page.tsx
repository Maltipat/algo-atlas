"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { recommendProblems } from "@/lib/engine/recommend";
import { recommendedSteps } from "@/lib/engine/weak";
import { topicsBySlug } from "@/data/topics";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/shared/difficulty";
import { Badge } from "@/components/ui/badge";

export default function RecommendedPage() {
  const state = useAppStore();
  const stats = useStats();
  const recs = recommendProblems(state, stats.topicProgress, 15);
  const steps = recommendedSteps(state, stats.topicProgress);
  return (
    <div className="space-y-6">
      <PageHeader title="Recommended" description={`Ranked using your roadmap position (${stats.currentTopic.name}), weak topics, recent accuracy and how often each problem appears in interviews.`} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {recs.map((r, i) => (
            <Link key={r.problem.id} href={`/problems/${r.problem.slug}`} className="group flex flex-col rounded-[var(--radius-panel)] border border-border bg-surface p-4 hover:border-primary/60">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs tabular-nums text-muted">#{i + 1}</span>
                <DifficultyBadge difficulty={r.problem.difficulty} />
              </div>
              <p className="mt-2 font-medium group-hover:text-primary">{r.problem.title}</p>
              <p className="mt-1 text-sm text-muted">{r.reason}</p>
              <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                <Badge variant="outline">{topicsBySlug[r.problem.topic]?.name}</Badge>
                <span className="inline-flex items-center gap-1 group-hover:text-primary">Solve <ArrowRight className="size-3.5" /></span>
              </div>
            </Link>
          ))}
        </div>
        <Card className="h-fit">
          <CardHeader><div><CardTitle>Next steps</CardTitle><CardDescription>From your weakest topics</CardDescription></div></CardHeader>
          <CardContent>
            {steps.length ? (
              <ul className="space-y-1">{steps.map((s) => <li key={s.label}><Link href={s.href} className="flex items-start gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-surface-2"><Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />{s.label}</Link></li>)}</ul>
            ) : <p className="text-sm text-muted">Solve a few more problems and personalised steps will appear here.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
