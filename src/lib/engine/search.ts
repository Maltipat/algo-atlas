import { companies } from "@/data/companies";
import { patterns } from "@/data/patterns";
import { problems } from "@/data/problems";
import { topics, topicsBySlug } from "@/data/topics";

export type SearchKind = "topic" | "problem" | "pattern" | "lesson" | "company";

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
  difficulty?: string;
}

function scoreText(query: string[], fields: [string, number][]): number {
  let total = 0;
  for (const term of query) {
    let best = 0;
    for (const [text, weight] of fields) {
      const t = text.toLowerCase();
      if (t === term) best = Math.max(best, weight * 3);
      else if (t.startsWith(term)) best = Math.max(best, weight * 2);
      else if (t.includes(term)) best = Math.max(best, weight);
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

interface Doc { kind: SearchKind; id: string; title: string; subtitle: string; href: string; fields: [string, number][]; difficulty?: string }

const docs: Doc[] = [
  ...topics.map((t) => ({ kind: "topic" as const, id: t.slug, title: t.name, subtitle: `Level ${t.level} topic, ${t.tier}`, href: `/topics/${t.slug}`, fields: [[t.name, 10], [t.summary, 3], [t.slug.replace(/-/g, " "), 6]] as [string, number][] })),
  ...problems.map((p) => ({
    kind: "problem" as const, id: p.slug, title: p.title, subtitle: `${topicsBySlug[p.topic]?.name ?? p.topic}, ${p.difficulty}`, href: `/problems/${p.slug}`, difficulty: p.difficulty,
    fields: [[p.title, 10], [topicsBySlug[p.topic]?.name ?? "", 4], [p.tags.join(" "), 4], [p.patterns.join(" ").replace(/-/g, " "), 4], [p.companies.join(" "), 3], [p.difficulty, 2], [p.subtopic, 3]] as [string, number][],
  })),
  ...patterns.map((p) => ({ kind: "pattern" as const, id: p.slug, title: p.name, subtitle: "Interview pattern", href: `/patterns/${p.slug}`, fields: [[p.name, 10], [p.summary, 3], [p.signals.join(" "), 2]] as [string, number][] })),
  ...topics.flatMap((t) => t.concepts.map((c) => ({ kind: "lesson" as const, id: `${t.slug}#${c.id}`, title: c.title, subtitle: `Lesson in ${t.name}`, href: `/topics/${t.slug}#${c.id}`, fields: [[c.title, 8], [t.name, 5], [c.explanation, 1]] as [string, number][] }))),
  ...companies.map((c) => ({ kind: "company" as const, id: c.slug, title: c.name, subtitle: "Company preparation", href: `/companies/${c.slug}`, fields: [[c.name, 10]] as [string, number][] })),
];

export function search(query: string, kinds?: SearchKind[], limit = 40): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const out: SearchResult[] = [];
  for (const d of docs) {
    if (kinds && !kinds.includes(d.kind)) continue;
    const score = scoreText(terms, d.fields) + scoreText([terms.join(" ")], [[d.title, 6]]);
    if (score > 0) out.push({ kind: d.kind, id: d.id, title: d.title, subtitle: d.subtitle, href: d.href, score, difficulty: d.difficulty });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}
