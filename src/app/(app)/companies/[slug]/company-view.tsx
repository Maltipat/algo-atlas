"use client";

import Link from "next/link";
import { ChevronRight, MessageSquare, Timer } from "lucide-react";
import { companiesBySlug } from "@/data/companies";
import { problems, problemsBySlug } from "@/data/problems";
import { topicsBySlug } from "@/data/topics";
import { patternsBySlug } from "@/data/patterns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Donut, HorizontalBars } from "@/components/charts/charts";
import { ProblemTable } from "@/components/problems/problem-table";
import { CompanyMark } from "@/components/shared/company-mark";

const TYPE_VARIANT = { Coding: "primary", Conceptual: "neutral", Behavioral: "warning", Design: "success" } as const;

export function CompanyView({ slug }: { slug: string }) {
  const c = companiesBySlug[slug]!;
  const list = problems.filter((p) => p.companies.includes(slug)).sort((a, b) => b.frequency - a.frequency);
  const patternCounts = new Map<string, number>();
  for (const p of list) for (const pt of p.patterns) patternCounts.set(pt, (patternCounts.get(pt) ?? 0) + 1);
  const topPatterns = [...patternCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const dist = (["Easy", "Medium", "Hard"] as const).map((d) => ({ name: d, value: list.filter((p) => p.difficulty === d).length, color: d === "Easy" ? "var(--easy)" : d === "Medium" ? "var(--medium)" : "var(--hard)" }));

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted"><Link href="/companies" className="hover:text-foreground">Companies</Link><ChevronRight className="size-3.5" /><span className="text-foreground">{c.name}</span></nav>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <CompanyMark name={c.name} color={c.color} size={52} />
        <div className="flex-1"><h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1><p className="mt-1 max-w-[70ch] text-sm text-muted">{c.description}</p></div>
        <Link href={`/mock-interview?company=${slug}`}><Button><Timer /> Mock {c.name} interview</Button></Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><div><CardTitle>Frequently asked topics</CardTitle><CardDescription>Relative share of questions reported for {c.name}</CardDescription></div></CardHeader>
          <CardContent><HorizontalBars data={c.focusTopics.map((f) => ({ name: topicsBySlug[f.topic]?.name ?? f.topic, value: f.weight }))} /></CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Difficulty distribution</CardTitle><CardDescription>{list.length} tagged problems</CardDescription></div></CardHeader>
          <CardContent>
            <Donut data={dist} center={<><span className="text-2xl font-semibold">{list.length}</span><span className="text-xs text-muted">problems</span></>} />
            <div className="mt-2 flex justify-center gap-4 text-xs">{dist.map((d) => <span key={d.name} className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: d.color }} />{d.name} {d.value}</span>)}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Interview process</CardTitle></CardHeader>
          <CardContent><ol className="space-y-2">{c.process.map((s, i) => <li key={s} className="flex gap-3 text-sm"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">{i + 1}</span>{s}</li>)}</ol></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Common patterns</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">{topPatterns.map(([p, n]) => <Link key={p} href={`/patterns/${p}`}><Badge variant="outline" className="hover:text-foreground">{patternsBySlug[p]?.name ?? p} <span className="text-muted">{n}</span></Badge></Link>)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="size-4 text-primary" /> Mock interview questions</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {c.questions.map((q) => (
                <li key={q.id}>
                  <details className="group">
                    <summary className="cursor-pointer list-none text-sm"><Badge variant={TYPE_VARIANT[q.type]} className="mr-2">{q.type}</Badge>{q.question}</summary>
                    <p className="mt-2 rounded-md bg-surface-2 p-2.5 text-xs text-muted">{q.answerOutline}{q.problemSlug && problemsBySlug[q.problemSlug] && <> <Link href={`/problems/${q.problemSlug}`} className="text-primary hover:underline">Practise it</Link></>}</p>
                  </details>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader><div><CardTitle>Practice problems</CardTitle><CardDescription>Sorted by interview frequency</CardDescription></div></CardHeader>
        <CardContent className="px-0 pb-2"><ProblemTable problems={list} /></CardContent>
      </Card>
    </div>
  );
}
