"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProgressData } from "@/types";
import { useAppStore, type AppState } from "@/store/app-store";
import { computeStats, type Stats } from "@/lib/engine/stats";
import { dayKey } from "@/lib/engine/dates";
import { pickDailyChallenge } from "@/lib/engine/recommend";
import { problemsById } from "@/data/problems";

export function useHydrated(): boolean {
  return useAppStore((s) => s.hydrated && s.initialized);
}

let lastState: AppState | null = null;
let lastStats: Stats | null = null;

/** Derived statistics, recomputed once per store change and shared across components. */
export function useStats(): Stats {
  const state = useAppStore();
  if (state !== lastState || !lastStats) {
    lastState = state;
    lastStats = computeStats(state);
  }
  return lastStats;
}

export function useProgress(): ProgressData & AppState {
  return useAppStore();
}

/** Re-renders at midnight so "today" stays correct in long sessions. */
export function useToday(): string {
  const [today, setToday] = useState(() => dayKey());
  useEffect(() => {
    const id = setInterval(() => setToday((t) => (t === dayKey() ? t : dayKey())), 60000);
    return () => clearInterval(id);
  }, []);
  return today;
}

export function useDailyChallenge() {
  const state = useAppStore();
  const stats = useStats();
  const today = useToday();
  const stored = state.dailyChallenges[today];
  const problem = useMemo(
    () => (stored ? problemsById[stored.problemId] : undefined) ?? pickDailyChallenge(state, stats.topicProgress, today),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stored?.problemId, today, state.initialized],
  );
  const setDailyChallenge = state.setDailyChallenge;
  const hydrated = state.hydrated;
  useEffect(() => {
    if (hydrated && !stored && problem) setDailyChallenge(today, problem.id);
  }, [hydrated, stored, problem, today, setDailyChallenge]);
  return { problem: problem!, completed: !!stored?.completed, today };
}

export function useDebounced<T>(value: T, ms = 150): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}
