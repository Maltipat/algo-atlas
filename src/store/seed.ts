import type { Language, LessonProgress, ProgressData, RevisionItem, Submission, UserSettings } from "@/types";
import { problems, problemsBySlug } from "@/data/problems";
import { achievements } from "@/data/achievements";
import { topics } from "@/data/topics";
import { addDays, dayKey } from "@/lib/engine/dates";
import { achievementProgress } from "@/lib/engine/achievements";
import { XP_BY_DIFFICULTY, XP_LESSON_STEP, XP_REVIEW, XP_TOPIC_COMPLETE } from "@/lib/engine/xp";
import { seededRandom } from "@/lib/utils";

export const DEFAULT_SETTINGS: UserSettings = {
  preferredLanguage: "javascript",
  editorFontSize: 14,
  dailyGoal: 3,
  weeklyGoal: 15,
  unlockAllTopics: false,
  showTags: true,
  emailReminders: true,
};

export function emptyProgress(): ProgressData {
  return {
    initialized: true,
    user: null,
    signedOutUser: null,
    settings: { ...DEFAULT_SETTINGS },
    xp: 0,
    problemProgress: {},
    submissions: [],
    bookmarks: [],
    revision: {},
    lessons: {},
    activity: {},
    achievements: {},
    notifications: [],
    dailyChallenges: {},
    planEnrollments: {},
    mockSessions: [],
    studyLog: [],
    drafts: {},
    notes: {},
    dailyPlanChecks: {},
  };
}

/** How many problems (easiest first) the demo learner has solved per topic. */
const SOLVED_PER_TOPIC: Record<string, number> = {
  "programming-basics": 4, "basic-math": 6, arrays: 16, strings: 9, "basic-recursion": 2,
  "linked-list": 8, stack: 6, queue: 4, hashing: 7, "two-pointers": 6, "sliding-window": 4,
  "prefix-sum": 3, sorting: 4, "binary-search": 4,
  "binary-trees": 4, "tree-traversal": 4, bst: 2, heaps: 1, dfs: 2, bfs: 1, "dynamic-programming": 2, greedy: 2,
};

/** Problems the demo learner tried and failed, which shape the weak-area analysis. */
const FAILED: [string, number][] = [
  ["k-th-symbol-in-grammar", 2], ["sum-of-all-subset-xor-totals", 1], ["coin-change", 3], ["house-robber", 2],
  ["longest-increasing-subsequence", 2], ["0-1-knapsack", 1], ["rotting-oranges", 2], ["course-schedule", 1],
  ["word-ladder", 1], ["search-in-rotated-sorted-array", 1],
];

const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 } as const;
const LANGS: Language[] = ["python", "cpp", "javascript", "python", "cpp"];

