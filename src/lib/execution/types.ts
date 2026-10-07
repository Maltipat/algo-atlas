import type { Language, SubmissionStatus } from "@/types";

export type RunMode = "run" | "submit";

export interface CaseResult {
  id: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  hidden: boolean;
  ms: number;
}

export interface ExecutionResult {
  status: SubmissionStatus;
  mode: RunMode;
  language: Language;
  cases: CaseResult[];
  passed: number;
  total: number;
  runtimeMs: number;
  memoryMb: number;
  stdout: string[];
  error?: string;
  /** "browser" = really executed in a Web Worker; "simulated" = mock judge; "remote" = external API */
  engine: "browser" | "simulated" | "remote";
}

export interface ExecuteRequest {
  slug: string;
  language: Language;
  code: string;
  mode: RunMode;
}
