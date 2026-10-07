"use client";

import Link from "next/link";
import { topicsBySlug } from "@/data/topics";
import type { TopicProgress } from "@/lib/engine/progress";
import { cn } from "@/lib/utils";

/** The ten milestone stations shown on the dashboard. The current topic is inserted if missing. */
export const MILESTONES = ["arrays", "strings", "hashing", "basic-recursion", "linked-list", "stack", "queue", "binary-trees", "bfs", "dynamic-programming"];
const SHORT: Record<string, string> = { "basic-recursion": "Recursion", "binary-trees": "Trees", bfs: "Graphs", "dynamic-programming": "DP", "linked-list": "Linked List" };

export function MetroStrip({ progress, current }: { progress: Record<string, TopicProgress>; current: string }) {
  const slugs = [...new Set([...MILESTONES, current])].sort((a, b) => (topicsBySlug[a]?.order ?? 0) - (topicsBySlug[b]?.order ?? 0));
  return (
    <div className="overflow-x-auto pb-2 scroll-thin">
      <ol className="relative flex min-w-[720px] items-start justify-between">
        <span aria-hidden className="absolute left-4 right-4 top-[11px] h-[3px] rounded-full bg-surface-2" />
        {slugs.map((slug, i) => {
          const tp = progress[slug]!;
          const done = tp.status === "mastered" || tp.percent >= 70;
          const isCurrent = slug === current;
          const name = SHORT[slug] ?? topicsBySlug[slug]?.name ?? slug;
          const prevDone = i > 0 && (progress[slugs[i - 1]!]!.percent >= 70 || progress[slugs[i - 1]!]!.status === "mastered");
          return (
            <li key={slug} className="relative flex w-full flex-col items-center">
              {i > 0 && prevDone && <span aria-hidden className="absolute right-1/2 top-[11px] h-[3px] w-full bg-primary" />}
              <Link href={`/topics/${slug}`} className="group relative z-10 flex flex-col items-center gap-2" aria-label={`${topicsBySlug[slug]?.name}: ${tp.percent}%${isCurrent ? ", current topic" : ""}`}>
                <span className={cn(
                  "grid size-[25px] place-items-center rounded-full border-[3px] bg-surface transition-transform group-hover:scale-110",
                  done ? "border-primary bg-primary" : isCurrent ? "border-primary" : tp.percent > 0 ? "border-primary/50" : "border-border-strong",
                )}>
                  {isCurrent && !done && <span className="size-2.5 animate-pulse rounded-full bg-primary" />}
                  {done && <svg viewBox="0 0 12 12" className="size-3 text-primary-foreground" aria-hidden><path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                </span>
                <span className={cn("whitespace-nowrap text-xs", isCurrent ? "font-semibold text-foreground" : "text-muted group-hover:text-foreground")}>{name}</span>
                <span className="text-[11px] tabular-nums text-muted">{tp.percent}%</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
