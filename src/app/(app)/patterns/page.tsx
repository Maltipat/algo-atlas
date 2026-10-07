"use client";

import Link from "next/link";
import { patterns } from "@/data/patterns";
import { problems } from "@/data/problems";
import { useAppStore } from "@/store/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { TopicIcon } from "@/components/shared/topic-icon";
import { Progress } from "@/components/ui/progress";

export default function PatternsPage() {
  const progress = useAppStore((s) => s.problemProgress);
  return (
    <div>
      <PageHeader title="Interview patterns" description="Most interview problems are variations of a small set of patterns. Learn to recognise the signals, then apply the template." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {patterns.map((p) => {
          const list = problems.filter((x) => x.patterns.includes(p.slug));
          const solved = list.filter((x) => progress[x.id]?.status === "solved").length;
          return (
            <Link key={p.slug} href={`/patterns/${p.slug}`} className="group flex flex-col rounded-[var(--radius-panel)] border border-border bg-surface p-4 hover:border-primary/60">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><TopicIcon name={p.icon} className="size-[18px]" /></span>
                <p className="font-medium group-hover:text-primary">{p.name}</p>
              </div>
              <p className="mt-3 text-sm text-muted">{p.summary}</p>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <Progress value={list.length ? (solved / list.length) * 100 : 0} className="flex-1" label={`${p.name} progress`} />
                <span className="text-xs tabular-nums text-muted">{solved}/{list.length}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
