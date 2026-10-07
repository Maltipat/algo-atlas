"use client";

import Link from "next/link";
import { CalendarDays, Flame, Pencil, Zap } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { achievements } from "@/data/achievements";
import { problemsById } from "@/data/problems";
import { topics } from "@/data/topics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/shared/avatar";
import { ActivityHeatmap } from "@/components/shared/heatmap";
import { DifficultyText } from "@/components/shared/difficulty";
import { MasteryRadar } from "@/components/charts/charts";
import { Tooltip } from "@/components/ui/tooltip";
import { LANGUAGES } from "@/types";
import { cn, timeAgo } from "@/lib/utils";

const RADAR_TOPICS = ["arrays", "strings", "hashing", "linked-list", "binary-search", "binary-trees", "bfs", "dynamic-programming"];

export default function ProfilePage() {
  const state = useAppStore();
  const user = state.user!;
  const stats = useStats();
  const earned = achievements.filter((a) => state.achievements[a.id]);
  const radar = RADAR_TOPICS.map((s) => ({ topic: topics.find((t) => t.slug === s)!.name.replace("Breadth-First Search", "Graphs (BFS)").replace("Dynamic Programming", "DP"), value: stats.topicProgress[s]!.percent }));
  const started = topics.filter((t) => stats.topicProgress[t.slug]!.percent > 0).sort((a, b) => stats.topicProgress[b.slug]!.percent - stats.topicProgress[a.slug]!.percent);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-5 pt-5 sm:flex-row sm:items-center">
          <Avatar name={user.name} hue={user.avatarHue} size={80} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1><Badge variant="primary">{stats.dsaLevel}</Badge></div>
            <p className="text-sm text-muted">@{user.username}</p>
            {user.bio && <p className="mt-2 max-w-[60ch] text-sm">{user.bio}</p>}
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><CalendarDays className="size-3.5" /> Joined {new Date(user.joinedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center sm:gap-6">
            <div><p className="text-xl font-semibold tabular-nums">{stats.level.level}</p><p className="text-xs text-muted">Level</p></div>
            <div><p className="flex items-center justify-center gap-1 text-xl font-semibold tabular-nums"><Zap className="size-4 text-primary" />{state.xp.toLocaleString("en-IN")}</p><p className="text-xs text-muted">XP</p></div>
            <div><p className="flex items-center justify-center gap-1 text-xl font-semibold tabular-nums"><Flame className="size-4 text-warning" />{stats.currentStreak}</p><p className="text-xs text-muted">Streak</p></div>
            <div><p className="text-xl font-semibold tabular-nums">{stats.solved}</p><p className="text-xs text-muted">Solved</p></div>
          </div>
          <Link href="/settings" className="self-start"><Button variant="outline" size="sm"><Pencil /> Edit profile</Button></Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div><CardTitle>Badges</CardTitle><CardDescription>{earned.length} earned</CardDescription></div><Link href="/achievements" className="text-sm text-primary hover:underline">All achievements</Link></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {earned.map((a) => <Tooltip key={a.id} content={`${a.name}: ${a.description}`}><span className="grid size-11 place-items-center rounded-full bg-primary-soft text-2xl" role="img" aria-label={a.name}>{a.emoji}</span></Tooltip>)}
          {earned.length === 0 && <p className="text-sm text-muted">Solve your first problem to earn a badge.</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><div><CardTitle>Topic mastery</CardTitle><CardDescription>Core interview topics</CardDescription></div></CardHeader><CardContent><MasteryRadar data={radar} /></CardContent></Card>
        <Card>
          <CardHeader><div><CardTitle>Progress by topic</CardTitle><CardDescription>{started.length} topics started</CardDescription></div></CardHeader>
          <CardContent className="max-h-[300px] space-y-3 overflow-y-auto scroll-thin">
            {started.map((t) => (
              <div key={t.slug}><div className="mb-1 flex justify-between text-sm"><Link href={`/topics/${t.slug}`} className="hover:text-primary">{t.name}</Link><span className="tabular-nums text-muted">{stats.topicProgress[t.slug]!.percent}%</span></div><Progress value={stats.topicProgress[t.slug]!.percent} label={`${t.name} progress`} /></div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card><CardHeader><div><CardTitle>Activity calendar</CardTitle></div></CardHeader><CardContent><ActivityHeatmap activity={state.activity} weeks={26} /></CardContent></Card>

      <Card className="overflow-hidden">
        <CardHeader><div><CardTitle>Recent submissions</CardTitle></div></CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[620px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted"><th className="py-2 pl-5 font-medium">Problem</th><th className="py-2 font-medium">Result</th><th className="py-2 font-medium">Language</th><th className="py-2 font-medium">Runtime</th><th className="py-2 pr-5 text-right font-medium">When</th></tr></thead>
              <tbody>
                {state.submissions.slice(0, 15).map((s) => { const p = problemsById[s.problemId]; if (!p) return null; return (
                  <tr key={s.id} className="border-b border-border/70 last:border-0">
                    <td className="py-2 pl-5"><Link href={`/problems/${p.slug}`} className="font-medium hover:text-primary">{p.title}</Link> <DifficultyText difficulty={p.difficulty} className="ml-1 text-xs" /></td>
                    <td className={cn("py-2", s.status === "Accepted" ? "text-success" : "text-danger")}>{s.status}</td>
                    <td className="py-2 text-muted">{LANGUAGES.find((l) => l.id === s.language)?.label}</td>
                    <td className="py-2 tabular-nums text-muted">{s.status === "Accepted" ? `${s.runtimeMs} ms` : "-"}</td>
                    <td className="py-2 pr-5 text-right text-xs text-muted">{timeAgo(s.createdAt)}</td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
