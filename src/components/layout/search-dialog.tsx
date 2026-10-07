"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Building, Code, CornerDownLeft, Library, Search, Waypoints, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { search, type SearchKind, type SearchResult } from "@/lib/engine/search";
import { useDebounced } from "@/hooks/use-app";
import { cn } from "@/lib/utils";

export const KIND_META: Record<SearchKind, { label: string; plural: string; icon: LucideIcon }> = {
  topic: { label: "Topic", plural: "Topics", icon: Library },
  problem: { label: "Problem", plural: "Problems", icon: Code },
  pattern: { label: "Pattern", plural: "Patterns", icon: Waypoints },
  lesson: { label: "Lesson", plural: "Learning resources", icon: BookOpen },
  company: { label: "Company", plural: "Companies", icon: Building },
};
const KINDS: SearchKind[] = ["topic", "problem", "pattern", "lesson", "company"];

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<SearchKind | "all">("all");
  const [active, setActive] = useState(0);
  const dq = useDebounced(q, 80);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => search(dq, kind === "all" ? undefined : [kind], 30), [dq, kind]);
  const grouped = useMemo(() => {
    const g = new Map<SearchKind, SearchResult[]>();
    for (const r of results) g.set(r.kind, [...(g.get(r.kind) ?? []), r]);
    return KINDS.filter((k) => g.has(k)).map((k) => ({ kind: k, items: g.get(k)!.slice(0, kind === "all" ? 5 : 30) }));
  }, [results, kind]);
  const flat = grouped.flatMap((g) => g.items);

  useEffect(() => setActive(0), [dq, kind]);
  useEffect(() => { if (!open) { setQ(""); setKind("all"); } }, [open]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (href: string) => { onOpenChange(false); router.push(href); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) go(flat[active]!.href);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  let index = -1;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="top-[12vh] max-w-2xl translate-y-0 p-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted" aria-hidden />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search topics, problems, patterns, companies…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            aria-label="Search"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="search-results"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted sm:block">Esc</kbd>
        </div>
        <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2 scroll-thin">
          {(["all", ...KINDS] as const).map((k) => (
            <button key={k} onClick={() => setKind(k)} className={cn("rounded-full px-2.5 py-1 text-xs font-medium", kind === k ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted hover:text-foreground")}>
              {k === "all" ? "All" : KIND_META[k].plural}
            </button>
          ))}
        </div>
        <div id="search-results" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2 scroll-thin">
          {!dq.trim() && (
            <div className="px-3 py-6 text-sm text-muted">
              <p className="mb-2">Try searching for</p>
              <div className="flex flex-wrap gap-2">
                {["binary tree", "sliding window", "dijkstra", "two sum", "knapsack", "google"].map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-surface-2">{s}</button>
                ))}
              </div>
            </div>
          )}
          {dq.trim() && !flat.length && <p className="px-3 py-8 text-center text-sm text-muted">No results for “{dq}”. Try a topic name or a pattern such as “two pointers”.</p>}
          {grouped.map((g) => (
            <div key={g.kind} className="mb-2">
              <p className="px-3 py-1.5 text-xs font-medium text-muted">{KIND_META[g.kind].plural}</p>
              {g.items.map((r) => {
                index++;
                const i = index;
                const Icon = KIND_META[r.kind].icon;
                return (
                  <button
                    key={r.kind + r.id}
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm", i === active ? "bg-surface-2" : "")}
                  >
                    <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-muted">{r.subtitle}</span>
                    </span>
                    {i === active && <CornerDownLeft className="size-3.5 text-muted" aria-hidden />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {dq.trim() && (
          <button onClick={() => go(`/search?q=${encodeURIComponent(dq.trim())}`)} className="w-full border-t border-border px-4 py-2.5 text-left text-xs text-muted hover:text-foreground">
            See all results for “{dq}”
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
