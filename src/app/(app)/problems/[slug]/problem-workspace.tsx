"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight, ChevronLeft, CircleCheck, CircleX, Clock, Cpu, Eye, Lightbulb, LoaderCircle, MemoryStick, Play, RotateCcw, Send, Terminal, Zap,
} from "lucide-react";
import type { Language, RevisionRating } from "@/types";
import { LANGUAGES } from "@/types";
import { problemsBySlug } from "@/data/problems";
import { achievementsById } from "@/data/achievements";
import { executeCode } from "@/services/execution-service";
import type { ExecutionResult } from "@/lib/execution/types";
import { nextProblemAfter } from "@/lib/engine/recommend";
import { RATING_LABELS } from "@/lib/engine/revision";
import { useAppStore, type SubmissionOutcome } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { CodeEditor } from "@/components/problems/code-editor";
import { DifficultyText } from "@/components/shared/difficulty";
import { cn, formatDuration } from "@/lib/utils";
import { ProblemPanel } from "./problem-panel";

const RATINGS: { id: RevisionRating; hint: string; className: string }[] = [
  { id: "easy", hint: "Review in 4+ days", className: "hover:border-success hover:bg-success-soft" },
  { id: "practice", hint: "Review in 2 days", className: "hover:border-primary hover:bg-primary-soft" },
  { id: "difficult", hint: "Review tomorrow", className: "hover:border-warning hover:bg-warning-soft" },
  { id: "forgot", hint: "Review today", className: "hover:border-danger hover:bg-danger-soft" },
];

function useElapsed(resetKey: number) {
  const start = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => { start.current = Date.now(); }, [resetKey]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return { seconds: Math.max(0, Math.round((now - start.current) / 1000)), take: () => { const s = Math.min(7200, Math.round((Date.now() - start.current) / 1000)); start.current = Date.now(); return s; } };
}

