"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { search, type SearchKind } from "@/lib/engine/search";
import { KIND_META } from "@/components/layout/search-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/states";
import { DifficultyText } from "@/components/shared/difficulty";
import type { Difficulty } from "@/types";
import { cn } from "@/lib/utils";

const KINDS: SearchKind[] = ["topic", "problem", "pattern", "lesson", "company"];

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = params.get("q") ?? "";
  const kind = (params.get("kind") as SearchKind | null) ?? null;
  const [value, setValue] = useState(q);
  const results = search(q, kind ? [kind] : undefined, 200);
  const counts = Object.fromEntries(KINDS.map((k) => [k, search(q, [k], 200).length]));
  const set = (patch: Record<string, string | null>) => {
    const n = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) (v ? n.set(k, v) : n.delete(k));
    router.replace(`${pathname}?${n.toString()}`);
  };
  return (
    <div>
      <PageHeader title={q ? `Results for “${q}”` : "Search"} description={q ? `${results.length} results` : "Search across topics, problems, patterns, lessons and companies."} />
      <form onSubmit={(e) => { e.preventDefault(); set({ q: value || null }); }} className="relative mb-4 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. binary tree" className="h-10 pl-9" aria-label="Search" autoFocus />
      </form>
      {q && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button onClick={() => set({ kind: null })} className={cn("rounded-full px-3 py-1 text-xs font-medium", !kind ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted")}>All</button>
          {KINDS.map((k) => <button key={k} onClick={() => set({ kind: k })} className={cn("rounded-full px-3 py-1 text-xs font-medium", kind === k ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted")}>{KIND_META[k].plural} ({counts[k]})</button>)}
        </div>
      )}
      {!q ? null : results.length === 0 ? (
        <EmptyState icon={Search} title="No results" description="Try a broader term, a topic name like “graphs”, or a pattern like “sliding window”." />
      ) : (
        <Card>
          <ul className="divide-y divide-border">
            {results.map((r) => { const Icon = KIND_META[r.kind].icon; return (
              <li key={r.kind + r.id}>
                <Link href={r.href} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2/60">
                  <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                  <div className="min-w-0 flex-1"><p className="truncate font-medium">{r.title}</p><p className="truncate text-xs text-muted">{r.subtitle}</p></div>
                  {r.difficulty ? <DifficultyText difficulty={r.difficulty as Difficulty} className="text-xs" /> : <span className="text-xs text-muted">{KIND_META[r.kind].label}</span>}
                </Link>
              </li>
            ); })}
          </ul>
        </Card>
      )}
    </div>
  );
}
