import type { DayActivity } from "@/types";
import { addDays, dayKey, parseDay } from "./dates";

export const isActive = (a?: DayActivity) => !!a && a.solved + a.attempted + a.reviews > 0;

export function computeStreaks(activity: Record<string, DayActivity>, today = new Date()) {
  let current = 0;
  let cursor = isActive(activity[dayKey(today)]) ? today : addDays(today, -1);
  while (isActive(activity[dayKey(cursor)])) { current++; cursor = addDays(cursor, -1); }
  const days = Object.keys(activity).filter((k) => isActive(activity[k])).sort();
  let longest = 0, run = 0, prev: Date | null = null;
  for (const k of days) {
    const d = parseDay(k);
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  return { current, longest: Math.max(longest, current), activeToday: isActive(activity[dayKey(today)]) };
}