export function ProblemWorkspace({ slug }: { slug: string }) {
  const problem = problemsBySlug[slug]!;
  const state = useAppStore();
  const stats = useStats();
  const settings = state.settings;
  const pp = state.problemProgress[problem.id];

  const [language, setLanguage] = useState<Language>(settings.preferredLanguage);
  const draftKey = `${problem.id}:${language}`;
  const [code, setCode] = useState(() => state.drafts[`${problem.id}:${settings.preferredLanguage}`] ?? problem.starterCode[settings.preferredLanguage]);
  const [tab, setTab] = useState("description");
  const [consoleTab, setConsoleTab] = useState("cases");
  const [mobileView, setMobileView] = useState<"problem" | "code">("problem");
  const [running, setRunning] = useState<"run" | "submit" | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [hintsShown, setHintsShown] = useState(pp?.hintsUsed ?? 0);
  const [solutionShown, setSolutionShown] = useState(!!pp?.usedSolution || pp?.status === "solved");
  const [confirmSolution, setConfirmSolution] = useState(false);
  const [outcome, setOutcome] = useState<(SubmissionOutcome & { result: ExecutionResult }) | null>(null);
  const [rated, setRated] = useState<RevisionRating | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  const timer = useElapsed(timerKey);

  // Reset per-problem UI when navigating between problems.
  useEffect(() => {
    const p = useAppStore.getState().problemProgress[problem.id];
    setLanguage(useAppStore.getState().settings.preferredLanguage);
    setHintsShown(p?.hintsUsed ?? 0);
    setSolutionShown(!!p?.usedSolution || p?.status === "solved");
    setResult(null);
    setOutcome(null);
    setTab("description");
    setTimerKey((k) => k + 1);
  }, [problem.id]);

  // Load the draft (or starter code) whenever the language or problem changes.
  useEffect(() => {
    setCode(useAppStore.getState().drafts[draftKey] ?? problem.starterCode[language]);
  }, [draftKey, language, problem]);

  // Persist drafts shortly after typing stops.
  useEffect(() => {
    const id = setTimeout(() => {
      if (code !== problem.starterCode[language]) useAppStore.getState().saveDraft(problem.id, language, code);
    }, 500);
    return () => clearTimeout(id);
  }, [code, language, problem]);

  const willRunInBrowser = language === "javascript" && problem.runnable;

  const execute = useCallback(async (mode: "run" | "submit") => {
    if (running) return;
    setRunning(mode);
    setConsoleTab("result");
    setMobileView("code");
    try {
      const res = await executeCode(problem, language, code, mode);
      setResult(res);
      if (mode === "submit") {
        const out = useAppStore.getState().recordSubmission({ problem, language, result: res, timeSpentSec: timer.take(), usedSolution: solutionShown, hintsUsed: hintsShown });
        out.newAchievements.forEach((id) => { const a = achievementsById[id]; if (a) toast.success(`Achievement unlocked: ${a.name} ${a.emoji}`, { description: `+${a.xp} XP` }); });
        if (out.accepted) { setRated(null); setOutcome({ ...out, result: res }); }
        else toast.error(res.status, { description: res.error ?? `${res.passed} of ${res.total} test cases passed. The attempt was recorded.` });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast.error("Could not run your code", { description: message });
    } finally {
      setRunning(null);
    }
  }, [running, problem, language, code, timer, solutionShown, hintsShown]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); void execute(e.shiftKey ? "submit" : "run"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [execute]);

  const revealHint = () => {
    if (hintsShown >= problem.hints.length) { toast("No more hints", { description: "Open the Solution tab if you are stuck." }); return; }
    const n = hintsShown + 1;
    setHintsShown(n);
    state.recordHint(problem.id, n);
    setTab("hints");
    setMobileView("problem");
  };
  const showSolution = () => {
    setSolutionShown(true);
    setConfirmSolution(false);
    if (pp?.status !== "solved") state.markSolutionViewed(problem.id);
    setTab("solution");
    setMobileView("problem");
  };
  const requestSolution = () => (solutionShown ? (setTab("solution"), setMobileView("problem")) : setConfirmSolution(true));

  const next = useMemo(() => (outcome ? nextProblemAfter(state, stats.topicProgress, problem.id) : undefined), [outcome, problem.id, state, stats.topicProgress]);
  const visibleTests = problem.testCases.filter((t) => !t.hidden);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3">
        <Link href="/problems" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"><ChevronLeft className="size-4" /> Problems</Link>
        <span className="hidden truncate text-sm font-medium md:block">{problem.number}. {problem.title}</span>
        <DifficultyText difficulty={problem.difficulty} className="hidden text-xs md:block" />
        <div className="ml-auto flex items-center gap-1 rounded-[var(--radius-control)] bg-surface-2 p-0.5 lg:hidden" role="tablist" aria-label="View">
          {(["problem", "code"] as const).map((v) => <button key={v} role="tab" aria-selected={mobileView === v} onClick={() => setMobileView(v)} className={cn("rounded-md px-3 py-1 text-xs font-medium capitalize", mobileView === v ? "bg-surface shadow-sm" : "text-muted")}>{v}</button>)}
        </div>
        <Tooltip content="Time on this attempt"><span className="ml-auto hidden items-center gap-1 text-xs tabular-nums text-muted lg:inline-flex"><Clock className="size-3.5" /> {formatDuration(timer.seconds)}</span></Tooltip>
      </div>

      <div className="flex min-h-0 flex-1">
        <section className={cn("min-h-0 w-full border-r border-border bg-surface lg:block lg:w-[45%] lg:max-w-[720px]", mobileView === "problem" ? "block" : "hidden")} aria-label="Problem">
          <ProblemPanel problem={problem} tab={tab} onTab={setTab} hintsShown={hintsShown} onRevealHint={revealHint} solutionShown={solutionShown} onRequestSolution={requestSolution} />
        </section>

        <section className={cn("min-h-0 min-w-0 flex-1 flex-col lg:flex", mobileView === "code" ? "flex" : "hidden")} aria-label="Code">
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-surface px-3">
            <Select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="h-8 text-xs">
              {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </Select>
            {willRunInBrowser ? (
              <Tooltip content="JavaScript runs for real in a sandboxed Web Worker against every test case."><Badge variant="success"><Zap className="size-3" /> Live execution</Badge></Tooltip>
            ) : (
              <Tooltip content="This language uses the simulated judge. Connect a real execution API via EXECUTION_API_URL (see README). Switch to JavaScript for real execution."><Badge variant="outline"><Cpu className="size-3" /> Simulated judge</Badge></Tooltip>
            )}
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => { setCode(problem.starterCode[language]); state.saveDraft(problem.id, language, problem.starterCode[language]); toast("Code reset to the starter template"); }}><RotateCcw /> <span className="hidden sm:inline">Reset</span></Button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-code scroll-thin">
            <CodeEditor value={code} onChange={setCode} language={language} fontSize={settings.editorFontSize} />
          </div>

          <div className="flex h-[38%] min-h-44 shrink-0 flex-col border-t border-border bg-surface">
            <Tabs value={consoleTab} onValueChange={setConsoleTab} className="flex min-h-0 flex-1 flex-col">
              <TabsList className="shrink-0 px-3">
                <TabsTrigger value="cases"><Terminal /> Test cases</TabsTrigger>
                <TabsTrigger value="result">{result ? (result.status === "Accepted" ? <CircleCheck className="text-success" /> : <CircleX className="text-danger" />) : <Play />} Result</TabsTrigger>
              </TabsList>
              <div className="min-h-0 flex-1 overflow-y-auto p-3 scroll-thin">
                <TabsContent value="cases" className="space-y-2">
                  {visibleTests.map((t, i) => (
                    <div key={t.id} className="rounded-md border border-border bg-code p-2.5 font-mono text-xs">
                      <p className="mb-1 font-sans text-xs font-medium text-muted">Case {i + 1}</p>
                      <div className="break-words"><span className="text-muted">Input: </span>{problem.examples[i]?.input}</div>
                      <div className="break-words"><span className="text-muted">Expected: </span>{problem.examples[i]?.output}</div>
                    </div>
                  ))}
                  <p className="text-xs text-muted">Run checks these {visibleTests.length} cases. Submit also runs {problem.testCases.length - visibleTests.length} hidden cases.</p>
                </TabsContent>
                <TabsContent value="result">
                  {running ? (
                    <p className="flex items-center gap-2 text-sm text-muted"><LoaderCircle className="size-4 animate-spin" /> {running === "run" ? "Running sample cases…" : "Judging all test cases…"}</p>
                  ) : !result ? (
                    <p className="text-sm text-muted">Run your code to see output here. Shortcut: Ctrl+Enter to run, Ctrl+Shift+Enter to submit.</p>
                  ) : (
                    <ResultView result={result} />
                  )}
                </TabsContent>
              </div>
            </Tabs>
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border px-3 py-2">
              <Button variant="ghost" size="sm" onClick={revealHint}><Lightbulb /> Get Hint</Button>
              <Button variant="ghost" size="sm" onClick={requestSolution}><Eye /> Show Solution</Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => void execute("run")} disabled={!!running}>{running === "run" ? <LoaderCircle className="animate-spin" /> : <Play />} Run</Button>
                <Button variant="success" size="sm" onClick={() => void execute("submit")} disabled={!!running}>{running === "submit" ? <LoaderCircle className="animate-spin" /> : <Send />} Submit</Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={confirmSolution} onOpenChange={setConfirmSolution}>
        <DialogContent>
          <DialogTitle>Show the solution?</DialogTitle>
          <DialogDescription>You have used {hintsShown} of {problem.hints.length} hints. If you view the solution before solving, this problem earns half XP and is scheduled for revision sooner.</DialogDescription>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmSolution(false)}>Keep trying</Button>
            {hintsShown < problem.hints.length && <Button variant="outline" onClick={() => { setConfirmSolution(false); revealHint(); }}>Get a hint instead</Button>}
            <Button onClick={showSolution}>Show solution</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!outcome} onOpenChange={(o) => !o && setOutcome(null)}>
        <DialogContent className="max-w-md">
          {outcome && (
            <>
              <div className="flex flex-col items-center text-center">
                <span className="grid size-14 animate-pop place-items-center rounded-full bg-success-soft text-success"><CircleCheck className="size-8" /></span>
                <DialogTitle className="mt-3 text-xl">Accepted</DialogTitle>
                <DialogDescription>
                  {outcome.firstSolve ? `First solve of ${problem.title}.` : `You solved ${problem.title} again.`}
                  {outcome.result.engine === "simulated" && " Judged by the simulated runner."}
                </DialogDescription>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border border-border p-2"><p className="text-xs text-muted">Runtime</p><p className="font-semibold tabular-nums">{outcome.result.runtimeMs} ms</p></div>
                <div className="rounded-md border border-border p-2"><p className="text-xs text-muted">Memory</p><p className="font-semibold tabular-nums">{outcome.result.memoryMb} MB</p></div>
                <div className="rounded-md border border-border p-2"><p className="text-xs text-muted">XP</p><p className="font-semibold tabular-nums text-primary">+{outcome.xpGained}</p></div>
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium">How did that feel?</p>
                <p className="text-xs text-muted">Your rating schedules this problem for spaced revision.</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {RATINGS.map((r) => (
                    <button key={r.id} onClick={() => { state.rateRevision(problem.id, r.id); setRated(r.id); toast.success(`Scheduled: ${r.hint.toLowerCase()}`); }} className={cn("rounded-md border px-3 py-2 text-left text-sm transition-colors", rated === r.id ? "border-primary bg-primary-soft" : "border-border", r.className)}>
                      <span className="block font-medium">{RATING_LABELS[r.id]}</span><span className="block text-xs text-muted">{r.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOutcome(null)}>Stay here</Button>
                {next && <Link href={`/problems/${next.slug}`} className="flex-1" onClick={() => setOutcome(null)}><Button className="w-full">Next: {next.title.length > 18 ? next.title.slice(0, 17) + "…" : next.title} <ArrowRight /></Button></Link>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResultView({ result }: { result: ExecutionResult }) {
  const ok = result.status === "Accepted";
  const firstFail = result.cases.find((c) => !c.passed);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("text-lg font-semibold", ok ? "text-success" : "text-danger")}>{ok && result.mode === "run" ? "Sample cases passed" : result.status}</span>
        <span className="text-sm text-muted">{result.passed}/{result.total} cases passed</span>
        {ok && <span className="inline-flex items-center gap-1 text-sm text-muted"><Clock className="size-3.5" /> {result.runtimeMs} ms</span>}
        {ok && <span className="inline-flex items-center gap-1 text-sm text-muted"><MemoryStick className="size-3.5" /> {result.memoryMb} MB</span>}
        {result.engine === "simulated" && <Badge variant="outline">Simulated</Badge>}
      </div>
      {result.error && <pre className="whitespace-pre-wrap rounded-md border border-danger/40 bg-danger-soft p-3 font-mono text-xs text-danger">{result.error}</pre>}
      <div className="space-y-2">
        {result.cases.filter((c) => !c.hidden || !c.passed).slice(0, 6).map((c, i) => (
          <details key={c.id} open={c === firstFail || (i === 0 && !firstFail)} className="rounded-md border border-border bg-code">
            <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-medium">
              {c.passed ? <CircleCheck className="size-3.5 text-success" /> : <CircleX className="size-3.5 text-danger" />}
              {c.hidden ? "Hidden case" : `Case ${result.cases.indexOf(c) + 1}`}<span className="ml-auto font-normal text-muted">{c.ms.toFixed(1)} ms</span>
            </summary>
            <div className="space-y-1 border-t border-border px-3 py-2 font-mono text-xs">
              <div className="break-words"><span className="text-muted">Input: </span>{c.input}</div>
              <div className="break-words"><span className="text-muted">Expected: </span>{c.expected}</div>
              <div className={cn("break-words", !c.passed && "text-danger")}><span className="text-muted">Output: </span>{c.actual}</div>
            </div>
          </details>
        ))}
      </div>
      {result.stdout.length > 0 && (
        <div><p className="mb-1 text-xs font-medium text-muted">Stdout</p><pre className="max-h-32 overflow-auto rounded-md border border-border bg-code p-2 font-mono text-xs scroll-thin">{result.stdout.join("\n")}</pre></div>
      )}
    </div>
  );
}
