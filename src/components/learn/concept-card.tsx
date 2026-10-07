import { Lightbulb, TriangleAlert, Gauge } from "lucide-react";
import type { Concept } from "@/types";
import { CodeBlock } from "@/components/shared/code-block";
import { ArrayVisualizer } from "./array-visualizer";

export function ConceptBody({ concept, showCode = true }: { concept: Concept; showCode?: boolean }) {
  return (
    <div className="space-y-4">
      <p className="max-w-[72ch] leading-relaxed">{concept.explanation}</p>
      {concept.frames && <ArrayVisualizer frames={concept.frames} />}
      {concept.visual && !concept.frames && (
        <pre className="overflow-x-auto rounded-[var(--radius-control)] border border-border bg-surface-2/50 p-4 font-mono text-[13px] leading-relaxed text-muted scroll-thin" aria-label="Diagram">{concept.visual}</pre>
      )}
      {showCode && concept.code && <CodeBlock code={concept.code} language="python" title="Python" />}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[var(--radius-control)] border border-border p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted"><Gauge className="size-3.5" /> Complexity</p>
          <p className="text-sm">{concept.complexity}</p>
        </div>
        <div className="rounded-[var(--radius-control)] border border-border p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-warning"><TriangleAlert className="size-3.5" /> Common mistakes</p>
          <ul className="space-y-1 text-sm">{concept.mistakes.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
        <div className="rounded-[var(--radius-control)] border border-border p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary"><Lightbulb className="size-3.5" /> Interview tips</p>
          <ul className="space-y-1 text-sm">{concept.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
