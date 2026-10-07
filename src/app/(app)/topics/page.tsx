"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Search } from "lucide-react";
import { topics } from "@/data/topics";
import { useStats } from "@/hooks/use-app";
import { PageHeader } from "@/components/shared/page-header";
import { TopicIcon } from "@/components/shared/topic-icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/states";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default function TopicsPage() {
  const stats = useStats();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<(typeof FILTERS)[number]>("All");
  const list = topics.filter((t) => (tier === "All" || t.tier === tier) && (t.name + " " + t.summary).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader title="Topics" description={`${topics.length} topics, each with lessons, worked examples, a quiz and practice problems.`} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter topics" className="pl-9" aria-label="Filter topics" />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setTier(f)} className={cn("rounded-full px-3 py-1.5 text-xs font-medium", tier === f ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground")}>{f}</button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={Search} title="No topics found" description="Try a different name or clear the difficulty filter." action={{ label: "Clear filters", onClick: () => { setQ(""); setTier("All"); } }} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => {
            const p = stats.topicProgress[t.slug]!;
            return (
              <Link key={t.slug} href={`/topics/${t.slug}`} className="group rounded-[var(--radius-panel)] border border-border bg-surface p-4 hover:border-primary/60">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><TopicIcon name={t.icon} className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><p className="font-medium group-hover:text-primary">{t.name}</p>{!p.unlocked && <Lock className="size-3.5 text-muted" aria-label="Locked" />}</div>
                    <p className="mt-0.5 text-xs text-muted">Level {t.level}, {t.tier}, ~{t.estimatedHours}h</p>
                  </div>
                  {p.status === "mastered" && <Badge variant="success">Mastered</Badge>}
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted">{t.summary}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Progress value={p.percent} className="flex-1" label={`${t.name} progress`} />
                  <span className="text-xs tabular-nums text-muted">{p.solved}/{p.total}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
