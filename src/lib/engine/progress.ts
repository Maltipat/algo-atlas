import type { Difficulty, ProgressData, Topic } from "@/types";
import { problems } from "@/data/problems";
import { topics, topicsBySlug } from "@/data/topics";
import { pct } from "@/lib/utils";

export const LESSON_STEPS = 8;

export type TopicStatus = "not-started" | "learning" | "practicing" | "mastered";

export interface TopicProgress {
  slug: string;
  solved: number;
  total: number;
  byDifficulty: Record<Difficulty, { solved: number; total: number }>;
  lessonPercent: number;
  percent: number;
  status: TopicStatus;
  unlocked: boolean;
}

const problemsByTopic = new Map<string, typeof problems>();
for (const p of problems) problemsByTopic.set(p.topic, [...(problemsByTopic.get(p.topic) ?? []), p]);

export function topicProblems(slug: string) {
  return problemsByTopic.get(slug) ?? [];
}

function rawTopicProgress(data: ProgressData, topic: Topic): Omit<TopicProgress, "unlocked"> {
  const list = topicProblems(topic.slug);
  const byDifficulty: TopicProgress["byDifficulty"] = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } };
  let solved = 0;
  for (const p of list) {
    byDifficulty[p.difficulty].total++;
    if (data.problemProgress[p.id]?.status === "solved") { solved++; byDifficulty[p.difficulty].solved++; }
  }
  const lesson = data.lessons[topic.slug];
  const lessonPercent = lesson?.completed ? 100 : pct(lesson?.completedSteps.length ?? 0, LESSON_STEPS);
  const solvedPct = pct(solved, list.length);
  const percent = list.length ? Math.round(0.65 * solvedPct + 0.35 * lessonPercent) : lessonPercent;
  let status: TopicStatus = "not-started";
  if (percent >= 85 || (lesson?.completed && solvedPct >= 70)) status = "mastered";
  else if (solved > 0) status = "practicing";
  else if (lessonPercent > 0) status = "learning";
  return { slug: topic.slug, solved, total: list.length, byDifficulty, lessonPercent, percent, status };
}

export function computeTopicProgress(data: ProgressData): Record<string, TopicProgress> {
  const raw: Record<string, Omit<TopicProgress, "unlocked">> = {};
  for (const t of topics) raw[t.slug] = rawTopicProgress(data, t);
  const out: Record<string, TopicProgress> = {};
  for (const t of topics) {
    const r = raw[t.slug]!;
    const prereqsMet = t.prerequisites.every((p) => (raw[p]?.percent ?? 0) >= 30 || data.lessons[p]?.completed);
    out[t.slug] = { ...r, unlocked: data.settings.unlockAllTopics || prereqsMet || r.solved > 0 || r.lessonPercent > 0 };
  }
  return out;
}

export function overallProgress(tp: Record<string, TopicProgress>): number {
  const vals = Object.values(tp);
  return vals.length ? Math.round(vals.reduce((s, t) => s + t.percent, 0) / vals.length) : 0;
}

/** The topic the learner is currently working through. */
export function currentTopic(data: ProgressData, tp: Record<string, TopicProgress>): Topic {
  const inProgress = topics.filter((t) => {
    const l = data.lessons[t.slug];
    return l && !l.completed && l.completedSteps.length > 0;
  });
  if (inProgress.length) {
    return inProgress.reduce((best, t) => ((data.lessons[t.slug]!.updatedAt ?? "") > (data.lessons[best.slug]!.updatedAt ?? "") ? t : best));
  }
  return topics.find((t) => tp[t.slug]!.unlocked && tp[t.slug]!.status !== "mastered") ?? topics[topics.length - 1]!;
}

export function topicName(slug: string): string {
  return topicsBySlug[slug]?.name ?? slug;
}
