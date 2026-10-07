"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AppNotification, Language, Problem, ProblemProgress, ProgressData, RevisionRating, Submission, UserProfile, UserSettings,
} from "@/types";
import { achievementsById } from "@/data/achievements";
import { topicsBySlug } from "@/data/topics";
import type { ExecutionResult } from "@/lib/execution/types";
import { dayKey } from "@/lib/engine/dates";
import { newlyEarned } from "@/lib/engine/achievements";
import { scheduleReview } from "@/lib/engine/revision";
import { LESSON_STEPS } from "@/lib/engine/progress";
import { XP_LESSON_STEP, XP_QUIZ_PASS, XP_REVIEW, XP_TOPIC_COMPLETE, xpForSolve } from "@/lib/engine/xp";
import { createDemoProgress, emptyProgress } from "./seed";

export interface SubmissionOutcome {
  accepted: boolean;
  firstSolve: boolean;
  xpGained: number;
  newAchievements: string[];
  submission: Submission;
}

interface Actions {
  /** Load demo data for a brand-new browser. */
  ensureInitialized: () => void;
  loginDemo: () => void;
  login: (email: string) => boolean;
  signup: (name: string, email: string) => void;
  logout: () => void;
  resetProgress: () => void;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "bio" | "username" | "email">>) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;

  recordSubmission: (input: { problem: Problem; language: Language; result: ExecutionResult; timeSpentSec: number; usedSolution: boolean; hintsUsed: number }) => SubmissionOutcome;
  recordHint: (problemId: string, hintsUsed: number) => void;
  markSolutionViewed: (problemId: string) => void;
  rateRevision: (problemId: string, rating: RevisionRating) => string[];
  removeFromRevision: (problemId: string) => void;
  toggleBookmark: (problemId: string) => boolean;
  saveDraft: (problemId: string, language: Language, code: string) => void;
  saveNote: (problemId: string, note: string) => void;

  setLessonStep: (topic: string, step: number) => void;
  completeQuiz: (topic: string, score: number) => string[];
  completeTopic: (topic: string) => string[];

  setDailyChallenge: (date: string, problemId: string) => void;
  toggleDailyPlanItem: (date: string, item: string) => void;
  enrollPlan: (slug: string) => void;
  leavePlan: (slug: string) => void;
  togglePlanDay: (slug: string, day: number) => void;
  startMock: (company: string, problemIds: string[], durationMin: number) => string;
  endMock: (id: string) => string[];
  markNotificationsRead: () => void;
  clearNotifications: () => void;
}

export type AppState = ProgressData & Actions & { hydrated: boolean };

const MAX_SUBMISSIONS = 600;

function uid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** Apply newly earned achievements to a draft state: XP, notifications and timestamps. */
function withAchievements<T extends ProgressData>(draft: T): { next: T; earned: string[] } {
  const earned = newlyEarned(draft);
  if (!earned.length) return { next: draft, earned };
  const now = new Date().toISOString();
  const achievements = { ...draft.achievements };
  let xp = draft.xp;
  const notes: AppNotification[] = [];
  for (const id of earned) {
    const a = achievementsById[id]!;
    achievements[id] = now;
    xp += a.xp;
    notes.push({ id: uid("n"), title: `Achievement unlocked: ${a.name} ${a.emoji}`, body: `${a.description} +${a.xp} XP`, createdAt: now, read: false, href: "/achievements" });
  }
  return { next: { ...draft, achievements, xp, notifications: [...notes, ...draft.notifications].slice(0, 50) }, earned };
}

function bumpActivity(data: ProgressData, patch: Partial<{ solved: number; attempted: number; minutes: number; xp: number; reviews: number }>) {
  const key = dayKey();
  const cur = data.activity[key] ?? { solved: 0, attempted: 0, minutes: 0, xp: 0, reviews: 0 };
  return {
    ...data.activity,
    [key]: {
      solved: cur.solved + (patch.solved ?? 0),
      attempted: cur.attempted + (patch.attempted ?? 0),
      minutes: cur.minutes + (patch.minutes ?? 0),
      xp: cur.xp + (patch.xp ?? 0),
      reviews: cur.reviews + (patch.reviews ?? 0),
    },
  };
}

