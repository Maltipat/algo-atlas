import { NextResponse } from "next/server";
import type { Language } from "@/types";
import { getProblemBySlug } from "@/services/problem-service";
import { simulateExecution } from "@/lib/execution/mock-judge";
import type { ExecuteRequest, ExecutionResult } from "@/lib/execution/types";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/auth/routes";
import { sessionFromRequest } from "@/lib/auth/session";

export const runtime = "nodejs";

const LANGS: Language[] = ["cpp", "java", "python", "javascript"];

/**
 * POST /api/execute
 *
 * If EXECUTION_API_URL is set, the request is forwarded there with the problem's test cases:
 *   POST {EXECUTION_API_URL}  { language, code, mode, signature, tests, compare }
 * and the remote service must answer with an ExecutionResult (src/lib/execution/types.ts).
 * A thin adapter in front of Judge0 or Piston can generate per-language drivers from `signature`.
 *
 * Otherwise the simulated judge answers.
 */
export async function POST(req: Request) {
  // Checked here as well as in middleware: this handler must never execute code for
  // an unauthenticated caller, even if it is reached by some path that skips the gate.
  if (!(await sessionFromRequest(req))) {
    return NextResponse.json({ error: LOGIN_REQUIRED_MESSAGE }, { status: 401 });
  }

  let body: ExecuteRequest;
  try {
    body = (await req.json()) as ExecuteRequest;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }
  const problem = getProblemBySlug(body.slug);
  if (!problem) return NextResponse.json({ error: `Unknown problem: ${body.slug}` }, { status: 404 });
  if (!LANGS.includes(body.language)) return NextResponse.json({ error: `Unsupported language: ${body.language}` }, { status: 400 });
  if (typeof body.code !== "string" || body.code.length > 100_000) return NextResponse.json({ error: "Code must be a string under 100 KB." }, { status: 400 });
  const mode = body.mode === "submit" ? "submit" : "run";

  const remote = process.env.EXECUTION_API_URL;
  if (remote) {
    try {
      const tests = mode === "run" ? problem.testCases.filter((t) => !t.hidden) : problem.testCases;
      const res = await fetch(remote, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(process.env.EXECUTION_API_KEY ? { Authorization: `Bearer ${process.env.EXECUTION_API_KEY}` } : {}) },
        body: JSON.stringify({ language: body.language, code: body.code, mode, signature: problem.signature, tests, compare: problem.compare }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Execution API responded ${res.status}`);
      const result = (await res.json()) as ExecutionResult;
      return NextResponse.json({ ...result, engine: "remote" satisfies ExecutionResult["engine"] });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Execution API failed" }, { status: 502 });
    }
  }

  // Small delay so the UI's running state is visible, like a real judge.
  await new Promise((r) => setTimeout(r, mode === "submit" ? 650 : 350));
  return NextResponse.json(simulateExecution(problem, body.language, body.code, mode));
}
