import type { ProgressData } from "@/types";
import { problemsById } from "@/data/problems";
import type { Stats } from "./stats";
import { dayKey } from "./dates";

const localDay = (iso: string) => dayKey(new Date(iso));

export interface PlanItem {
  id: string;
  label: string;
  detail: string;
  progress: number;
  target: number;
  href: string;
  manual: boolean;
}

export function buildDailyPlan(data: ProgressData, stats: Stats, today: string, dailyProblemId?: string): { items: PlanItem[]; percent: number } {
  const solvedToday = Object.entries(data.problemProgress)
    .filter(([, p]) => p.status === "solved" && p.firstSolvedAt && localDay(p.firstSolvedAt) === today)
    .map(([id]) => problemsById[id])
    .filter(Boolean);
  const easy = solvedToday.filter((p) => p!.difficulty === "Easy").length;
  const medium = solvedToday.filter((p) => p!.difficulty !== "Easy").length;
  const reviews = data.activity[today]?.reviews ?? 0;
  const checks = data.dailyPlanChecks[today] ?? [];
  const lessonToday = data.studyLog.some((e) => e.kind === "lesson" && localDay(e.createdAt) === today && e.href?.includes(stats.currentTopic.slug));
  const daily = dailyProblemId ? data.dailyChallenges[today]?.completed : false;
  const t = stats.currentTopic;
  const items: PlanItem[] = [
    { id: "learn", label: `Learn: ${t.name}`, detail: "30 min", progress: lessonToday || checks.includes("learn") ? 1 : 0, target: 1, href: `/learn/${t.slug}`, manual: true },
    { id: "easy", label: "Easy problems", detail: `${Math.min(easy, 2)} of 2`, progress: Math.min(easy, 2), target: 2, href: `/problems?topic=${t.slug}&difficulty=Easy&status=unsolved`, manual: false },
    { id: "medium", label: "Medium problems", detail: `${Math.min(medium, 2)} of 2`, progress: Math.min(medium, 2), target: 2, href: `/problems?topic=${t.slug}&difficulty=Medium&status=unsolved`, manual: false },
    { id: "revision", label: "Revision", detail: `20 min, ${Math.min(reviews, 3)} of 3 reviews`, progress: Math.min(reviews, 3), target: 3, href: "/revision", manual: false },
    { id: "daily", label: "Daily challenge", detail: daily ? "Done" : "1 problem", progress: daily ? 1 : 0, target: 1, href: dailyProblemId ? `/problems/${dailyProblemId}` : "/daily", manual: false },
  ];
  const percent = Math.round((items.reduce((s, i) => s + i.progress / i.target, 0) / items.length) * 100);
  return { items, percent };
}
