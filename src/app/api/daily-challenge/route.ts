import { NextResponse } from "next/server";
import { problems } from "@/data/problems";
import { hashString } from "@/lib/utils";

/**
 * GET /api/daily-challenge?date=YYYY-MM-DD
 * The global daily challenge (same for everyone). The dashboard personalises it client-side
 * based on the learner's unlocked topics; in DB mode store the pick in DailyChallenge.
 */
export function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  const pool = problems.filter((p) => p.difficulty === "Medium");
  const p = pool[hashString(date) % pool.length]!;
  return NextResponse.json({ date, problem: { slug: p.slug, title: p.title, difficulty: p.difficulty, topic: p.topic, estimatedMinutes: p.estimatedMinutes } });
}
