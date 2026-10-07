"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, Building } from "lucide-react";
import type { Problem } from "@/types";
import { topicsBySlug } from "@/data/topics";
import { useAppStore } from "@/store/app-store";
import { DifficultyText, StatusIcon } from "@/components/shared/difficulty";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { companiesBySlug } from "@/data/companies";

export function ProblemTable({ problems, showTopic = true, showCompanies = false, emptyMessage = "No problems match these filters." }: { problems: Problem[]; showTopic?: boolean; showCompanies?: boolean; emptyMessage?: string }) {
  const progress = useAppStore((s) => s.problemProgress);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const showTags = useAppStore((s) => s.settings.showTags);

  if (!problems.length) return <p className="px-4 py-10 text-center text-sm text-muted">{emptyMessage}</p>;

  return (
    <div className="overflow-x-auto scroll-thin">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted">
            <th className="w-10 py-2.5 pl-4 font-medium"><span className="sr-only">Status</span></th>
            <th className="py-2.5 pr-3 font-medium">Problem</th>
            <th className="w-24 py-2.5 pr-3 font-medium">Difficulty</th>
            {showTopic && <th className="w-40 py-2.5 pr-3 font-medium">Topic</th>}
            {showCompanies && <th className="w-28 py-2.5 pr-3 font-medium">Companies</th>}
            <th className="w-24 py-2.5 pr-3 text-right font-medium">Acceptance</th>
            <th className="w-20 py-2.5 pr-3 text-right font-medium">Time</th>
            <th className="w-24 py-2.5 pr-4 text-right font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => {
            const status = progress[p.id]?.status ?? "todo";
            const marked = bookmarks.includes(p.id);
            return (
              <tr key={p.id} className="border-b border-border/70 last:border-0 hover:bg-surface-2/60">
                <td className="py-2.5 pl-4"><StatusIcon status={status} /></td>
                <td className="py-2.5 pr-3">
                  <Link href={`/problems/${p.slug}`} className="font-medium hover:text-primary">
                    <span className="mr-1.5 text-muted tabular-nums">{p.number}.</span>{p.title}
                  </Link>
                  {showTags && p.tags.length > 0 && <div className="mt-0.5 truncate text-xs text-muted">{p.tags.slice(0, 3).join(", ")}</div>}
                </td>
                <td className="py-2.5 pr-3"><DifficultyText difficulty={p.difficulty} /></td>
                {showTopic && <td className="py-2.5 pr-3"><Link href={`/topics/${p.topic}`} className="text-muted hover:text-foreground">{topicsBySlug[p.topic]?.name}</Link></td>}
                {showCompanies && (
                  <td className="py-2.5 pr-3">
                    <Tooltip content={p.companies.map((c) => companiesBySlug[c]?.name ?? c).join(", ") || "No company data"}>
                      <span className="inline-flex items-center gap-1 text-muted"><Building className="size-3.5" />{p.companies.length}</span>
                    </Tooltip>
                  </td>
                )}
                <td className="py-2.5 pr-3 text-right tabular-nums text-muted">{p.acceptance.toFixed(1)}%</td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-muted">{p.estimatedMinutes}m</td>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggleBookmark(p.id)} className={cn("rounded-md p-1.5 hover:bg-surface-2", marked ? "text-primary" : "text-muted")} aria-label={marked ? `Remove ${p.title} from bookmarks` : `Bookmark ${p.title}`} aria-pressed={marked}>
                      {marked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                    </button>
                    <Link href={`/problems/${p.slug}`} className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary-soft">
                      {status === "solved" ? "Review" : status === "attempted" ? "Retry" : "Solve"}
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
