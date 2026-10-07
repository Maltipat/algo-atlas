import type { ProgressData } from "@/types";
import { achievements } from "@/data/achievements";
import { problems, problemsById } from "@/data/problems";
import { topics } from "@/data/topics";
import { computeStreaks } from "./streak";

const TREE = new Set(["binary-trees", "bst", "tree-traversal"]);
const GRAPH = new Set(topics.filter((t) => t.level === 4).map((t) => t.slug).concat("advanced-graphs"));

export interface AchievementProgress {
  current: number;
  target: number;
}

/** Progress toward every achievement. An achievement is earned when current >= target. */
export function achievementProgress(data: ProgressData): Record<string, AchievementProgress> {
  const solved = Object.entries(data.problemProgress).filter(([, p]) => p.status === "solved");
  const solvedProblems = solved.map(([id]) => problemsById[id]).filter(Boolean);
  const count = (pred: (slug: string) => boolean) => solvedProblems.filter((p) => pred(p!.topic)).length;
  const hard = solvedProblems.filter((p) => p!.difficulty === "Hard").length;
  const streak = computeStreaks(data.activity);
  const arrays = problems.filter((p) => p.topic === "arrays");
  const level1 = topics.filter((t) => t.level === 1);
  const fast = solved.some(([id, p]) => problemsById[id]?.difficulty !== "Easy" && p.timeSpentSec > 0 && p.timeSpentSec < 600);
  const clean = solved.some(([id, p]) => problemsById[id]?.difficulty !== "Easy" && p.attempts === 1 && !p.hintsUsed && !p.usedSolution);
  const reviews = Object.values(data.revision).reduce((s, r) => s + r.reviews, 0);
  const n = solved.length;
  return {
    "first-problem": { current: Math.min(n, 1), target: 1 },
    "ten-solved": { current: n, target: 10 },
    "fifty-solved": { current: n, target: 50 },
    "hundred-solved": { current: n, target: 100 },
    "two-hundred-solved": { current: n, target: 200 },
    "streak-3": { current: streak.longest, target: 3 },
    "streak-7": { current: streak.longest, target: 7 },
    "streak-30": { current: streak.longest, target: 30 },
    "first-hard": { current: Math.min(hard, 1), target: 1 },
    "ten-hard": { current: hard, target: 10 },
    "speed-solver": { current: fast ? 1 : 0, target: 1 },
    "no-hints": { current: clean ? 1 : 0, target: 1 },
    "array-ace": { current: arrays.filter((p) => data.problemProgress[p.id]?.status === "solved").length, target: arrays.length },
    "tree-explorer": { current: count((t) => TREE.has(t)), target: 15 },
    "graph-master": { current: count((t) => GRAPH.has(t)), target: 15 },
    "dp-master": { current: count((t) => t === "dynamic-programming"), target: 15 },
    "first-topic": { current: Math.min(1, topics.filter((t) => data.lessons[t.slug]?.completed).length), target: 1 },
    "level-1-complete": { current: level1.filter((t) => data.lessons[t.slug]?.completed).length, target: level1.length },
    "perfect-quiz": { current: Object.values(data.lessons).some((l) => l.quizScore === 100) ? 1 : 0, target: 1 },
    "revision-10": { current: reviews, target: 10 },
    "daily-5": { current: Object.values(data.dailyChallenges).filter((d) => d.completed).length, target: 5 },
    bookworm: { current: data.bookmarks.length, target: 10 },
    "mock-interview": { current: data.mockSessions.some((m) => m.endedAt) ? 1 : 0, target: 1 },
  };
}

export function newlyEarned(data: ProgressData): string[] {
  const prog = achievementProgress(data);
  return achievements.filter((a) => !data.achievements[a.id] && (prog[a.id]?.current ?? 0) >= (prog[a.id]?.target ?? Infinity)).map((a) => a.id);
}
