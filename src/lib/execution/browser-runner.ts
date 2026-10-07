import type { DesignSignature, FnSignature, Problem } from "@/types";
import { formatInput, formatValue } from "@/data/problems/builder";
import { hashString } from "@/lib/utils";
import { HARNESS_SOURCE } from "./harness-source";
import type { ExecutionResult, RunMode } from "./types";

interface HarnessOutput {
  results: { id: string; input: unknown[]; expected: unknown; actual: unknown; passed: boolean; ms: number }[];
  logs: string[];
  error: { type: "Compilation Error" | "Runtime Error"; message: string; testId?: string } | null;
}

const WORKER_SOURCE = `${HARNESS_SOURCE}
self.onmessage = function (e) {
  var out;
  try { out = runAll(e.data); }
  catch (err) { out = { results: [], logs: [], error: { type: "Runtime Error", message: String(err && err.message ? err.message : err) } }; }
  self.postMessage(out);
};`;

const TIME_LIMIT_MS = 4000;

/** Executes JavaScript submissions for real inside a sandboxed Web Worker. */
export function runInBrowser(problem: Problem, code: string, mode: RunMode): Promise<ExecutionResult> {
  const tests = mode === "run" ? problem.testCases.filter((t) => !t.hidden) : problem.testCases;
  const sig = problem.signature as FnSignature | DesignSignature;
  const kind = "methods" in sig ? "design" : "fn";
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    const worker = new Worker(url);
    const started = performance.now();
    const finish = (out: HarnessOutput | null) => {
      worker.terminate();
      URL.revokeObjectURL(url);
      const elapsed = performance.now() - started;
      const base: Omit<ExecutionResult, "status" | "cases" | "passed"> = {
        mode, language: "javascript", total: tests.length, runtimeMs: 0, memoryMb: 0, stdout: [], engine: "browser",
      };
      if (!out) {
        resolve({ ...base, status: "Time Limit Exceeded", cases: [], passed: 0, runtimeMs: Math.round(elapsed), error: `Execution exceeded ${TIME_LIMIT_MS / 1000}s. Look for an infinite loop or an algorithm that is too slow.` });
        return;
      }
      const cases = out.results.map((r, i) => ({
        id: r.id,
        input: formatInput(sig, r.input),
        expected: formatValue(r.expected),
        actual: formatValue(r.actual),
        passed: r.passed,
        hidden: tests[i]?.hidden ?? false,
        ms: r.ms,
      }));
      const passed = cases.filter((c) => c.passed).length;
      const runtime = Math.max(1, Math.round(cases.reduce((s, c) => s + c.ms, 0)));
      const memoryMb = Math.round((38 + (hashString(code) % 140) / 10 + tests.length * 0.2) * 10) / 10;
      if (out.error) {
        resolve({ ...base, status: out.error.type, cases, passed, runtimeMs: runtime, memoryMb, stdout: out.logs, error: out.error.message });
        return;
      }
      resolve({ ...base, status: passed === tests.length ? "Accepted" : "Wrong Answer", cases, passed, runtimeMs: runtime, memoryMb, stdout: out.logs });
    };
    const timer = setTimeout(() => finish(null), TIME_LIMIT_MS);
    worker.onmessage = (e: MessageEvent<HarnessOutput>) => { clearTimeout(timer); finish(e.data); };
    worker.onerror = (e) => { clearTimeout(timer); e.preventDefault(); finish({ results: [], logs: [], error: { type: "Compilation Error", message: e.message || "Script error" } }); };
    worker.postMessage({ code, sig, kind, tests, mode: problem.compare });
  });
}
