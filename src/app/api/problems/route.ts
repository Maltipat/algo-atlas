import { NextResponse } from "next/server";
import type { Difficulty } from "@/types";
import { filterProblems, getAllProblems, type SortKey } from "@/services/problem-service";

/** GET /api/problems?topic=&difficulty=&company=&pattern=&q=&sort=&page=&pageSize= */
export function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const list = filterProblems(getAllProblems(), {
    q: sp.get("q") ?? undefined,
    topic: sp.get("topic") ?? undefined,
    difficulty: (sp.get("difficulty") as Difficulty) ?? undefined,
    company: sp.get("company") ?? undefined,
    pattern: sp.get("pattern") ?? undefined,
    sort: (sp.get("sort") as SortKey) ?? "number",
  });
  const pageSize = Math.min(100, Math.max(1, Number(sp.get("pageSize") ?? 25)));
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const items = list.slice((page - 1) * pageSize, page * pageSize).map(({ solution, testCases, starterCode, ...rest }) => {
    void solution; void starterCode;
    return { ...rest, testCaseCount: testCases.length };
  });
  return NextResponse.json({ total: list.length, page, pageSize, items });
}
