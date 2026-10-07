import type { Difficulty } from "@/types";

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = { Easy: 10, Medium: 25, Hard: 50 };
export const XP_FIRST_TRY_BONUS = 5;
export const XP_DAILY_CHALLENGE_BONUS = 20;
export const XP_REVIEW = 5;
export const XP_LESSON_STEP = 5;
export const XP_TOPIC_COMPLETE = 50;
export const XP_QUIZ_PASS = 15;

export function xpForSolve(d: Difficulty, opts: { firstTry: boolean; usedSolution: boolean; daily: boolean }): number {
  let xp = XP_BY_DIFFICULTY[d];
  if (opts.usedSolution) xp = Math.round(xp / 2);
  if (opts.firstTry && !opts.usedSolution) xp += XP_FIRST_TRY_BONUS;
  if (opts.daily) xp += XP_DAILY_CHALLENGE_BONUS;
  return xp;
}

/** Level n → n+1 costs 100 + 50·(n-1) XP. */
export function levelFromXp(xp: number) {
  let level = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; level++; need = 100 + (level - 1) * 50; }
  return { level, intoLevel: rest, needed: need, percent: Math.round((rest / need) * 100) };
}

export function dsaLevelLabel(overall: number, solved: number): "Beginner" | "Intermediate" | "Advanced" | "Interview Ready" {
  if (overall >= 70 && solved >= 150) return "Interview Ready";
  if (overall >= 40 && solved >= 80) return "Advanced";
  if (overall >= 15 && solved >= 25) return "Intermediate";
  return "Beginner";
}
