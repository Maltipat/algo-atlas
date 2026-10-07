"use client";

import Link from "next/link";
import { ChevronRight, Radar, Target } from "lucide-react";
import { patternsBySlug } from "@/data/patterns";
import { problems, problemsBySlug } from "@/data/problems";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/shared/code-block";
import { TopicIcon } from "@/components/shared/topic-icon";
import { DifficultyText, StatusIcon } from "@/components/shared/difficulty";
import { ProblemTable } from "@/components/problems/problem-table";

const ORDER = { Easy: 0, Medium: 1, Hard: 2 } as const;

export function PatternView({ slug }: { slug: string }) {
  const p = patternsBySlug[slug]!;
  const progress = useAppStore((s) => s.problemProgress);
  const practice = problems.filter((x) => x.patterns.includes(slug)).sort((a, b) => ORDER[a.difficulty] - ORDER[b.difficulty] || a.number - b.number);
  const examples = p.exampleProblems.map((s) => problemsBySlug[s]).filter((x): x is NonNullable<typeof x> => !!x);
  const stages = (["Easy", "Medium", "Hard"] as const).map((d) => ({ d, list: practice.filter((x) => x.difficulty === d) }));

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted"><Link href="/patterns" className="hover:text-foreground">Patterns</Link><ChevronRight className="size-3.5" /><span className="text-foreground">{p.name}</span></nav>
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><TopicIcon name={p.icon} className="size-6" /></span>
        <div><h1 className="text-2xl font-semibold tracking-tight">{p.name}</h1><p className="mt-1 max-w-[70ch] text-sm text-muted">{p.explanation}</p></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="size-4 text-primary" /> When to use it</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-1.5 pl-5 text-sm">{p.whenToUse.map((w) => <li key={w}>{w}</li>)}</ul></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Radar className="size-4 text-primary" /> How to recognise it</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-1.5 pl-5 text-sm">{p.signals.map((w) => <li key={w}>{w}</li>)}</ul></CardContent></Card>
      </div>
      <Card><CardHeader><div><CardTitle>Template</CardTitle><CardDescription>Adapt the condition and the update steps to the problem at hand.</CardDescription></div></CardHeader><CardContent><CodeBlock code={p.template} language="python" title="Python" /></CardContent></Card>
      <Card>
        <CardHeader><div><CardTitle>Example problems</CardTitle><CardDescription>Classic problems that use this pattern</CardDescription></div></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((x) => (
            <Link key={x.slug} href={`/problems/${x.slug}`} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/60">
              <StatusIcon status={progress[x.id]?.status ?? "todo"} /><span className="min-w-0 flex-1 truncate font-medium">{x.title}</span><DifficultyText difficulty={x.difficulty} className="text-xs" />
            </Link>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Difficulty progression</CardTitle><CardDescription>Work left to right: each stage builds on the last</CardDescription></div></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {stages.map(({ d, list }) => (
            <div key={d} className="rounded-[var(--radius-control)] border border-border p-3">
              <div className="mb-2 flex justify-between"><DifficultyText difficulty={d} /><span className="text-xs tabular-nums text-muted">{list.filter((x) => progress[x.id]?.status === "solved").length}/{list.length} solved</span></div>
              <ul className="space-y-1">{list.slice(0, 6).map((x) => <li key={x.slug}><Link href={`/problems/${x.slug}`} className="flex items-center gap-2 text-sm hover:text-primary"><StatusIcon status={progress[x.id]?.status ?? "todo"} className="size-3.5" /><span className="truncate">{x.title}</span></Link></li>)}</ul>
              {list.length === 0 && <p className="text-sm text-muted">No problems at this level yet.</p>}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader><div><CardTitle>All practice problems</CardTitle><CardDescription>{practice.length} problems tagged with {p.name}</CardDescription></div></CardHeader>
        <CardContent className="px-0 pb-2"><ProblemTable problems={practice} /></CardContent>
      </Card>
    </div>
  );
}
