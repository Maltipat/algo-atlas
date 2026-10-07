"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Eye, FileText, History, Lightbulb, Lock, NotebookPen, Sparkles } from "lucide-react";
import type { Problem } from "@/types";
import { topicsBySlug } from "@/data/topics";
import { patternsBySlug } from "@/data/patterns";
import { companiesBySlug } from "@/data/companies";
import { useAppStore } from "@/store/app-store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { DifficultyBadge, StatusIcon } from "@/components/shared/difficulty";
import { CodeBlock } from "@/components/shared/code-block";
import { RichText } from "@/components/problems/rich-text";
import { EmptyState } from "@/components/shared/states";
import { cn, formatDuration, timeAgo } from "@/lib/utils";
import { LANGUAGES } from "@/types";

export function ProblemPanel({ problem, tab, onTab, hintsShown, onRevealHint, solutionShown, onRequestSolution }: {
  problem: Problem;
  tab: string;
  onTab: (t: string) => void;
  hintsShown: number;
  onRevealHint: () => void;
  solutionShown: boolean;
  onRequestSolution: () => void;
}) {
  const status = useAppStore((s) => s.problemProgress[problem.id]?.status ?? "todo");
  const bookmarked = useAppStore((s) => s.bookmarks.includes(problem.id));
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const submissions = useAppStore((s) => s.submissions).filter((s) => s.problemId === problem.id);
  const note = useAppStore((s) => s.notes[problem.id] ?? "");
  const saveNote = useAppStore((s) => s.saveNote);
  const [solutionLang, setSolutionLang] = useState<"javascript" | "python">(problem.solution.python ? "python" : "javascript");
  const topic = topicsBySlug[problem.topic]!;
  const requireAuth = useRequireAuth();

  return (
    <Tabs value={tab} onValueChange={onTab} className="flex h-full flex-col">
      <TabsList className="shrink-0 px-3">
        <TabsTrigger value="description"><FileText /> Description</TabsTrigger>
        <TabsTrigger value="hints"><Lightbulb /> Hints</TabsTrigger>
        <TabsTrigger value="solution"><Sparkles /> Solution</TabsTrigger>
        <TabsTrigger value="submissions"><History /> Submissions{submissions.length > 0 && <span className="text-xs text-muted">({submissions.length})</span>}</TabsTrigger>
        <TabsTrigger value="notes"><NotebookPen /> Notes</TabsTrigger>
      </TabsList>
      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin">
        <TabsContent value="description" className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold leading-snug"><span className="text-muted tabular-nums">{problem.number}.</span> {problem.title}</h1>
            <button onClick={() => { if (requireAuth("Bookmarks are saved to your account.")) toggleBookmark(problem.id); }} className={cn("rounded-md p-1.5 hover:bg-surface-2", bookmarked ? "text-primary" : "text-muted")} aria-pressed={bookmarked} aria-label={bookmarked ? "Remove bookmark" : "Bookmark problem"}>
              {bookmarked ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={problem.difficulty} />
            <Link href={`/topics/${problem.topic}`}><Badge variant="primary">{topic.name}</Badge></Link>
            <Badge variant="outline">{problem.level}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted"><StatusIcon status={status} className="size-3.5" />{status === "solved" ? "Solved" : status === "attempted" ? "Attempted" : "Not started"}</span>
          </div>
          <RichText text={problem.description} className="mt-5 text-[15px]" />

          {problem.examples.map((ex, i) => (
            <div key={i} className="mt-4">
              <p className="mb-1.5 text-sm font-semibold">Example {i + 1}</p>
              <div className="rounded-[var(--radius-control)] border border-border bg-code p-3 font-mono text-[13px] leading-relaxed">
                <div className="whitespace-pre-wrap break-words"><span className="text-muted">Input: </span>{ex.input}</div>
                <div className="whitespace-pre-wrap break-words"><span className="text-muted">Output: </span>{ex.output}</div>
                {ex.explanation && <div className="mt-1 font-sans text-sm text-muted">{ex.explanation}</div>}
              </div>
            </div>
          ))}

          <p className="mb-1.5 mt-5 text-sm font-semibold">Constraints</p>
          <ul className="list-disc space-y-1 pl-5 font-mono text-[13px]">{problem.constraints.map((c) => <li key={c}>{c}</li>)}</ul>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[var(--radius-control)] border border-border p-3"><p className="text-xs text-muted">Expected time</p><p className="font-mono text-sm">{problem.timeComplexity}</p></div>
            <div className="rounded-[var(--radius-control)] border border-border p-3"><p className="text-xs text-muted">Expected space</p><p className="font-mono text-sm">{problem.spaceComplexity}</p></div>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            {problem.patterns.length > 0 && <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-muted">Patterns</span>{problem.patterns.map((p) => <Link key={p} href={`/patterns/${p}`}><Badge variant="outline" className="hover:text-foreground">{patternsBySlug[p]?.name ?? p}</Badge></Link>)}</div>}
            {problem.tags.length > 0 && <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-muted">Tags</span>{problem.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>}
            {problem.companies.length > 0 && <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-muted">Asked at</span>{problem.companies.map((c) => <Link key={c} href={`/companies/${c}`}><Badge variant="outline" className="hover:text-foreground">{companiesBySlug[c]?.name ?? c}</Badge></Link>)}</div>}
            {problem.prerequisites.length > 0 && <div className="flex flex-wrap items-center gap-1.5"><span className="mr-1 text-muted">Prerequisites</span>{problem.prerequisites.map((t) => <Link key={t} href={`/topics/${t}`} className="text-primary hover:underline">{topicsBySlug[t]?.name}</Link>)}</div>}
            <p className="text-xs text-muted">Acceptance {problem.acceptance.toFixed(1)}%, solved {problem.solvedCount.toLocaleString("en-IN")} times, about {problem.estimatedMinutes} minutes</p>
          </div>
        </TabsContent>

        <TabsContent value="hints" className="space-y-3 p-5">
          <p className="text-sm text-muted">Reveal hints one at a time. Try to make progress after each one before opening the next.</p>
          {problem.hints.map((h, i) => (
            <div key={i} className={cn("rounded-[var(--radius-control)] border p-4", i < hintsShown ? "border-primary/40 bg-primary-soft/40" : "border-dashed border-border-strong")}>
              <p className="mb-1 text-xs font-medium text-muted">Hint {i + 1}</p>
              {i < hintsShown ? <p className="text-sm">{h}</p> : i === hintsShown ? <Button size="sm" variant="outline" onClick={onRevealHint}><Lightbulb /> Reveal hint {i + 1}</Button> : <p className="flex items-center gap-1.5 text-sm text-muted"><Lock className="size-3.5" /> Reveal the previous hint first</p>}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="solution" className="p-5">
          {!solutionShown ? (
            <EmptyState icon={Eye} title="Solution hidden" description="Try the hints first. Viewing the solution before you solve the problem halves the XP you earn for it." action={{ label: "Show solution", onClick: onRequestSolution }} />
          ) : (
            <div className="space-y-5">
              <div><h3 className="font-semibold">Explanation</h3><p className="mt-1.5 text-sm leading-relaxed">{problem.explanation}</p></div>
              <div><h3 className="font-semibold">Approach</h3><ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm">{problem.approach.map((s) => <li key={s}>{s}</li>)}</ol></div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">Code</h3>
                  <div className="flex gap-1">
                    {(["javascript", "python"] as const).filter((l) => problem.solution[l]).map((l) => (
                      <button key={l} onClick={() => setSolutionLang(l)} className={cn("rounded-md px-2 py-1 text-xs", solutionLang === l ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2")}>{LANGUAGES.find((x) => x.id === l)!.label}</button>
                    ))}
                  </div>
                </div>
                <CodeBlock code={problem.solution[solutionLang] ?? problem.solution.javascript!} language={solutionLang} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[var(--radius-control)] border border-border p-3"><p className="text-xs text-muted">Time</p><p className="font-mono text-sm">{problem.timeComplexity}</p></div>
                <div className="rounded-[var(--radius-control)] border border-border p-3"><p className="text-xs text-muted">Space</p><p className="font-mono text-sm">{problem.spaceComplexity}</p></div>
              </div>
              {problem.alternatives.length > 0 && (
                <div>
                  <h3 className="font-semibold">Alternative approaches</h3>
                  <div className="mt-2 overflow-x-auto scroll-thin">
                    <table className="w-full min-w-[420px] text-sm">
                      <thead><tr className="border-b border-border text-left text-xs text-muted"><th className="py-2 pr-3 font-medium">Approach</th><th className="py-2 pr-3 font-medium">Time</th><th className="py-2 pr-3 font-medium">Space</th><th className="py-2 font-medium">Notes</th></tr></thead>
                      <tbody>
                        <tr className="border-b border-border/70"><td className="py-2 pr-3 font-medium">Optimal (above)</td><td className="py-2 pr-3 font-mono text-xs">{problem.timeComplexity}</td><td className="py-2 pr-3 font-mono text-xs">{problem.spaceComplexity}</td><td className="py-2 text-muted">Recommended in interviews.</td></tr>
                        {problem.alternatives.map((a) => <tr key={a.name} className="border-b border-border/70 last:border-0"><td className="py-2 pr-3 font-medium">{a.name}</td><td className="py-2 pr-3 font-mono text-xs">{a.time}</td><td className="py-2 pr-3 font-mono text-xs">{a.space}</td><td className="py-2 text-muted">{a.note}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="p-5">
          {submissions.length === 0 ? (
            <EmptyState icon={History} title="No submissions yet" description="Submit your code to see your history, runtime and memory here." />
          ) : (
            <ul className="divide-y divide-border">
              {submissions.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className={cn("w-36 font-medium", s.status === "Accepted" ? "text-success" : "text-danger")}>{s.status}</span>
                  <span className="w-20 text-muted">{LANGUAGES.find((l) => l.id === s.language)?.label}</span>
                  <span className="hidden w-28 text-muted tabular-nums sm:block">{s.status === "Accepted" ? `${s.runtimeMs} ms, ${s.memoryMb} MB` : `${s.passed}/${s.total} passed`}</span>
                  <span className="hidden text-muted md:block">{formatDuration(s.timeSpentSec)}</span>
                  {s.simulated && <Badge variant="outline" className="hidden lg:inline-flex">Simulated</Badge>}
                  <span className="ml-auto text-xs text-muted">{timeAgo(s.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="notes" className="p-5">
          <label htmlFor="problem-note" className="mb-2 block text-sm text-muted">Private notes for revision: key insight, edge cases, mistakes you made.</label>
          <Textarea id="problem-note" rows={12} defaultValue={note} onBlur={(e) => saveNote(problem.id, e.target.value)} placeholder="e.g. Store value → index before checking the complement? No: check first, then store." />
          <p className="mt-2 text-xs text-muted">Notes save when you click outside the box.</p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
