"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Shuffle, X } from "lucide-react";
import type { Difficulty, Language } from "@/types";
import { topics } from "@/data/topics";
import { companies } from "@/data/companies";
import { patterns } from "@/data/patterns";
import { getAllProblems, filterProblems, type ProblemFilters, type SortKey, type StatusFilter } from "@/services/problem-service";
import { recommendProblems } from "@/lib/engine/recommend";
import type { RevisionStatus } from "@/lib/engine/revision";
import { useAppStore } from "@/store/app-store";
import { useStats } from "@/hooks/use-app";
import { PageHeader } from "@/components/shared/page-header";
import { ProblemTable } from "@/components/problems/problem-table";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/types";

const PAGE_SIZE = 25;

export function ProblemLibrary() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = useAppStore();
  const stats = useStats();
  const [q, setQ] = useState(params.get("q") ?? "");

  const filters: ProblemFilters = {
    q: params.get("q") ?? "",
    topic: params.get("topic") ?? "all",
    difficulty: (params.get("difficulty") as Difficulty) ?? "all",
    status: (params.get("status") as StatusFilter) ?? "all",
    company: params.get("company") ?? "all",
    pattern: params.get("pattern") ?? "all",
    language: (params.get("language") as Language) ?? "all",
    revision: (params.get("revision") as RevisionStatus) ?? "all",
    bookmarked: params.get("bookmarked") === "1",
    sort: (params.get("sort") as SortKey) ?? "number",
  };
  const page = Math.max(1, Number(params.get("page") ?? 1));

  const setParam = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || v === "all" || v === "0") next.delete(k); else next.set(k, v);
    }
    if (!("page" in patch)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const recOrder = useMemo(() => {
    if (filters.sort !== "recommended") return undefined;
    return new Map(recommendProblems(state, stats.topicProgress, 400).map((r, i) => [r.problem.id, i]));
  }, [filters.sort, state, stats.topicProgress]);

  const list = useMemo(() => filterProblems(getAllProblems(), filters, state, recOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.toString(), state.problemProgress, state.bookmarks, state.revision, recOrder]);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const visible = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = ["topic", "difficulty", "status", "company", "pattern", "language", "revision", "bookmarked", "q"].filter((k) => params.get(k)).length;

  const pickRandom = () => {
    const pool = list.filter((p) => state.problemProgress[p.id]?.status !== "solved");
    const p = (pool.length ? pool : list)[Math.floor(Math.random() * (pool.length || list.length))];
    if (p) router.push(`/problems/${p.slug}`);
  };

  return (
    <div>
      <PageHeader
        title="Problems"
        description={`${getAllProblems().length} curated problems across ${topics.length} topics. Filters are saved in the URL, so you can bookmark a view.`}
        actions={<Button variant="outline" onClick={pickRandom} disabled={!list.length}><Shuffle /> Random problem</Button>}
      />
      <Card className="mb-4 p-4">
        <form className="relative mb-3" onSubmit={(e) => { e.preventDefault(); setParam({ q }); }}>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setParam({ q: e.target.value }); }} placeholder="Search by name, number, topic, pattern or company" className="pl-9" aria-label="Search problems" />
        </form>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <Select aria-label="Topic" value={filters.topic} onChange={(e) => setParam({ topic: e.target.value })}>
            <option value="all">All topics</option>
            {topics.filter((t) => getAllProblems().some((p) => p.topic === t.slug)).map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </Select>
          <Select aria-label="Difficulty" value={filters.difficulty} onChange={(e) => setParam({ difficulty: e.target.value })}>
            <option value="all">All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </Select>
          <Select aria-label="Status" value={filters.status} onChange={(e) => setParam({ status: e.target.value })}>
            <option value="all">Any status</option><option value="solved">Solved</option><option value="unsolved">Unsolved</option><option value="attempted">Attempted</option><option value="todo">Not started</option>
          </Select>
          <Select aria-label="Company" value={filters.company} onChange={(e) => setParam({ company: e.target.value })}>
            <option value="all">All companies</option>
            {companies.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </Select>
          <Select aria-label="Pattern" value={filters.pattern} onChange={(e) => setParam({ pattern: e.target.value })}>
            <option value="all">All patterns</option>
            {patterns.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </Select>
          <Select aria-label="Solution language" value={filters.language} onChange={(e) => setParam({ language: e.target.value })}>
            <option value="all">Any solution language</option>
            {LANGUAGES.filter((l) => l.id === "javascript" || l.id === "python").map((l) => <option key={l.id} value={l.id}>Solution in {l.label}</option>)}
          </Select>
          <Select aria-label="Revision status" value={filters.revision} onChange={(e) => setParam({ revision: e.target.value })}>
            <option value="all">Any revision state</option><option value="due">Due for review</option><option value="scheduled">Scheduled</option><option value="mastered">Mastered</option><option value="none">Not in revision</option>
          </Select>
          <Select aria-label="Sort by" value={filters.sort} onChange={(e) => setParam({ sort: e.target.value })}>
            <option value="number">Sort: Default</option>
            <option value="recommended">Sort: Recommended</option>
            <option value="difficulty-asc">Sort: Easiest first</option>
            <option value="difficulty-desc">Sort: Hardest first</option>
            <option value="most-solved">Sort: Most solved</option>
            <option value="least-solved">Sort: Least solved</option>
            <option value="recent">Sort: Recently added</option>
            <option value="frequency">Sort: Interview frequency</option>
          </Select>
          <label className="flex h-9 items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm">
            <input type="checkbox" className="accent-[var(--primary)]" checked={filters.bookmarked} onChange={(e) => setParam({ bookmarked: e.target.checked ? "1" : null })} />
            Bookmarked
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted">
          <span>{list.length} {list.length === 1 ? "problem" : "problems"}</span>
          {activeCount > 0 && <button onClick={() => { setQ(""); router.replace(pathname); }} className="inline-flex items-center gap-1 hover:text-foreground"><X className="size-3.5" /> Clear {activeCount} {activeCount === 1 ? "filter" : "filters"}</button>}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <ProblemTable problems={visible} showCompanies emptyMessage="No problems match these filters. Clear a filter or try a broader search." />
      </Card>
      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-2" aria-label="Pagination">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })} aria-label="Previous page"><ChevronLeft /></Button>
          <span className="text-sm tabular-nums text-muted">Page {page} of {pages}</span>
          <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setParam({ page: String(page + 1) })} aria-label="Next page"><ChevronRight /></Button>
        </nav>
      )}
    </div>
  );
}
