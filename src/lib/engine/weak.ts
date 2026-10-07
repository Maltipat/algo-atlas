import type { ProgressData } from "@/types";
import { problemsById } from "@/data/problems";
import { topics, topicsBySlug } from "@/data/topics";
import type { TopicProgress } from "./progress";
import { topicProblems } from "./progress";

export interface TopicMastery {
  slug: string;
  name: string;
  mastery: number;
  accuracy: number;
  submissions: number;
}

/** Mastery blends accuracy, coverage and lesson progress, for topics the learner has started. */
export function topicMastery(data: ProgressData, tp: Record<string, TopicProgress>): TopicMastery[] {
  const subsByTopic = new Map<string, { ok: number; total: number }>();
  for (const s of data.submissions) {
    const p = problemsById[s.problemId];
    if (!p) continue;
    const e = subsByTopic.get(p.topic) ?? { ok: 0, total: 0 };
    e.total++; if (s.status === "Accepted") e.ok++;
    subsByTopic.set(p.topic, e);
  }
  const out: TopicMastery[] = [];
  for (const t of topics) {
    const s = subsByTopic.get(t.slug);
    const prog = tp[t.slug]!;
    if (!s && prog.lessonPercent === 0) continue;
    if (!prog.total && !s) continue;
    const accuracy = s ? s.ok / s.total : 0;
    const coverage = prog.total ? prog.solved / prog.total : 0;
    const mastery = Math.round(100 * (0.5 * accuracy + 0.3 * coverage + 0.2 * (prog.lessonPercent / 100)));
    out.push({ slug: t.slug, name: t.name, mastery, accuracy: Math.round(accuracy * 100), submissions: s?.total ?? 0 });
  }
  return out;
}

export function weakestTopics(data: ProgressData, tp: Record<string, TopicProgress>, n = 4) {
  return topicMastery(data, tp).filter((m) => m.submissions >= 2 && m.mastery < 65).sort((a, b) => a.mastery - b.mastery).slice(0, n);
}

export function strongestTopics(data: ProgressData, tp: Record<string, TopicProgress>, n = 4) {
  return topicMastery(data, tp).filter((m) => m.submissions >= 2).sort((a, b) => b.mastery - a.mastery).slice(0, n);
}

export interface NextStep {
  label: string;
  href: string;
}

export function recommendedSteps(data: ProgressData, tp: Record<string, TopicProgress>): NextStep[] {
  const steps: NextStep[] = [];
  for (const w of weakestTopics(data, tp, 3)) {
    const topic = topicsBySlug[w.slug]!;
    const prog = tp[w.slug]!;
    if (prog.lessonPercent < 100) {
      const concept = topic.concepts[Math.min(topic.concepts.length - 1, Math.floor((prog.lessonPercent / 100) * topic.concepts.length))];
      steps.push(prog.lessonPercent < 25
        ? { label: `Revise ${topic.name.toLowerCase()} basics`, href: `/learn/${topic.slug}` }
        : { label: `Learn ${concept?.title ?? topic.name}`, href: `/topics/${topic.slug}#${concept?.id ?? ""}` });
    }
    const unsolved = topicProblems(w.slug).filter((p) => data.problemProgress[p.id]?.status !== "solved");
    const medium = unsolved.filter((p) => p.difficulty === "Medium");
    if (medium.length >= 2) steps.push({ label: `Solve ${Math.min(3, medium.length)} medium ${topic.name} problems`, href: `/problems?topic=${topic.slug}&difficulty=Medium&status=unsolved` });
    else if (unsolved.length) steps.push({ label: `Practice ${Math.min(5, unsolved.length)} ${topic.name} problems`, href: `/problems?topic=${topic.slug}&status=unsolved` });
  }
  return steps.slice(0, 4);
}
