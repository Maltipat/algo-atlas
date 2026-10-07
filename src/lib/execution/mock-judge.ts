import type { Language, ParamType, Problem } from "@/types";
import { formatInput, formatValue } from "@/data/problems/builder";
import { hashString, seededRandom } from "@/lib/utils";
import type { ExecutionResult, RunMode } from "./types";

/**
 * Simulated judge for languages that cannot run in the browser (C++, Java, Python)
 * and for the few problems whose inputs cannot be serialised (cyclic lists, graphs).
 *
 * It applies static checks (unchanged starter code, unbalanced brackets, missing return)
 * and then reports the expected outputs. Results are marked engine: "simulated" and the
 * UI labels them so learners know they were not truly executed.
 */
const strip = (code: string) =>
  code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "").replace(/\s+/g, "");

function balanced(code: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const st: string[] = [];
  let quote: string | null = null;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i]!;
    if (quote) { if (ch === "\\") i++; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if ("([{".includes(ch)) st.push(ch);
    else if (ch in pairs) { if (st.pop() !== pairs[ch]) return false; }
  }
  return st.length === 0;
}

const DEFAULTS: Partial<Record<ParamType, unknown>> = { int: 0, long: 0, double: 0, bool: false, string: "", char: "" };

const RUNTIME_RANGE: Record<Language, [number, number]> = { cpp: [2, 18], java: [3, 40], python: [35, 140], javascript: [45, 110] };
const MEMORY_RANGE: Record<Language, [number, number]> = { cpp: [8, 16], java: [40, 48], python: [16, 19], javascript: [42, 56] };

export function simulateExecution(problem: Problem, language: Language, code: string, mode: RunMode): ExecutionResult {
  const tests = mode === "run" ? problem.testCases.filter((t) => !t.hidden) : problem.testCases;
  const rand = seededRandom(hashString(code + language));
  const range = (r: [number, number]) => r[0] + rand() * (r[1] - r[0]);
  const base = { mode, language, total: tests.length, stdout: [] as string[], engine: "simulated" as const };
  const sig = problem.signature;
  const returns: ParamType = "methods" in sig ? "void" : sig.returns;
  const fail = (status: ExecutionResult["status"], error: string): ExecutionResult => ({
    ...base, status, passed: 0, runtimeMs: 0, memoryMb: 0, error,
    cases: tests.slice(0, 1).map((t) => ({ id: t.id, input: formatInput(sig, t.input), expected: formatValue(t.expected), actual: formatValue(DEFAULTS[returns] ?? []), passed: false, hidden: t.hidden, ms: 0 })),
  });

  const body = strip(code), starter = strip(problem.starterCode[language]);
  if (!balanced(code)) return fail("Compilation Error", "Unbalanced brackets or an unterminated string literal.");
  if (body === starter || body.length - starter.length < 20) return fail("Wrong Answer", "Your function still returns the default value. Implement the solution body.");
  if (language !== "python" && returns !== "void" && !/return/.test(code)) return fail("Compilation Error", "Missing return statement.");
  if (language === "python" && returns !== "void" && !/return/.test(code)) return fail("Wrong Answer", "The function returns None. Add a return statement.");

  const cases = tests.map((t) => ({ id: t.id, input: formatInput(sig, t.input), expected: formatValue(t.expected), actual: formatValue(t.expected), passed: true, hidden: t.hidden, ms: Math.round(range(RUNTIME_RANGE[language]) / tests.length) }));
  return { ...base, status: "Accepted", cases, passed: cases.length, runtimeMs: Math.round(range(RUNTIME_RANGE[language])), memoryMb: Math.round(range(MEMORY_RANGE[language]) * 10) / 10 };
}
