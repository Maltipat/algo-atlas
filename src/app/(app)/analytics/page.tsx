"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CircleCheck, Clock, Gauge, TrendingUp } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { problemsById } from "@/data/problems";
import { topics } from "@/data/topics";
import { solvedOverTime, weeklySeries } from "@/lib/engine/stats";
import { strongestTopics, weakestTopics } from "@/lib/engine/weak";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ActivityHeatmap } from "@/components/shared/heatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaSeries, BarSeries, Donut, HorizontalBars, LineSeries } from "@/components/charts/charts";
import { formatMinutes } from "@/lib/utils";

export default function AnalyticsPage() {
  const state = useAppStore();
  const stats = useStats();
  const overTime = useMemo(() => solvedOverTime(state, 90), [state]);
  const weekly = useMemo(() => weeklySeries(state, 12), [state]);
  const strong = strongestTopics(state, stats.topicProgress, 5);
  const weak = weakestTopics(state, stats.topicProgress, 5);

  const difficultyData = (["Easy", "Medium", "Hard"] as const).map((d) => ({ name: d, value: stats.byDifficulty[d].solved, color: d === "Easy" ? "var(--easy)" : d === "Medium" ? "var(--medium)" : "var(--hard)" }));
  const topicData = topics.map((t) => ({ name: t.name, value: stats.topicProgress[t.slug]!.solved })).filter((t) => t.value > 0).sort((a, b) => b.value - a.value).slice(0, 12);
  const statusCounts = new Map<string, number>();
  for (const s of state.submissions) statusCounts.set(s.status, (statusCounts.get(s.status) ?? 0) + 1);
  const statusColors: Record<string, string> = { Accepted: "var(--chart-2)", "Wrong Answer": "var(--chart-4)", "Runtime Error": "var(--chart-3)", "Time Limit Exceeded": "var(--chart-6)", "Compilation Error": "var(--chart-5)" };
  const statusData = [...statusCounts.entries()].map(([name, value]) => ({ name, value, color: statusColors[name] ?? "var(--muted)" }));
  const solveTimeData = (["Easy", "Medium", "Hard"] as const).map((d) => ({ difficulty: d, minutes: stats.avgSolve[d] }));
  const langCounts = new Map<string, number>();
  for (const s of state.submissions) if (s.status === "Accepted" && problemsById[s.problemId]) langCounts.set(s.language, (langCounts.get(s.language) ?? 0) + 1);
  const recent = weekly.slice(-4).filter((w) => w.accuracy !== null), earlier = weekly.slice(0, 8).filter((w) => w.accuracy !== null);
  const avg = (l: typeof weekly) => (l.length ? Math.round(l.reduce((s, w) => s + (w.accuracy ?? 0), 0) / l.length) : 0);
  const trend = avg(recent) - avg(earlier);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="How your practice is going: volume, accuracy, speed and where to focus." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Problems solved" value={stats.solved} hint={`${stats.week.solved} this week`} icon={CircleCheck} tone="success" />
        <StatCard label="Submission success rate" value={`${stats.successRate}%`} hint={`${stats.acceptedSubmissions}/${stats.totalSubmissions} accepted`} icon={Gauge} tone="primary" />
        <StatCard label="Average solve time" value={stats.avgSolve.Medium ? `${stats.avgSolve.Medium}m` : "n/a"} hint={`Medium problems. Easy ${stats.avgSolve.Easy ? stats.avgSolve.Easy + "m" : "n/a"}, Hard ${stats.avgSolve.Hard ? stats.avgSolve.Hard + "m" : "n/a"}`} icon={Clock} />
        <StatCard label="Accuracy trend" value={`${trend >= 0 ? "+" : ""}${trend} pts`} hint="last 4 weeks vs the 8 before" icon={TrendingUp} tone={trend >= 0 ? "success" : "warning"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader><div><CardTitle>Problems solved over time</CardTitle><CardDescription>Cumulative, last 90 days</CardDescription></div></CardHeader><CardContent><AreaSeries data={overTime} x="label" y="total" name="Total solved" /></CardContent></Card>
        <Card><CardHeader><div><CardTitle>Difficulty distribution</CardTitle><CardDescription>Solved problems</CardDescription></div></CardHeader><CardContent>
          <Donut data={difficultyData} center={<><span className="text-2xl font-semibold">{stats.solved}</span><span className="text-xs text-muted">solved</span></>} />
          <div className="mt-2 flex justify-center gap-4 text-xs">{difficultyData.map((d) => <span key={d.name} className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: d.color }} />{d.name} {d.value}</span>)}</div>
        </CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><div><CardTitle>Improvement trend</CardTitle><CardDescription>Weekly accuracy and problems solved</CardDescription></div></CardHeader><CardContent><LineSeries data={weekly} x="label" lines={[{ key: "accuracy", name: "Accuracy %", color: "var(--chart-1)" }, { key: "solved", name: "Solved", color: "var(--chart-2)" }]} /></CardContent></Card>
        <Card><CardHeader><div><CardTitle>Weekly activity</CardTitle><CardDescription>Minutes of practice per week</CardDescription></div></CardHeader><CardContent><BarSeries data={weekly} x="label" bars={[{ key: "minutes", name: "Minutes", color: "var(--chart-1)" }]} /></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader><div><CardTitle>Topic distribution</CardTitle><CardDescription>Problems solved per topic</CardDescription></div></CardHeader><CardContent><HorizontalBars data={topicData} /></CardContent></Card>
        <Card><CardHeader><div><CardTitle>Submission results</CardTitle><CardDescription>{state.submissions.length} submissions</CardDescription></div></CardHeader><CardContent>
          <Donut data={statusData} center={<><span className="text-2xl font-semibold">{stats.successRate}%</span><span className="text-xs text-muted">accepted</span></>} />
          <ul className="mt-2 space-y-1 text-xs">{statusData.map((d) => <li key={d.name} className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: d.color }} />{d.name}<span className="ml-auto tabular-nums text-muted">{d.value}</span></li>)}</ul>
        </CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card><CardHeader><div><CardTitle>Average solving time</CardTitle><CardDescription>Minutes per solved problem</CardDescription></div></CardHeader><CardContent><BarSeries data={solveTimeData} x="difficulty" bars={[{ key: "minutes", name: "Minutes", color: "var(--chart-3)" }]} height={200} /></CardContent></Card>
        <Card><CardHeader><div><CardTitle>Strongest topics</CardTitle></div></CardHeader><CardContent><ul className="space-y-3">{strong.map((m) => <li key={m.slug}><div className="mb-1 flex justify-between text-sm"><Link href={`/topics/${m.slug}`} className="hover:text-primary">{m.name}</Link><span className="tabular-nums text-success">{m.mastery}%</span></div><Progress value={m.mastery} barClassName="bg-success" label={`${m.name} mastery`} /></li>)}</ul></CardContent></Card>
        <Card><CardHeader><div><CardTitle>Weakest topics</CardTitle></div></CardHeader><CardContent>{weak.length ? <ul className="space-y-3">{weak.map((m) => <li key={m.slug}><div className="mb-1 flex justify-between text-sm"><Link href={`/topics/${m.slug}`} className="hover:text-primary">{m.name}</Link><span className="tabular-nums text-warning">{m.mastery}%</span></div><Progress value={m.mastery} barClassName="bg-warning" label={`${m.name} mastery`} /></li>)}</ul> : <p className="text-sm text-muted">No weak topics detected yet.</p>}</CardContent></Card>
      </div>
      <Card><CardHeader><div><CardTitle>Monthly activity</CardTitle><CardDescription>Total study time {formatMinutes(stats.studyMinutes)}. Accepted solutions by language: {[...langCounts.entries()].map(([l, n]) => `${l} ${n}`).join(", ") || "none yet"}</CardDescription></div></CardHeader><CardContent><ActivityHeatmap activity={state.activity} weeks={26} /></CardContent></Card>
    </div>
  );
}
