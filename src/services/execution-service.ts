import type { Language, Problem } from "@/types";
import { runInBrowser } from "@/lib/execution/browser-runner";
import type { ExecuteRequest, ExecutionResult, RunMode } from "@/lib/execution/types";

/**
 * Single entry point the editor uses to run code.
 *
 * - JavaScript on serialisable problems runs for real in a Web Worker.
 * - Everything else goes to POST /api/execute, which uses the simulated judge by default
 *   or forwards to EXECUTION_API_URL when it is configured (see src/app/api/execute/route.ts).
 */
export async function executeCode(problem: Problem, language: Language, code: string, mode: RunMode): Promise<ExecutionResult> {
  if (language === "javascript" && problem.runnable && typeof Worker !== "undefined") {
    return runInBrowser(problem, code, mode);
  }
  const body: ExecuteRequest = { slug: problem.slug, language, code, mode };
  const res = await fetch("/api/execute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Execution service returned ${res.status}`);
  }
  return (await res.json()) as ExecutionResult;
}
