import type { ProgressData, RevisionItem, RevisionRating } from "@/types";
import { addDays, dayKey, daysBetween } from "./dates";

export const RATING_LABELS: Record<RevisionRating, string> = {
  easy: "Easy",
  practice: "Need practice",
  difficult: "Difficult",
  forgot: "Forgot",
};

/** A small SM-2-style scheduler. Returns the next state for a problem after a rating. */
export function scheduleReview(prev: RevisionItem | undefined, problemId: string, rating: RevisionRating, now = new Date()): RevisionItem {
  const base = prev?.intervalDays || 1;
  let interval: number;
  switch (rating) {
    case "easy": interval = Math.max(4, Math.round(base * 2.5)); break;
    case "practice": interval = Math.max(2, Math.round(base * 1.5)); break;
    case "difficult": interval = 1; break;
    case "forgot": interval = 0; break;
  }
  return {
    problemId,
    intervalDays: Math.min(interval, 120),
    dueDate: dayKey(addDays(now, interval)),
    lastRating: rating,
    reviews: (prev?.reviews ?? 0) + 1,
    lapses: (prev?.lapses ?? 0) + (rating === "forgot" ? 1 : 0),
    easyStreak: rating === "easy" ? (prev?.easyStreak ?? 0) + 1 : 0,
    lastReviewedAt: now.toISOString(),
  };
}

export type RevisionStatus = "due" | "scheduled" | "mastered" | "none";

export function isMastered(item: RevisionItem) {
  return item.intervalDays >= 21 || item.easyStreak >= 3;
}

export function revisionStatus(data: ProgressData, problemId: string, today = dayKey()): RevisionStatus {
  const item = data.revision[problemId];
  if (!item) return "none";
  if (isMastered(item)) return "mastered";
  return item.dueDate <= today ? "due" : "scheduled";
}

export function categorizeRevision(data: ProgressData, today = dayKey()) {
  const items = Object.values(data.revision);
  const dueToday = items.filter((i) => !isMastered(i) && i.dueDate <= today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const soon = items.filter((i) => !isMastered(i) && i.dueDate > today && daysBetween(today, i.dueDate) <= 7).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const later = items.filter((i) => !isMastered(i) && daysBetween(today, i.dueDate) > 7);
  const mastered = items.filter(isMastered);
  const failed = Object.entries(data.problemProgress)
    .filter(([id, p]) => (p.status === "attempted" && p.attempts > 0) || data.revision[id]?.lastRating === "forgot")
    .map(([id]) => id);
  return { dueToday, soon, later, mastered, failed };
}
