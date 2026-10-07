"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CircleCheck, Circle, ExternalLink, Flag, Timer } from "lucide-react";
import type { Problem } from "@/types";
import { companies, companiesBySlug } from "@/data/companies";
import { problems, problemsById } from "@/data/problems";
import { achievementsById } from "@/data/achievements";
import { useAppStore } from "@/store/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import { DifficultyBadge } from "@/components/shared/difficulty";
import { CompanyMark } from "@/components/shared/company-mark";
import { EmptyState } from "@/components/shared/states";
import { cn, timeAgo } from "@/lib/utils";

function pick(company: string, solved: Set<string>): Problem[] {
  const pool = problems.filter((p) => (company === "any" || p.companies.includes(company)));
  const fresh = (list: Problem[]) => { const u = list.filter((p) => !solved.has(p.id)); return u.length ? u : list; };
  const first = fresh(pool.filter((p) => p.difficulty !== "Hard"));
  const second = fresh(pool.filter((p) => p.difficulty !== "Easy"));
  const a = first[Math.floor(Math.random() * first.length)]!;
  const rest = second.filter((p) => p.id !== a.id);
  const b = rest[Math.floor(Math.random() * rest.length)] ?? second[0]!;
  return [a, b];
}

export function MockInterview() {
  const params = useSearchParams();
  const sessions = useAppStore((s) => s.mockSessions);
  const submissions = useAppStore((s) => s.submissions);
  const progress = useAppStore((s) => s.problemProgress);
  const startMock = useAppStore((s) => s.startMock);
  const endMock = useAppStore((s) => s.endMock);
  const [company, setCompany] = useState(params.get("company") ?? "google");
  const [duration, setDuration] = useState(45);
  const [now, setNow] = useState(Date.now());
  const active = sessions.find((s) => !s.endedAt);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const remaining = active ? Math.max(0, new Date(active.startedAt).getTime() + active.durationMin * 60000 - now) : 0;
  const finish = () => {
    if (!active) return;
    const earned = endMock(active.id);
    toast.success("Mock interview finished");
    earned.forEach((id) => toast.success(`Achievement unlocked: ${achievementsById[id]?.name}`));
  };
  useEffect(() => { if (active && remaining === 0) finish(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [remaining === 0, active?.id]);

  const start = () => {
    const solved = new Set(Object.entries(progress).filter(([, p]) => p.status === "solved").map(([id]) => id));
    const chosen = pick(company, solved);
    startMock(company, chosen.map((p) => p.id), duration);
    toast(`Timer started: ${duration} minutes`);
  };

  const solvedInSession = (pid: string, since: string) => submissions.some((s) => s.problemId === pid && s.status === "Accepted" && s.createdAt >= since);
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0"), ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="space-y-6">
      <PageHeader title="Mock interview" description="Two problems under a real time limit, the way most coding rounds run. Problems open in a new tab so the timer keeps running here." />
      {active ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3"><CompanyMark name={companiesBySlug[active.company]?.name ?? "Mixed"} color={companiesBySlug[active.company]?.color ?? "var(--primary)"} /><div><CardTitle>{companiesBySlug[active.company]?.name ?? "Mixed"} coding round</CardTitle><CardDescription>Explain your approach out loud before you code.</CardDescription></div></div>
            <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-2xl tabular-nums", remaining < 5 * 60000 ? "border-danger text-danger" : "border-border")} role="timer" aria-label={`${mm} minutes ${ss} seconds remaining`}><Timer className="size-5" /> {mm}:{ss}</div>
          </CardHeader>
          <CardContent className="space-y-3">
            {active.problemIds.map((pid, i) => {
              const p = problemsById[pid]; if (!p) return null;
              const done = solvedInSession(pid, active.startedAt);
              return (
                <div key={pid} className="flex flex-col gap-3 rounded-[var(--radius-control)] border border-border p-4 sm:flex-row sm:items-center">
                  {done ? <CircleCheck className="size-5 text-success" aria-label="Solved" /> : <Circle className="size-5 text-muted" aria-label="Not solved yet" />}
                  <div className="flex-1"><p className="text-xs text-muted">Problem {i + 1}</p><p className="font-medium">{p.title}</p></div>
                  <DifficultyBadge difficulty={p.difficulty} />
                  <a href={`/problems/${p.slug}`} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><ExternalLink /> Open</Button></a>
                </div>
              );
            })}
            <div className="flex justify-end pt-2"><Button variant="danger" onClick={finish}><Flag /> End interview</Button></div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><div><CardTitle>Set up a session</CardTitle><CardDescription>One easier warm-up and one harder main problem, preferring ones you have not solved.</CardDescription></div></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div><Label htmlFor="mock-company">Company</Label><Select id="mock-company" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full"><option value="any">Mixed companies</option>{companies.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</Select></div>
            <div><Label htmlFor="mock-duration">Duration</Label><Select id="mock-duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full"><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option></Select></div>
            <Button onClick={start}><Timer /> Start interview</Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><div><CardTitle>Past sessions</CardTitle></div></CardHeader>
        <CardContent className="px-0">
          {sessions.filter((s) => s.endedAt).length === 0 ? <div className="px-5"><EmptyState icon={Timer} title="No sessions yet" description="Your finished mock interviews will appear here with results." /></div> : (
            <ul className="divide-y divide-border">
              {sessions.filter((s) => s.endedAt).map((s) => {
                const used = Math.round((new Date(s.endedAt!).getTime() - new Date(s.startedAt).getTime()) / 60000);
                return (
                  <li key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                    <span className="w-28 font-medium">{companiesBySlug[s.company]?.name ?? "Mixed"}</span>
                    <span className="flex-1 truncate text-muted">{s.problemIds.map((id) => problemsById[id]?.title).join(", ")}</span>
                    <span className={cn("font-medium tabular-nums", (s.solvedIds?.length ?? 0) === s.problemIds.length ? "text-success" : "text-warning")}>{s.solvedIds?.length ?? 0}/{s.problemIds.length} solved</span>
                    <span className="text-muted tabular-nums">{used} of {s.durationMin} min</span>
                    <span className="text-xs text-muted">{timeAgo(s.startedAt)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted">Want company-specific questions to rehearse? See <Link href="/companies" className="text-primary hover:underline">company pages</Link> for behavioural and design prompts.</p>
    </div>
  );
}
