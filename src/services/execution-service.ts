import type { Language, Problem } from "@/types";
import { runInBrowser } from "@/lib/execution/browser-runner";
import type { ExecuteRequest, ExecutionResult, RunMode } from "@/lib/execution/types";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/auth/routes";

/** Thrown when the server rejects execution because the request carries no session. */
export class UnauthenticatedError extends Error {
  constructor(message: string = LOGIN_REQUIRED_MESSAGE) {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Single entry point the editor uses to run code.
 *
 * - JavaScript on serialisable problems runs for real in a Web Worker.
 * - Everything else goes to POST /api/execute, which uses the simulated judge by default
 *   or forwards to EXECUTION_API_URL when it is configured (see src/app/api/execute/route.ts).
 */
/** Asks the server whether this browser holds a valid session cookie. */
async function serverSaysAuthenticated(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return false;
    return ((await res.json()) as { authenticated?: boolean }).authenticated === true;
  } catch {
    return false;
  }
}

export async function executeCode(problem: Problem, language: Language, code: string, mode: RunMode): Promise<ExecutionResult> {
  if (language === "javascript" && problem.runnable && typeof Worker !== "undefined") {
    // The worker never reaches the server, so the session is confirmed with the
    // server here rather than trusting client state alone.
    if (!(await serverSaysAuthenticated())) throw new UnauthenticatedError();
    return runInBrowser(problem, code, mode);
  }
  const body: ExecuteRequest = { slug: problem.slug, language, code, mode };
  const res = await fetch("/api/execute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const detail = await res
      .clone()
      .json()
      .then((d: { error?: string }) => d?.error)
      .catch(() => undefined);
    if (res.status === 401) throw new UnauthenticatedError(detail ?? LOGIN_REQUIRED_MESSAGE);
    throw new Error(detail || (await res.text().catch(() => "")) || `Execution service returned ${res.status}`);
  }
  return (await res.json()) as ExecutionResult;
}