export function createDemoProgress(now = new Date()): ProgressData {
  const rand = seededRandom(20260101);
  const data = emptyProgress();
  const iso = (d: Date, h = 19, m = 0) => { const r = new Date(d); r.setHours(h, m, Math.floor(rand() * 59), 0); return r.toISOString(); };

  data.user = {
    id: "u_demo", name: "Demo Learner", email: "demo@algoatlas.app", username: "demo_learner",
    bio: "Sample account with five months of generated history, so every screen has something to show. Create your own account to start from zero.",
    joinedAt: addDays(now, -150).toISOString(), avatarHue: 245,
  };

  // ---------------------------------------------------------- active days
  const activeOffsets: number[] = [];
  for (let off = 140; off >= 1; off--) {
    const inLongRun = off <= 74 && off >= 56; // a 19-day run
    const inCurrentRun = off <= 12;           // current streak, ends yesterday
    if (inLongRun || inCurrentRun || (off !== 55 && off !== 13 && rand() < 0.5)) activeOffsets.push(off);
  }

  // ---------------------------------------------------------- solved problems in roadmap order
  const solvedList = topics.flatMap((t) =>
    problems.filter((p) => p.topic === t.slug).sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] || a.number - b.number).slice(0, SOLVED_PER_TOPIC[t.slug] ?? 0),
  );
  const failedEvents = FAILED.map(([slug, n]) => ({ slug, n }));
  const perDay: string[][] = activeOffsets.map(() => []);
  solvedList.forEach((p, i) => perDay[Math.min(perDay.length - 1, Math.floor((i / solvedList.length) * perDay.length))]!.push(p.slug));
  // failed attempts happen in the second half of the timeline
  failedEvents.forEach((f, i) => perDay[Math.floor(perDay.length * 0.55) + ((i * 5) % Math.floor(perDay.length * 0.45))]!.push(`fail:${f.slug}:${f.n}`));

  let subId = 0;
  const submissions: Submission[] = [];
  activeOffsets.forEach((off, di) => {
    const day = addDays(now, -off);
    const key = dayKey(day);
    const act = (data.activity[key] = { solved: 0, attempted: 0, minutes: 10 + Math.floor(rand() * 25), xp: 0, reviews: 0 });
    let hour = 18 + Math.floor(rand() * 3);
    const items = perDay[di]!;
    if (!items.length) { act.reviews = 1 + Math.floor(rand() * 3); act.xp += act.reviews * XP_REVIEW; }
    for (const item of items) {
      const isFail = item.startsWith("fail:");
      const [, failSlug, failN] = isFail ? item.split(":") : [];
      const p = problemsBySlug[isFail ? failSlug! : item]!;
      const lang = LANGS[Math.floor(rand() * LANGS.length)]!;
      const minutes = p.difficulty === "Easy" ? 6 + rand() * 12 : p.difficulty === "Medium" ? 15 + rand() * 25 : 30 + rand() * 30;
      const fails = isFail ? Number(failN) : rand() < 0.25 ? 1 : 0;
      for (let k = 0; k < fails; k++) {
        submissions.push({ id: `s${++subId}`, problemId: p.id, language: lang, status: rand() < 0.75 ? "Wrong Answer" : "Runtime Error", runtimeMs: 0, memoryMb: 0, passed: Math.floor(rand() * (p.testCases.length - 1)), total: p.testCases.length, createdAt: iso(day, hour, 10 + k * 6), timeSpentSec: Math.round((minutes * 60) / (fails + 1)), simulated: lang !== "javascript" });
        act.attempted++;
      }
      const prev = data.problemProgress[p.id];
      if (isFail) {
        data.problemProgress[p.id] = { status: "attempted", attempts: (prev?.attempts ?? 0) + fails, lastActivityAt: iso(day, hour, 40), timeSpentSec: (prev?.timeSpentSec ?? 0) + Math.round(minutes * 60) };
      } else {
        const runtime = Math.round(lang === "cpp" ? 3 + rand() * 20 : lang === "python" ? 40 + rand() * 90 : 50 + rand() * 60);
        submissions.push({ id: `s${++subId}`, problemId: p.id, language: lang, status: "Accepted", runtimeMs: runtime, memoryMb: Math.round((lang === "cpp" ? 10 : 18 + rand() * 30) * 10) / 10, passed: p.testCases.length, total: p.testCases.length, createdAt: iso(day, hour, 45), timeSpentSec: Math.round(minutes * 60), simulated: lang !== "javascript" });
        const xp = XP_BY_DIFFICULTY[p.difficulty] + (fails === 0 ? 5 : 0);
        data.problemProgress[p.id] = { status: "solved", attempts: fails + 1, firstSolvedAt: iso(day, hour, 45), lastActivityAt: iso(day, hour, 45), bestRuntimeMs: runtime, timeSpentSec: Math.round(minutes * 60), hintsUsed: fails ? 1 : 0 };
        act.solved++; act.attempted++; act.xp += xp; data.xp += xp;
      }
      act.minutes += Math.round(minutes);
      hour = Math.min(23, hour + 1);
    }
  });
  data.submissions = submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // ---------------------------------------------------------- lessons
  const completedTopics = ["programming-basics", "time-complexity", "space-complexity", "arrays", "strings", "basic-math", "linked-list", "stack", "hashing", "two-pointers"];
  const partial: Record<string, number> = { "basic-recursion": 3, queue: 5, "sliding-window": 4, "prefix-sum": 3, sorting: 6, "dynamic-programming": 1, "binary-search": 3 };
  completedTopics.forEach((slug, i) => {
    const at = addDays(now, -130 + i * 9);
    const lesson: LessonProgress = { step: 8, completedSteps: [1, 2, 3, 4, 5, 6, 7, 8], quizScore: i % 3 === 0 ? 100 : 67, completed: true, completedAt: at.toISOString(), updatedAt: at.toISOString() };
    data.lessons[slug] = lesson;
    data.xp += XP_TOPIC_COMPLETE + 8 * XP_LESSON_STEP;
    data.studyLog.push({ id: `l-${slug}`, kind: "topic", label: `Completed ${topics.find((t) => t.slug === slug)!.name}`, href: `/topics/${slug}`, createdAt: at.toISOString() });
  });
  Object.entries(partial).forEach(([slug, steps], i) => {
    const at = slug === "binary-search" ? addDays(now, -1) : addDays(now, -40 + i * 4);
    data.lessons[slug] = { step: steps + 1, completedSteps: Array.from({ length: steps }, (_, k) => k + 1), completed: false, updatedAt: at.toISOString() };
    data.xp += steps * XP_LESSON_STEP;
    data.studyLog.push({ id: `p-${slug}`, kind: "lesson", label: `Studied ${topics.find((t) => t.slug === slug)!.name}`, href: `/learn/${slug}`, createdAt: at.toISOString() });
  });

  // ---------------------------------------------------------- revision queue
  const solvedIds = Object.entries(data.problemProgress).filter(([, p]) => p.status === "solved").map(([id]) => id);
  const reviewPlan: [number, number, RevisionItem["lastRating"], number][] = [
    // [count, dueOffsetDays, rating, interval]
    [4, 0, "practice", 3], [2, -2, "difficult", 1], [6, 3, "practice", 4], [6, 12, "easy", 10], [8, 30, "easy", 25], [2, 0, "forgot", 0],
  ];
  let ri = 0;
  for (const [count, due, rating, interval] of reviewPlan) {
    for (let k = 0; k < count && ri < solvedIds.length; k++, ri += 3) {
      const id = solvedIds[ri % solvedIds.length]!;
      data.revision[id] = { problemId: id, intervalDays: interval, dueDate: dayKey(addDays(now, due)), lastRating: rating, reviews: 1 + Math.floor(rand() * 3), lapses: rating === "forgot" ? 1 : 0, easyStreak: rating === "easy" ? (interval > 20 ? 3 : 1) : 0, lastReviewedAt: addDays(now, due - interval - 1).toISOString() };
    }
  }

  // ---------------------------------------------------------- misc
  for (let off = 9; off >= 1; off--) {
    const key = dayKey(addDays(now, -off));
    const p = problems[(off * 37) % problems.length]!;
    data.dailyChallenges[key] = { problemId: p.id, completed: off % 3 !== 0 && data.problemProgress[p.id]?.status === "solved" };
  }
  Object.values(data.dailyChallenges).forEach((d, i) => { if (i % 3 !== 2) d.completed = true; });
  data.bookmarks = ["trapping-rain-water", "median-of-two-sorted-arrays", "coin-change", "course-schedule", "longest-palindromic-substring", "lru-cache", "merge-k-sorted-lists", "word-ladder"].filter((s) => problemsBySlug[s]);
  data.planEnrollments["60-day-dsa"] = { slug: "60-day-dsa", startedAt: addDays(now, -40).toISOString(), completedDays: Array.from({ length: 33 }, (_, i) => i + 1).filter((d) => d % 9 !== 0) };
  const mockStart = addDays(now, -20);
  mockStart.setHours(20, 0, 0, 0);
  data.mockSessions.push({ id: "m1", company: "google", problemIds: ["koko-eating-bananas", "number-of-islands"], startedAt: mockStart.toISOString(), durationMin: 45, endedAt: new Date(mockStart.getTime() + 41 * 60000).toISOString(), solvedIds: ["koko-eating-bananas"] });

  // ---------------------------------------------------------- achievements earned so far
  const prog = achievementProgress(data);
  achievements.forEach((a, i) => {
    const p = prog[a.id]!;
    if (p.current >= p.target) {
      data.achievements[a.id] = addDays(now, -Math.max(2, 120 - i * 6)).toISOString();
      data.xp += a.xp;
    }
  });
  data.xp += Object.values(data.revision).reduce((s, r) => s + r.reviews * XP_REVIEW, 0);

  data.notifications = [
    { id: "n1", title: "12-day streak", body: "You have practised 12 days in a row. Solve one problem today to keep it going.", createdAt: addDays(now, 0).toISOString(), read: false, href: "/analytics" },
    { id: "n2", title: "6 problems due for revision", body: "Spaced repetition works best when you review on time.", createdAt: addDays(now, -0.2).toISOString(), read: false, href: "/revision" },
    { id: "n3", title: "Achievement unlocked: 7 Day Streak 🔥", body: "+70 XP", createdAt: addDays(now, -6).toISOString(), read: true, href: "/achievements" },
    { id: "n4", title: "Weekly summary", body: "Last week you solved 9 problems and improved accuracy in Hashing.", createdAt: addDays(now, -2).toISOString(), read: true, href: "/analytics" },
  ];
  data.settings = { ...DEFAULT_SETTINGS };
  return data;
}
