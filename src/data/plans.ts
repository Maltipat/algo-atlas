import type { Difficulty, LearningPath, PlanDay, Problem } from "@/types";
import { problems } from "./problems";
import { topicsBySlug } from "./topics";

interface PlanSpec {
  slug: string;
  name: string;
  description: string;
  audience: string;
  durationDays: number;
  topics: string[];
  difficulties: Difficulty[];
  /** prefer problems asked by many companies */
  byFrequency?: boolean;
}

const DIFF_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

function buildDays(spec: PlanSpec): PlanDay[] {
  const order = new Map(spec.topics.map((t, i) => [t, i]));
  let pool: Problem[] = problems.filter((p) => order.has(p.topic) && spec.difficulties.includes(p.difficulty));
  if (spec.byFrequency) {
    // keep the most interview-relevant problems per topic, at most 8
    const byTopic = new Map<string, Problem[]>();
    for (const p of pool) byTopic.set(p.topic, [...(byTopic.get(p.topic) ?? []), p]);
    pool = [...byTopic.values()].flatMap((list) => list.sort((a, b) => b.frequency - a.frequency).slice(0, 8));
  }
  pool.sort((a, b) => order.get(a.topic)! - order.get(b.topic)! || DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);

  const revisionDays = Math.floor(spec.durationDays / 7);
  const studyDays = spec.durationDays - revisionDays;
  const days: PlanDay[] = [];
  let cursor = 0;
  let studyIndex = 0;
  const recent: string[] = [];
  for (let day = 1; day <= spec.durationDays; day++) {
    if (day % 7 === 0) {
      const review = recent.splice(0).filter((_, i) => i % 3 === 0).slice(0, 4);
      days.push({ day, title: "Weekly revision and timed practice", topics: [], problems: review, minutes: 60 });
      continue;
    }
    studyIndex++;
    const end = Math.round((studyIndex / studyDays) * pool.length);
    const chunk = pool.slice(cursor, end);
    cursor = end;
    const dayTopics = [...new Set(chunk.map((p) => p.topic))];
    recent.push(...chunk.map((p) => p.slug));
    days.push({
      day,
      title: dayTopics.length ? dayTopics.map((t) => topicsBySlug[t]?.name ?? t).join(" + ") : "Catch-up and notes",
      topics: dayTopics,
      problems: chunk.map((p) => p.slug),
      minutes: Math.max(30, chunk.reduce((s, p) => s + p.estimatedMinutes, 0) + 20),
    });
  }
  return days;
}

const CORE = ["arrays", "strings", "hashing", "two-pointers", "sliding-window", "prefix-sum", "binary-search", "linked-list", "stack", "queue", "binary-trees", "tree-traversal", "bst", "heaps", "bfs", "dfs", "topological-sort", "greedy", "backtracking", "dynamic-programming"];
const ALL = Object.keys(topicsBySlug);

const specs: PlanSpec[] = [
  { slug: "30-day-dsa", name: "30-Day DSA Plan", durationDays: 30, audience: "You know one language and want interview coverage fast.", description: "The highest-yield topics in a month: arrays through DP, Easy and Medium only, with a revision day each week.", topics: CORE, difficulties: ["Easy", "Medium"], byFrequency: true },
  { slug: "60-day-dsa", name: "60-Day DSA Plan", durationDays: 60, audience: "You have two months and want depth as well as breadth.", description: "Core topics plus tries, shortest paths, union-find and bit tricks, including selected Hard problems.", topics: [...CORE.slice(0, 14), "tries", "priority-queue", "bfs", "dfs", "connected-components", "topological-sort", "dijkstra", "dsu", "greedy", "backtracking", "dynamic-programming", "bit-manipulation"].filter((t, i, a) => a.indexOf(t) === i), difficulties: ["Easy", "Medium", "Hard"] },
  { slug: "90-day-dsa", name: "90-Day DSA Plan", durationDays: 90, audience: "Starting from scratch with a quarter to prepare.", description: "The full roadmap from programming basics to advanced graphs and strings, every problem in order.", topics: ALL, difficulties: ["Easy", "Medium", "Hard"] },
  { slug: "placement-prep", name: "Placement Preparation", durationDays: 45, audience: "Campus placements and service/product company online assessments.", description: "Foundations-heavy plan focused on Easy and Medium problems that appear in online assessments and first-round interviews.", topics: ["programming-basics", "basic-math", "arrays", "strings", "basic-recursion", "hashing", "two-pointers", "sliding-window", "prefix-sum", "sorting", "binary-search", "linked-list", "stack", "queue", "binary-trees", "tree-traversal", "bst", "greedy", "dynamic-programming"], difficulties: ["Easy", "Medium"] },
  { slug: "faang-prep", name: "FAANG / Top Product Company Prep", durationDays: 60, audience: "Targeting Google, Meta, Amazon, Microsoft, Apple and similar.", description: "Medium and Hard problems ranked by interview frequency, with heavy emphasis on graphs and DP.", topics: ["arrays", "strings", "hashing", "two-pointers", "sliding-window", "binary-search", "linked-list", "stack", "binary-trees", "bst", "heaps", "tries", "bfs", "dfs", "topological-sort", "dijkstra", "dsu", "greedy", "backtracking", "dynamic-programming", "advanced-graphs"], difficulties: ["Medium", "Hard"], byFrequency: true },
];

export const learningPaths: LearningPath[] = specs.map((s) => ({
  slug: s.slug, name: s.name, description: s.description, durationDays: s.durationDays, audience: s.audience, days: buildDays(s),
}));

export const learningPathsBySlug: Record<string, LearningPath> = Object.fromEntries(learningPaths.map((p) => [p.slug, p]));