function touch(p: ProblemProgress | undefined): ProblemProgress {
  return p ? { ...p, lastActivityAt: new Date().toISOString() } : { status: "todo", attempts: 0, lastActivityAt: new Date().toISOString(), timeSpentSec: 0 };
}

function dataOf(s: AppState): ProgressData {
  const { initialized, user, signedOutUser, settings, xp, problemProgress, submissions, bookmarks, revision, lessons, activity, achievements, notifications, dailyChallenges, planEnrollments, mockSessions, studyLog, drafts, notes, dailyPlanChecks } = s;
  return { initialized, user, signedOutUser, settings, xp, problemProgress, submissions, bookmarks, revision, lessons, activity, achievements, notifications, dailyChallenges, planEnrollments, mockSessions, studyLog, drafts, notes, dailyPlanChecks };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...emptyProgress(),
      initialized: false,
      hydrated: false,

      ensureInitialized: () => {
        if (!get().initialized) set({ ...createDemoProgress() });
      },
      loginDemo: () => {
        const s = get();
        if (s.signedOutUser?.id === "u_demo") set({ user: s.signedOutUser, signedOutUser: null });
        else if (s.user?.id !== "u_demo") set({ ...createDemoProgress() });
      },
      login: (email) => {
        const s = get();
        const e = email.trim().toLowerCase();
        if (s.user && s.user.email.toLowerCase() === e) return true;
        if (s.signedOutUser && s.signedOutUser.email.toLowerCase() === e) { set({ user: s.signedOutUser, signedOutUser: null }); return true; }
        if (e === "aarav.mehta@example.com") { set({ ...createDemoProgress() }); return true; }
        return false;
      },
      signup: (name, email) => {
        const fresh = emptyProgress();
        set({
          ...fresh,
          user: { id: uid("u"), name, email, username: email.split("@")[0]!.replace(/[^a-z0-9_]/gi, "_").toLowerCase(), bio: "", joinedAt: new Date().toISOString(), avatarHue: Math.floor(Math.random() * 360) },
          notifications: [{ id: uid("n"), title: "Welcome to DSA Mastery", body: "Start with Programming Basics on the roadmap, or take the 30-Day plan.", createdAt: new Date().toISOString(), read: false, href: "/roadmap" }],
        });
      },
      logout: () => set({ signedOutUser: get().user, user: null }),
      resetProgress: () => {
        const user = get().user;
        set({ ...emptyProgress(), user, settings: get().settings });
      },
      updateProfile: (patch) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...patch } });
      },
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

      recordSubmission: ({ problem, language, result, timeSpentSec, usedSolution, hintsUsed }) => {
        const s = get();
        const now = new Date();
        const today = dayKey(now);
        const accepted = result.status === "Accepted";
        const prev = s.problemProgress[problem.id];
        const firstSolve = accepted && prev?.status !== "solved";
        const daily = s.dailyChallenges[today];
        const isDaily = daily?.problemId === problem.id && !daily.completed;
        const xpGained = firstSolve ? xpForSolve(problem.difficulty, { firstTry: (prev?.attempts ?? 0) === 0, usedSolution: usedSolution || !!prev?.usedSolution, daily: isDaily }) : 0;

        const submission: Submission = {
          id: uid("s"), problemId: problem.id, language, status: result.status,
          runtimeMs: result.runtimeMs, memoryMb: result.memoryMb, passed: result.passed, total: result.total,
          createdAt: now.toISOString(), timeSpentSec, simulated: result.engine !== "browser",
        };
        const attempts = (prev?.attempts ?? 0) + 1;
        const problemProgress = {
          ...s.problemProgress,
          [problem.id]: {
            status: accepted || prev?.status === "solved" ? ("solved" as const) : ("attempted" as const),
            attempts,
            firstSolvedAt: prev?.firstSolvedAt ?? (accepted ? now.toISOString() : undefined),
            lastActivityAt: now.toISOString(),
            bestRuntimeMs: accepted ? Math.min(prev?.bestRuntimeMs ?? Infinity, result.runtimeMs) : prev?.bestRuntimeMs,
            timeSpentSec: (prev?.timeSpentSec ?? 0) + timeSpentSec,
            usedSolution: prev?.usedSolution || usedSolution,
            hintsUsed: Math.max(prev?.hintsUsed ?? 0, hintsUsed),
          },
        };
        const revision = { ...s.revision };
        if (firstSolve && !revision[problem.id]) revision[problem.id] = scheduleReview(undefined, problem.id, "practice", now);
        if (!accepted && prev?.status !== "solved" && attempts >= 2 && !revision[problem.id]) revision[problem.id] = scheduleReview(undefined, problem.id, "forgot", now);

        let draft: ProgressData = {
          ...dataOf(s),
          problemProgress,
          revision,
          submissions: [submission, ...s.submissions].slice(0, MAX_SUBMISSIONS),
          xp: s.xp + xpGained,
          activity: bumpActivity(dataOf(s), { solved: firstSolve ? 1 : 0, attempted: 1, minutes: Math.round(timeSpentSec / 60), xp: xpGained }),
          dailyChallenges: isDaily && accepted ? { ...s.dailyChallenges, [today]: { ...daily!, completed: true } } : s.dailyChallenges,
        };
        const { next, earned } = withAchievements(draft);
        draft = next;
        set(draft);
        const achXp = earned.reduce((t, id) => t + (achievementsById[id]?.xp ?? 0), 0);
        return { accepted, firstSolve, xpGained: xpGained + achXp, newAchievements: earned, submission };
      },
      recordHint: (problemId, hintsUsed) => {
        const p = get().problemProgress[problemId];
        set({ problemProgress: { ...get().problemProgress, [problemId]: { ...touch(p), hintsUsed: Math.max(p?.hintsUsed ?? 0, hintsUsed) } } });
      },
      markSolutionViewed: (problemId) => {
        const p = get().problemProgress[problemId];
        set({ problemProgress: { ...get().problemProgress, [problemId]: { ...touch(p), usedSolution: true } } });
      },
      rateRevision: (problemId, rating) => {
        const s = get();
        const item = scheduleReview(s.revision[problemId], problemId, rating);
        const draft: ProgressData = {
          ...dataOf(s),
          revision: { ...s.revision, [problemId]: item },
          xp: s.xp + XP_REVIEW,
          activity: bumpActivity(dataOf(s), { reviews: 1, xp: XP_REVIEW, minutes: 5 }),
        };
        const { next, earned } = withAchievements(draft);
        set(next);
        return earned;
      },
      removeFromRevision: (problemId) => {
        const revision = { ...get().revision };
        delete revision[problemId];
        set({ revision });
      },
      toggleBookmark: (problemId) => {
        const s = get();
        const has = s.bookmarks.includes(problemId);
        const draft: ProgressData = { ...dataOf(s), bookmarks: has ? s.bookmarks.filter((b) => b !== problemId) : [problemId, ...s.bookmarks] };
        set(withAchievements(draft).next);
        return !has;
      },
      saveDraft: (problemId, language, code) => set({ drafts: { ...get().drafts, [`${problemId}:${language}`]: code } }),
      saveNote: (problemId, note) => set({ notes: { ...get().notes, [problemId]: note } }),

      setLessonStep: (topic, step) => {
        const s = get();
        const cur = s.lessons[topic] ?? { step: 1, completedSteps: [], completed: false };
        const completedSteps = [...new Set([...cur.completedSteps, ...Array.from({ length: Math.max(0, step - 1) }, (_, i) => i + 1)])].sort((a, b) => a - b);
        const gained = (completedSteps.length - cur.completedSteps.length) * XP_LESSON_STEP;
        const now = new Date().toISOString();
        const todayKey = dayKey();
        const loggedToday = s.studyLog.some((e) => e.kind === "lesson" && e.href === `/learn/${topic}` && dayKey(new Date(e.createdAt)) === todayKey);
        set({
          lessons: { ...s.lessons, [topic]: { ...cur, step: Math.min(step, LESSON_STEPS), completedSteps, updatedAt: now } },
          xp: s.xp + gained,
          activity: gained ? bumpActivity(dataOf(s), { minutes: 5, xp: gained }) : s.activity,
          studyLog: loggedToday ? s.studyLog : [{ id: uid("l"), kind: "lesson" as const, label: `Studied ${topicsBySlug[topic]?.name ?? topic}`, href: `/learn/${topic}`, createdAt: now }, ...s.studyLog].slice(0, 200),
        });
      },
      completeQuiz: (topic, score) => {
        const s = get();
        const cur = s.lessons[topic] ?? { step: 7, completedSteps: [], completed: false };
        const passed = score >= 60;
        const best = Math.max(cur.quizScore ?? 0, score);
        const draft: ProgressData = {
          ...dataOf(s),
          lessons: { ...s.lessons, [topic]: { ...cur, quizScore: best, updatedAt: new Date().toISOString() } },
          xp: s.xp + (passed && (cur.quizScore ?? 0) < 60 ? XP_QUIZ_PASS : 0),
          studyLog: [{ id: uid("q"), kind: "quiz" as const, label: `Scored ${score}% on the ${topicsBySlug[topic]?.name ?? topic} quiz`, href: `/learn/${topic}`, createdAt: new Date().toISOString() }, ...s.studyLog].slice(0, 200),
        };
        const { next, earned } = withAchievements(draft);
        set(next);
        return earned;
      },
      completeTopic: (topic) => {
        const s = get();
        const cur = s.lessons[topic] ?? { step: 8, completedSteps: [], completed: false };
        if (cur.completed) return [];
        const now = new Date().toISOString();
        const draft: ProgressData = {
          ...dataOf(s),
          lessons: { ...s.lessons, [topic]: { ...cur, step: LESSON_STEPS, completedSteps: Array.from({ length: LESSON_STEPS }, (_, i) => i + 1), completed: true, completedAt: now, updatedAt: now } },
          xp: s.xp + XP_TOPIC_COMPLETE,
          activity: bumpActivity(dataOf(s), { xp: XP_TOPIC_COMPLETE, minutes: 5 }),
          studyLog: [{ id: uid("t"), kind: "topic" as const, label: `Completed ${topicsBySlug[topic]?.name ?? topic}`, href: `/topics/${topic}`, createdAt: now }, ...s.studyLog].slice(0, 200),
        };
        const { next, earned } = withAchievements(draft);
        set(next);
        return earned;
      },

      setDailyChallenge: (date, problemId) => {
        if (get().dailyChallenges[date]) return;
        set({ dailyChallenges: { ...get().dailyChallenges, [date]: { problemId, completed: get().problemProgress[problemId]?.status === "solved" } } });
      },
      toggleDailyPlanItem: (date, item) => {
        const cur = get().dailyPlanChecks[date] ?? [];
        set({ dailyPlanChecks: { ...get().dailyPlanChecks, [date]: cur.includes(item) ? cur.filter((i) => i !== item) : [...cur, item] } });
      },
      enrollPlan: (slug) => {
        if (get().planEnrollments[slug]) return;
        set({ planEnrollments: { ...get().planEnrollments, [slug]: { slug, startedAt: new Date().toISOString(), completedDays: [] } } });
      },
      leavePlan: (slug) => {
        const planEnrollments = { ...get().planEnrollments };
        delete planEnrollments[slug];
        set({ planEnrollments });
      },
      togglePlanDay: (slug, day) => {
        const e = get().planEnrollments[slug];
        if (!e) return;
        const completedDays = e.completedDays.includes(day) ? e.completedDays.filter((d) => d !== day) : [...e.completedDays, day].sort((a, b) => a - b);
        set({ planEnrollments: { ...get().planEnrollments, [slug]: { ...e, completedDays } } });
      },
      startMock: (company, problemIds, durationMin) => {
        const id = uid("m");
        set({ mockSessions: [{ id, company, problemIds, startedAt: new Date().toISOString(), durationMin }, ...get().mockSessions] });
        return id;
      },
      endMock: (id) => {
        const s = get();
        const session = s.mockSessions.find((m) => m.id === id);
        if (!session || session.endedAt) return [];
        const solvedIds = session.problemIds.filter((pid) => s.submissions.some((sub) => sub.problemId === pid && sub.status === "Accepted" && sub.createdAt >= session.startedAt));
        const draft: ProgressData = { ...dataOf(s), mockSessions: s.mockSessions.map((m) => (m.id === id ? { ...m, endedAt: new Date().toISOString(), solvedIds } : m)) };
        const { next, earned } = withAchievements(draft);
        set(next);
        return earned;
      },
      markNotificationsRead: () => set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "dsa-mastery-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => dataOf(s),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);

export { dataOf };
