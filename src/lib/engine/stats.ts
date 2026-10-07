import type { Difficulty, ProgressData } from "@/types";
import { problems, problemsById } from "@/data/problems";
import { topics } from "@/data/topics";
import { pct } from "@/lib/utils";
import { computeStreaks } from "./streak";
import { computeTopicProgress, currentTopic, overallProgress } from "./progress";
import { dsaLevelLabel, levelFromXp } from "./xp";
import { addDays, dayKey, lastNDays, startOfWeek } from "./dates";

const DIFFS: Difficulty[] = ["Easy", "Medium", "Hard"];

export function computeStats(data: ProgressData, now = new Date()) {
  const topicProgress = computeTopicProgress(data);
  const solvedIds = Object.entries(data.problemProgress).filter(([, p]) => p.status === "solved").map(([id]) => id);
  const attempted = Object.values(data.problemProgress).filter((p) => p.attempts > 0).length;
  const byDifficulty = Object.fromEntries(DIFFS.map((d) => [d, { solved: 0, total: 0 }])) as Record<Difficulty, { solved: number; total: number }>;
  for (const p of problems) byDifficulty[p.difficulty].total++;
  for (const id of solvedIds) { const p = problemsById[id]; if (p) byDifficulty[p.difficulty].solved++; }
  const accepted = data.submissions.filter((s) => s.status === "Accepted").length;
  const successRate = pct(accepted, data.submissions.length);
  const streak = computeStreaks(data.activity, now);
  const topicsCompleted = topics.filter((t) => data.lessons[t.slug]?.completed).length;
  const studyMinutes = Object.values(data.activity).reduce((s, a) => s + a.minutes, 0);
  const overall = overallProgress(topicProgress);

  const interviewSet = problems.filter((p) => p.frequency >= 60);
  const interviewSolved = interviewSet.filter((p) => data.problemProgress[p.id]?.status === "solved").length;
  const mh = byDifficulty.Medium.solved + byDifficulty.Hard.solved, mhTotal = byDifficulty.Medium.total + byDifficulty.Hard.total;
  const readiness = Math.round(0.45 * pct(interviewSolved, interviewSet.length) + 0.35 * pct(mh, mhTotal) + 0.2 * successRate);

  const avgSolve: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  for (const d of DIFFS) {
    const times = solvedIds.map((id) => problemsById[id]).filter((p) => p?.difficulty === d).map((p) => data.problemProgress[p!.id]!.timeSpentSec).filter((t) => t > 0);
    avgSolve[d] = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 60) : 0;
  }

  const weekStart = startOfWeek(now);
  const weekKeys = Array.from({ length: 7 }, (_, i) => dayKey(addDays(weekStart, i)));
  const solvedThisWeek = weekKeys.reduce((s, k) => s + (data.activity[k]?.solved ?? 0), 0);
  const activeDaysThisWeek = weekKeys.filter((k) => { const a = data.activity[k]; return a && a.solved + a.attempted + a.reviews > 0; }).length;
  const reviewsThisWeek = weekKeys.reduce((s, k) => s + (data.activity[k]?.reviews ?? 0), 0);
  const today = data.activity[dayKey(now)];

  return {
    topicProgress,
    solved: solvedIds.length,
    totalProblems: problems.length,
    attempted,
    byDifficulty,
    successRate,
    acceptedSubmissions: accepted,
    totalSubmissions: data.submissions.length,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    activeToday: streak.activeToday,
    topicsCompleted,
    totalTopics: topics.length,
    studyMinutes,
    overall,
    readiness: Math.min(100, readiness),
    avgSolve,
    level: levelFromXp(data.xp),
    dsaLevel: dsaLevelLabel(overall, solvedIds.length),
    currentTopic: currentTopic(data, topicProgress),
    week: { solved: solvedThisWeek, activeDays: activeDaysThisWeek, reviews: reviewsThisWeek, keys: weekKeys },
    today: { solved: today?.solved ?? 0, xp: today?.xp ?? 0, minutes: today?.minutes ?? 0 },
  };
}

export type Stats = ReturnType<typeof computeStats>;

/** Time series helpers for analytics charts. */
export function solvedOverTime(data: ProgressData, days = 90, now = new Date()) {
  const keys = lastNDays(days, now);
  const before = Object.entries(data.activity).filter(([k]) => k < keys[0]!).reduce((s, [, a]) => s + a.solved, 0);
  let running = before;
  return keys.map((k) => {
    running += data.activity[k]?.solved ?? 0;
    return { date: k, label: k.slice(5), solved: data.activity[k]?.solved ?? 0, total: running };
  });
}

export function weeklySeries(data: ProgressData, weeks = 12, now = new Date()) {
  const start = startOfWeek(now);
  return Array.from({ length: weeks }, (_, i) => {
    const ws = addDays(start, -7 * (weeks - 1 - i));
    const keys = Array.from({ length: 7 }, (_, d) => dayKey(addDays(ws, d)));
    const acts = keys.map((k) => data.activity[k]);
    const subs = data.submissions.filter((s) => { const k = dayKey(new Date(s.createdAt)); return k >= keys[0]! && k <= keys[6]!; });
    const acc = subs.filter((s) => s.status === "Accepted").length;
    return {
      label: `${ws.getDate()} ${ws.toLocaleString("en-GB", { month: "short" })}`,
      solved: acts.reduce((s, a) => s + (a?.solved ?? 0), 0),
      minutes: acts.reduce((s, a) => s + (a?.minutes ?? 0), 0),
      accuracy: subs.length ? Math.round((acc / subs.length) * 100) : null,
      submissions: subs.length,
    };
  });
}
