"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VisualFrame } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MARK_STYLE: Record<VisualFrame["marks"][number], string> = {
  i: "border-primary bg-primary-soft text-primary",
  j: "border-primary bg-primary-soft text-primary",
  mid: "border-warning bg-warning-soft text-warning",
  window: "border-primary/60 bg-primary-soft",
  done: "opacity-40",
  found: "border-success bg-success-soft text-success",
};
const MARK_LABEL: Partial<Record<VisualFrame["marks"][number], string>> = { i: "i", j: "j", mid: "mid", found: "✓" };

/** Step-through visual for array techniques (two pointers, windows, binary search). */
export function ArrayVisualizer({ frames }: { frames: VisualFrame[] }) {
  const [step, setStep] = useState(0);
  const frame = frames[step]!;
  return (
    <div className="rounded-[var(--radius-control)] border border-border bg-surface-2/50 p-4">
      <div className="overflow-x-auto pb-1 scroll-thin">
        <div className="flex min-w-max gap-1.5">
          {frame.array.map((v, i) => {
            const mark = frame.marks[i];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] tabular-nums text-muted">{i}</span>
                <span className={cn("grid size-10 place-items-center rounded-md border border-border bg-surface font-mono text-sm transition-colors", mark && MARK_STYLE[mark])}>{v}</span>
                <span className="h-4 text-[11px] font-semibold text-primary">{mark ? MARK_LABEL[mark] ?? "" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 min-h-10 text-sm" aria-live="polite">{frame.note}</p>
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} aria-label="Previous step"><ChevronLeft /></Button>
        <span className="text-xs tabular-nums text-muted">Step {step + 1} of {frames.length}</span>
        <Button size="sm" variant="outline" onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))} disabled={step === frames.length - 1} aria-label="Next step"><ChevronRight /></Button>
        <Button size="sm" variant="ghost" onClick={() => setStep(0)} aria-label="Restart"><RotateCcw /></Button>
      </div>
    </div>
  );
}
