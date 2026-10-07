import { NextResponse } from "next/server";
import { getProblemBySlug } from "@/services/problem-service";

/** GET /api/problems/:slug. Hidden test cases and solutions are withheld unless ?include=solution. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProblemBySlug(slug);
  if (!p) return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  const include = new URL(req.url).searchParams.get("include");
  return NextResponse.json({ ...p, testCases: p.testCases.filter((t) => !t.hidden), solution: include === "solution" ? p.solution : undefined });
}
