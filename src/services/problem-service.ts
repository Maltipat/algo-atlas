import type { Difficulty, Language, Problem, ProgressData } from "@/types";
import { problems, problemsBySlug } from "@/data/problems";
import { revisionStatus, type RevisionStatus } from "@/lib/engine/revision";

/**
 * Problem queries used by both the UI and the REST API.
 * In DB mode, replace the body of getAllProblems/getProblemBySlug with Prisma queries;
 * filtering and sorting can then move into SQL (see prisma/schema.prisma indexes).
 */
export function getAllProblems(): Problem[] {
  return problems;
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return problemsBySlug[slug];
}

export type StatusFilter = "all" | "solved" | "attempted" | "todo" | "unsolved";
export type SortKey = "recommended" | "number" | "difficulty-asc" | "difficulty-desc" | "most-solved" | "least-solved" | "recent" | "frequency";

export interface ProblemFilters {
  q?: string;
  topic?: string;
  difficulty?: Difficulty | "all";
  status?: StatusFilter;
  company?: string;
  pattern?: string;
  language?: Language | "all";
  revision?: RevisionStatus | "all";
  bookmarked?: boolean;
  sort?: SortKey;
}

const DIFF_RANK: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

export function filterProblems(list: Problem[], f: ProblemFilters, user?: ProgressData, recommendedOrder?: Map<string, number>): Problem[] {
  const q = f.q?.trim().toLowerCase();
  let out = list.filter((p) => {
    if (q && !(p.title.toLowerCase().includes(q) || String(p.number) === q || p.tags.some((t) => t.toLowerCase().includes(q)) || p.topic.includes(q.replace(/\s+/g, "-")) || p.patterns.some((x) => x.includes(q.replace(/\s+/g, "-"))) || p.companies.some((c) => c.includes(q)))) return false;
    if (f.topic && f.topic !== "all" && p.topic !== f.topic) return false;
    if (f.difficulty && f.difficulty !== "all" && p.difficulty !== f.difficulty) return false;
    if (f.company && f.company !== "all" && !p.companies.includes(f.company)) return false;
    if (f.pattern && f.pattern !== "all" && !p.patterns.includes(f.pattern)) return false;
    if (f.language && f.language !== "all" && !p.solution[f.language]) return false;
    if (user) {
      const st = user.problemProgress[p.id]?.status ?? "todo";
      if (f.status === "solved" && st !== "solved") return false;
      if (f.status === "attempted" && st !== "attempted") return false;
      if (f.status === "todo" && st !== "todo") return false;
      if (f.status === "unsolved" && st === "solved") return false;
      if (f.revision && f.revision !== "all" && revisionStatus(user, p.id) !== f.revision) return false;
      if (f.bookmarked && !user.bookmarks.includes(p.id)) return false;
    }
    return true;
  });
  const sort = f.sort ?? "number";
  const by: Record<SortKey, (a: Problem, b: Problem) => number> = {
    number: (a, b) => a.number - b.number,
    "difficulty-asc": (a, b) => DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty] || a.number - b.number,
    "difficulty-desc": (a, b) => DIFF_RANK[b.difficulty] - DIFF_RANK[a.difficulty] || a.number - b.number,
    "most-solved": (a, b) => b.solvedCount - a.solvedCount,
    "least-solved": (a, b) => a.solvedCount - b.solvedCount,
    recent: (a, b) => b.addedAt.localeCompare(a.addedAt),
    frequency: (a, b) => b.frequency - a.frequency || a.number - b.number,
    recommended: (a, b) => (recommendedOrder?.get(a.id) ?? 1e9) - (recommendedOrder?.get(b.id) ?? 1e9) || a.number - b.number,
  };
  out = [...out].sort(by[sort]);
  return out;
}
