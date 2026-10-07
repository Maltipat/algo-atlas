"use client";

import Link from "next/link";
import { Clock, Lock, Play } from "lucide-react";
import { roadmapLevels, topics, topicsBySlug } from "@/data/topics";
import { useStats } from "@/hooks/use-app";
import type { TopicProgress } from "@/lib/engine/progress";
import { PageHeader } from "@/components/shared/page-header";
import { TopicIcon } from "@/components/shared/topic-icon";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<TopicProgress["status"], string> = { "not-started": "Not started", learning: "Learning", practicing: "Practising", mastered: "Mastered" };
const STATUS_VARIANT = { "not-started": "neutral", learning: "primary", practicing: "warning", mastered: "success" } as const;

export default function RoadmapPage() {
  const stats = useStats();
  const tp = stats.topicProgress;
  return (
    <div>
      <PageHeader
        title="DSA roadmap"
        description="Five levels from first loops to interview-grade algorithms. Topics unlock once their prerequisites reach 30% or their lesson is complete."
        actions={<Link href={`/learn/${stats.currentTopic.slug}`}><Button><Play /> Continue: {stats.currentTopic.name}</Button></Link>}
      />
      <ol className="relative space-y-10">
        {roadmapLevels.map((lvl) => {
          const list = topics.filter((t) => t.level === lvl.level);
          const pct = Math.round(list.reduce((s, t) => s + tp[t.slug]!.percent, 0) / list.length);
          return (
            <li key={lvl.level} className="relative grid gap-4 lg:grid-cols-[220px_1fr]">
              <div className="lg:sticky lg:top-20 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary bg-surface text-sm font-semibold text-primary">{lvl.level}</span>
                  <div>
                    <h2 className="font-semibold">Level {lvl.level}: {lvl.name}</h2>
                    <p className="text-xs text-muted">{list.length} topics, {pct}% complete</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">{lvl.description}</p>
                <Progress value={pct} className="mt-3" label={`Level ${lvl.level} progress`} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((t) => {
                  const p = tp[t.slug]!;
                  const isCurrent = t.slug === stats.currentTopic.slug;
                  const card = (
                    <div className={cn(
                      "group relative flex h-full flex-col rounded-[var(--radius-panel)] border bg-surface p-4 transition-colors",
                      p.unlocked ? "border-border hover:border-primary/60" : "border-dashed border-border-strong opacity-70",
                      isCurrent && "border-primary ring-1 ring-primary/40",
                    )}>
                      <div className="flex items-start gap-3">
                        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", p.unlocked ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted")}>
                          {p.unlocked ? <TopicIcon name={t.icon} className="size-[18px]" /> : <Lock className="size-4" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-tight group-hover:text-primary">{t.name}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <Badge variant="outline">{t.tier}</Badge>
                            <Badge variant={STATUS_VARIANT[p.status]}>{isCurrent ? "Current" : STATUS_LABEL[p.status]}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Progress value={p.percent} className="flex-1" label={`${t.name} progress`} />
                        <span className="w-9 text-right text-xs tabular-nums text-muted">{p.percent}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted">
                        <span>{p.total ? `${p.solved}/${p.total} problems` : "Theory and quiz"}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {t.estimatedHours}h</span>
                      </div>
                      {t.prerequisites.length > 0 && (
                        <p className="mt-2 truncate text-xs text-muted">Needs: {t.prerequisites.map((x) => topicsBySlug[x]?.name).join(", ")}</p>
                      )}
                    </div>
                  );
                  return p.unlocked ? (
                    <Link key={t.slug} href={`/topics/${t.slug}`} className="block">{card}</Link>
                  ) : (
                    <Tooltip key={t.slug} content={`Locked. Reach 30% in ${t.prerequisites.map((x) => topicsBySlug[x]?.name).join(" and ")} first, or enable "Unlock all topics" in Settings.`}>
                      <Link href={`/topics/${t.slug}`} className="block" aria-label={`${t.name} (locked)`}>{card}</Link>
                    </Tooltip>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
