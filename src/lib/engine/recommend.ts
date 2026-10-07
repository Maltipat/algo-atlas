import type { Difficulty, Problem, ProgressData } from "@/types";
import { problems, problemsById } from "@/data/problems";
import { topicsBySlug } from "@/data/topics";
import { hashString } from "@/lib/utils";
import type { TopicProgress } from "./progress";
import { currentTopic } from "./progress";
import { topicMastery } from "./weak";

export interface Recommendation {
  problem: Problem;
  score: number;
  reason: string;
}

function targetDifficulty(data: ProgressData): Difficulty {
  const recent = data.submissions.slice(0, 12);
  if (recent.length < 4) return "Easy";
  const rate = recent.filter((s) => s.status === "Accepted").length / recent.length;
  if (rate > 0.75) return "Medium";
  if (rate < 0.4) return "Easy";
  return "Medium";
}

export function recommendProblems(data: ProgressData, tp: Record<string, TopicProgress>, n = 6, exclude: string[] = []): Recommendation[] {
  const cur = currentTopic(data, tp);
  const mastery = new Map(topicMastery(data, tp).map((m) => [m.slug, m.mastery]));
  const target = targetDifficulty(data);
  const out: Recommendation[] = [];
  for (const p of problems) {
    if (exclude.includes(p.id) || data.problemProgress[p.id]?.status === "solved") continue;
    const t = topicsBySlug[p.topic]!;
    if (!tp[p.topic]?.unlocked) continue;
    let score = 0;
    let reason = "";
    const dist = Math.abs(t.order - cur.order);
    score += Math.max(0, 30 - dist * 4);
    if (p.topic === cur.slug) reason = `Next step in ${t.name}`;
    const m = mastery.get(p.topic);
    if (m !== undefined && m < 60) { score += 25 * (1 - m / 100); reason ||= `Strengthens a weak area: ${t.name}`; }
    if (p.difficulty === target) score += 15;
    if (target === "Easy" && p.difficulty === "Hard") score -= 20;
    if (data.problemProgress[p.id]?.status === "attempted") { score += 12; reason ||= "You attempted this before"; }
    score += p.frequency / 10;
    if (!reason) reason = p.frequency >= 70 ? "Frequently asked in interviews" : `Builds on ${t.name}`;
    out.push({ problem: p, score, reason });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, n);
}

export function nextProblemAfter(data: ProgressData, tp: Record<string, TopicProgress>, problemId: string): Problem | undefined {
  const solvedNow = problemsById[problemId];
  const recs = recommendProblems(data, tp, 12, [problemId]);
  return (recs.find((r) => r.problem.topic === solvedNow?.topic) ?? recs[0])?.problem;
}

/** Deterministic pick for a date, used when no daily challenge is stored yet. */
export function pickDailyChallenge(data: ProgressData, tp: Record<string, TopicProgress>, date: string): Problem {
  const solved = Object.values(data.problemProgress).filter((p) => p.status === "solved").length;
  const wanted: Difficulty = solved > 20 ? "Medium" : "Easy";
  const pool = problems.filter((p) => tp[p.topic]?.unlocked && p.difficulty === wanted && data.problemProgress[p.id]?.status !== "solved");
  const list = pool.length ? pool : problems;
  return list[hashString(date) % list.length]!;
}
