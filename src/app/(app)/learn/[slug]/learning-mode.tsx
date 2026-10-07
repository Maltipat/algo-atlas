"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ChevronRight, PartyPopper } from "lucide-react";
import type { Difficulty } from "@/types";
import { topics, topicsBySlug } from "@/data/topics";
import { topicProblems } from "@/lib/engine/progress";
import { achievementsById } from "@/data/achievements";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ConceptBody } from "@/components/learn/concept-card";
import { Quiz } from "@/components/learn/quiz";
import { CodeBlock } from "@/components/shared/code-block";
import { ProblemTable } from "@/components/problems/problem-table";
import { cn } from "@/lib/utils";

const STEPS = ["Learn the concept", "Read the explanation", "Study examples", "Solve Easy problems", "Solve Medium problems", "Solve Hard problems", "Take the topic quiz", "Complete the topic"];
const DIFF_FOR_STEP: Record<number, Difficulty> = { 4: "Easy", 5: "Medium", 6: "Hard" };

export function LearningMode({ slug }: { slug: string }) {
  const topic = topicsBySlug[slug]!;
  const lesson = useAppStore((s) => s.lessons[slug]);
  const progress = useAppStore((s) => s.problemProgress);
  const setLessonStep = useAppStore((s) => s.setLessonStep);
  const completeQuiz = useAppStore((s) => s.completeQuiz);
  const completeTopic = useAppStore((s) => s.completeTopic);
  const [step, setStep] = useState(() => (lesson?.completed ? 1 : Math.min(8, Math.max(1, (lesson?.completedSteps.length ?? 0) + 1))));
  const done = lesson?.completedSteps ?? [];
  const nextTopic = topics.find((t) => t.order === topic.order + 1);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const goNext = () => {
    setLessonStep(slug, step + 1);
    setStep((s) => Math.min(8, s + 1));
  };
  const maxReachable = lesson?.completed ? 8 : Math.max(...done, 0) + 1;

  const problemsFor = (d: Difficulty) => topicProblems(slug).filter((p) => p.difficulty === d);
  const solvedCount = (d: Difficulty) => problemsFor(d).filter((p) => progress[p.id]?.status === "solved").length;
  const workedExample = topicProblems(slug).find((p) => p.difficulty === "Easy") ?? topicProblems(slug)[0];
  const quizPassed = (lesson?.quizScore ?? 0) >= 60;

  const notify = (earned: string[]) => earned.forEach((id) => { const a = achievementsById[id]; if (a) toast.success(`Achievement unlocked: ${a.name} ${a.emoji}`, { description: `+${a.xp} XP` }); });

  let body: React.ReactNode;
  let canContinue = true;
  let continueLabel = "Continue";
  if (step === 1) {
    body = (
      <div className="space-y-5">
        <p className="max-w-[72ch] text-[15px] leading-relaxed">{topic.what}</p>
        <div className="rounded-[var(--radius-control)] border border-border bg-surface-2/50 p-4"><p className="text-sm font-medium">Why it matters</p><p className="mt-1 text-sm text-muted">{topic.why}</p></div>
        <div><p className="mb-2 text-sm font-medium">In this topic you will learn</p>
          <ol className="grid gap-2 sm:grid-cols-2">{topic.concepts.map((c, i) => <li key={c.id} className="flex gap-2 rounded-md border border-border px-3 py-2 text-sm"><span className="text-muted tabular-nums">{i + 1}.</span>{c.title}</li>)}</ol>
        </div>
      </div>
    );
  } else if (step === 2) {
    body = <div className="space-y-8">{topic.concepts.map((c) => <section key={c.id}><h3 className="mb-3 font-semibold">{c.title}</h3><ConceptBody concept={{ ...c, code: "" }} showCode={false} /></section>)}</div>;
  } else if (step === 3) {
    body = (
      <div className="space-y-6">
        {topic.concepts.filter((c) => c.code).map((c) => (
          <section key={c.id}><h3 className="mb-2 font-semibold">{c.title}</h3><CodeBlock code={c.code} language="python" title={`Python, ${c.complexity}`} /></section>
        ))}
        {workedExample?.solution.javascript && (
          <section className="rounded-[var(--radius-panel)] border border-border p-4">
            <p className="text-xs font-medium text-primary">Worked example</p>
            <h3 className="mt-1 font-semibold">{workedExample.title}</h3>
            <p className="mt-2 text-sm text-muted">{workedExample.explanation}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">{workedExample.approach.map((s) => <li key={s}>{s}</li>)}</ol>
            <CodeBlock className="mt-3" code={workedExample.solution.python ?? workedExample.solution.javascript} language={workedExample.solution.python ? "python" : "javascript"} />
          </section>
        )}
      </div>
    );
  } else if (step >= 4 && step <= 6) {
    const d = DIFF_FOR_STEP[step]!;
    const list = problemsFor(d);
    const solved = solvedCount(d);
    canContinue = list.length === 0 || solved >= 1;
    continueLabel = canContinue ? "Continue" : "Skip for now";
    body = list.length === 0 ? (
      <p className="text-sm text-muted">There are no {d} problems in this topic. Continue to the next step.</p>
    ) : (
      <div className="space-y-3">
        <p className="text-sm text-muted">Solve at least one {d} problem to complete this step. You have solved {solved} of {list.length}.</p>
        <div className="-mx-5"><ProblemTable problems={list} showTopic={false} /></div>
      </div>
    );
  } else if (step === 7) {
    canContinue = quizPassed;
    body = <Quiz questions={topic.quiz} bestScore={lesson?.quizScore} onSubmit={(score) => { notify(completeQuiz(slug, score)); if (score >= 60) setLessonStep(slug, 8); }} />;
  } else {
    body = lesson?.completed ? (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="grid size-14 animate-pop place-items-center rounded-full bg-success-soft text-success"><Check className="size-7" /></span>
        <h3 className="mt-4 text-lg font-semibold">{topic.name} complete</h3>
        <p className="mt-1 max-w-md text-sm text-muted">Problems from this topic now appear in your revision queue as you solve them. Keep practising to reach mastery.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href={`/topics/${slug}#practice`}><Button variant="outline">More practice</Button></Link>
          {nextTopic && <Link href={`/learn/${nextTopic.slug}`}><Button>Next: {nextTopic.name} <ArrowRight /></Button></Link>}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center py-6 text-center">
        <PartyPopper className="size-10 text-primary" aria-hidden />
        <h3 className="mt-3 text-lg font-semibold">Ready to finish {topic.name}</h3>
        <p className="mt-1 max-w-md text-sm text-muted">You have worked through the lessons, practice and quiz. Completing the topic earns 50 XP.</p>
        <Button className="mt-5" onClick={() => { notify(completeTopic(slug)); toast.success(`${topic.name} completed`, { description: "+50 XP" }); }}>Complete topic</Button>
      </div>
    );
    canContinue = false;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
        <Link href="/roadmap" className="hover:text-foreground">Roadmap</Link><ChevronRight className="size-3.5" />
        <Link href={`/topics/${slug}`} className="hover:text-foreground">{topic.name}</Link><ChevronRight className="size-3.5" /><span className="text-foreground">Learning Mode</span>
      </nav>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Learning Mode: {topic.name}</h1>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={(done.length / 8) * 100} className="h-2 flex-1" label="Learning Mode progress" />
          <span className="text-sm tabular-nums text-muted">{done.length}/8 steps</span>
        </div>
      </div>
      <ol className="grid grid-cols-4 gap-1.5 sm:grid-cols-8" aria-label="Steps">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const complete = done.includes(n) || !!lesson?.completed;
          const reachable = n <= maxReachable;
          return (
            <li key={label}>
              <button
                disabled={!reachable}
                onClick={() => setStep(n)}
                aria-current={step === n ? "step" : undefined}
                className={cn("flex w-full flex-col items-start gap-1 rounded-md border px-2 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  step === n ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-2")}
              >
                <span className={cn("grid size-5 place-items-center rounded-full text-[11px] font-semibold", complete ? "bg-success text-white" : step === n ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted")}>{complete ? <Check className="size-3" /> : n}</span>
                <span className="line-clamp-2 text-[11px] leading-tight text-muted">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <Card>
        <div className="border-b border-border px-5 py-3"><p className="text-xs text-muted">Step {step} of 8</p><h2 className="font-semibold">{STEPS[step - 1]}</h2></div>
        <CardContent className="pt-5">{body}</CardContent>
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}><ArrowLeft /> Back</Button>
          {step < 8 && (step !== 7 || quizPassed) && <Button variant={canContinue ? "primary" : "outline"} onClick={goNext}>{continueLabel} <ArrowRight /></Button>}
        </div>
      </Card>
    </div>
  );
}
