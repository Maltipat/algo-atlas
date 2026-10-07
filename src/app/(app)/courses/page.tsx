"use client";

import Link from "next/link";
import { CalendarDays, Clock, GraduationCap, Layers } from "lucide-react";
import { roadmapLevels, topics } from "@/data/topics";
import { learningPaths } from "@/data/plans";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TopicIcon } from "@/components/shared/topic-icon";

export default function CoursesPage() {
  const stats = useStats();
  const enrollments = useAppStore((s) => s.planEnrollments);
  return (
    <div className="space-y-8">
      <PageHeader title="Courses" description="Each roadmap level is a self-contained course. Study plans package the same material on a fixed schedule." />
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Layers className="size-4 text-primary" /> Level courses</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {roadmapLevels.map((lvl) => {
            const list = topics.filter((t) => t.level === lvl.level);
            const pct = Math.round(list.reduce((s, t) => s + stats.topicProgress[t.slug]!.percent, 0) / list.length);
            const hours = list.reduce((s, t) => s + t.estimatedHours, 0);
            const next = list.find((t) => stats.topicProgress[t.slug]!.status !== "mastered") ?? list[0]!;
            return (
              <Card key={lvl.level} className="flex flex-col">
                <CardHeader><div><CardDescription>Level {lvl.level}</CardDescription><CardTitle className="mt-1">{lvl.name}</CardTitle></div><Badge variant="outline"><Clock className="size-3" /> {hours}h</Badge></CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm text-muted">{lvl.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{list.map((t) => <Link key={t.slug} href={`/topics/${t.slug}`}><Badge className="hover:text-foreground"><TopicIcon name={t.icon} className="size-3" />{t.name}</Badge></Link>)}</div>
                  <div className="mt-auto pt-4">
                    <div className="mb-1 flex justify-between text-xs text-muted"><span>{pct}% complete</span><Link href={`/learn/${next.slug}`} className="text-primary hover:underline">Continue with {next.name}</Link></div>
                    <Progress value={pct} label={`${lvl.name} progress`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-primary" /> Study plans</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {learningPaths.map((p) => {
            const e = enrollments[p.slug];
            return (
              <Link key={p.slug} href={`/interview/plans/${p.slug}`} className="group rounded-[var(--radius-panel)] border border-border bg-surface p-4 hover:border-primary/60">
                <div className="flex items-start justify-between gap-2"><p className="font-medium group-hover:text-primary">{p.name}</p>{e && <Badge variant="primary">Enrolled</Badge>}</div>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><GraduationCap className="size-3.5" /> {p.audience}</p>
                {e && <Progress value={(e.completedDays.length / p.durationDays) * 100} className="mt-3" label={`${p.name} progress`} />}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
