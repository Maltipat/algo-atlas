"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Timer } from "lucide-react";
import { companies } from "@/data/companies";
import { learningPaths } from "@/data/plans";
import { problems } from "@/data/problems";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CompanyMark } from "@/components/shared/company-mark";

export default function InterviewPage() {
  const stats = useStats();
  const progress = useAppStore((s) => s.problemProgress);
  const enrollments = useAppStore((s) => s.planEnrollments);
  return (
    <div className="space-y-8">
      <PageHeader title="Interview prep" description="Company-specific practice, structured plans and timed mock interviews." actions={<Link href="/mock-interview"><Button><Timer /> Start a mock interview</Button></Link>} />
      <Card>
        <CardContent className="flex flex-col gap-5 pt-5 sm:flex-row sm:items-center">
          <ProgressRing value={stats.readiness} size={88} stroke={8}><span className="text-lg font-semibold tabular-nums">{stats.readiness}%</span></ProgressRing>
          <div className="flex-1">
            <p className="font-semibold">Interview readiness</p>
            <p className="mt-1 max-w-[70ch] text-sm text-muted">Combines how many frequently asked problems you have solved, your Medium/Hard coverage ({stats.byDifficulty.Medium.solved + stats.byDifficulty.Hard.solved} solved) and your submission accuracy ({stats.successRate}%).</p>
          </div>
        </CardContent>
      </Card>
      <section>
        <h2 className="mb-3 font-semibold">Company-wise preparation</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {companies.map((c) => {
            const list = problems.filter((p) => p.companies.includes(c.slug));
            const solved = list.filter((p) => progress[p.id]?.status === "solved").length;
            return (
              <Link key={c.slug} href={`/companies/${c.slug}`} className="group rounded-[var(--radius-panel)] border border-border bg-surface p-4 hover:border-primary/60">
                <div className="flex items-center gap-3"><CompanyMark name={c.name} color={c.color} /><div><p className="font-medium group-hover:text-primary">{c.name}</p><p className="text-xs text-muted">{list.length} tagged problems</p></div></div>
                <Progress value={(solved / Math.max(1, list.length)) * 100} className="mt-4" label={`${c.name} progress`} />
                <p className="mt-1.5 text-xs text-muted">{solved} solved</p>
              </Link>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="mb-3 font-semibold">Interview roadmaps</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {learningPaths.map((p) => {
            const e = enrollments[p.slug];
            return (
              <Card key={p.slug} className="flex flex-col">
                <CardHeader><div><CardTitle>{p.name}</CardTitle><CardDescription>{p.audience}</CardDescription></div>{e && <Badge variant="primary">Enrolled</Badge>}</CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm text-muted">{p.description}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><CalendarDays className="size-3.5" /> {p.durationDays} days, {p.days.reduce((s, d) => s + d.problems.length, 0)} problem slots</p>
                  {e && <Progress value={(e.completedDays.length / p.durationDays) * 100} className="mt-3" label="Plan progress" />}
                  <Link href={`/interview/plans/${p.slug}`} className="mt-auto pt-4"><Button variant="outline" className="w-full">{e ? "Open plan" : "View plan"} <ArrowRight /></Button></Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
