"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { learningPathsBySlug } from "@/data/plans";
import { problemsBySlug } from "@/data/problems";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusIcon } from "@/components/shared/difficulty";
import { cn, formatMinutes } from "@/lib/utils";

export function PlanView({ slug }: { slug: string }) {
  const plan = learningPathsBySlug[slug]!;
  const enrollment = useAppStore((s) => s.planEnrollments[slug]);
  const progress = useAppStore((s) => s.problemProgress);
  const enroll = useAppStore((s) => s.enrollPlan);
  const leave = useAppStore((s) => s.leavePlan);
  const toggleDay = useAppStore((s) => s.togglePlanDay);
  const done = enrollment?.completedDays ?? [];
  const nextDay = plan.days.find((d) => !done.includes(d.day))?.day;

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted"><Link href="/interview" className="hover:text-foreground">Interview Prep</Link><ChevronRight className="size-3.5" /><span className="text-foreground">{plan.name}</span></nav>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><h1 className="text-2xl font-semibold tracking-tight">{plan.name}</h1><p className="mt-1 max-w-[70ch] text-sm text-muted">{plan.description} {plan.audience}</p></div>
        {enrollment ? (
          <Button variant="ghost" onClick={() => { leave(slug); toast("Left the plan. Your solved problems are kept."); }}><RotateCcw /> Leave plan</Button>
        ) : (
          <Button onClick={() => { enroll(slug); toast.success(`Enrolled in ${plan.name}`); }}>Start this plan</Button>
        )}
      </div>
      {enrollment && (
        <Card><CardContent className="pt-5">
          <div className="mb-2 flex justify-between text-sm"><span>{done.length} of {plan.durationDays} days complete</span>{nextDay && <a href={`#day-${nextDay}`} className="text-primary hover:underline">Jump to day {nextDay}</a>}</div>
          <Progress value={(done.length / plan.durationDays) * 100} className="h-2" label="Plan progress" />
        </CardContent></Card>
      )}
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {plan.days.map((d) => {
          const complete = done.includes(d.day);
          return (
            <li key={d.day} id={`day-${d.day}`} className={cn("scroll-mt-20 rounded-[var(--radius-panel)] border bg-surface p-4", complete ? "border-success/50" : d.day === nextDay && enrollment ? "border-primary" : "border-border")}>
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-xs text-muted">Day {d.day}, {formatMinutes(d.minutes)}</p><p className="font-medium leading-snug">{d.title}</p></div>
                {enrollment && (
                  <button onClick={() => toggleDay(slug, d.day)} className={cn("grid size-6 shrink-0 place-items-center rounded-full border", complete ? "border-success bg-success text-white" : "border-border-strong hover:border-primary")} aria-label={complete ? `Mark day ${d.day} incomplete` : `Mark day ${d.day} complete`}>
                    {complete && <Check className="size-3.5" />}
                  </button>
                )}
              </div>
              {d.problems.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {d.problems.map((s) => { const p = problemsBySlug[s]; if (!p) return null; return (
                    <li key={s}><Link href={`/problems/${s}`} className="flex items-center gap-2 text-sm hover:text-primary"><StatusIcon status={progress[p.id]?.status ?? "todo"} className="size-3.5" /><span className="truncate">{p.title}</span></Link></li>
                  ); })}
                </ul>
              ) : <p className="mt-3 text-sm text-muted">Review your notes and redo one problem from memory.</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
