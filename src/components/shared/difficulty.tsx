import { CircleCheck, CircleDot, Circle } from "lucide-react";
import type { Difficulty, ProblemStatus } from "@/types";
import { cn } from "@/lib/utils";

const COLORS: Record<Difficulty, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
const BG: Record<Difficulty, string> = { Easy: "bg-easy", Medium: "bg-medium", Hard: "bg-hard" };

export function DifficultyText({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return <span className={cn("text-sm font-medium", COLORS[difficulty], className)}>{difficulty}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs font-medium", COLORS[difficulty])}>
      <span className={cn("size-1.5 rounded-full", BG[difficulty])} />
      {difficulty}
    </span>
  );
}

export function difficultyColor(d: Difficulty) {
  return d === "Easy" ? "var(--easy)" : d === "Medium" ? "var(--medium)" : "var(--hard)";
}

export function StatusIcon({ status, className }: { status: ProblemStatus; className?: string }) {
  if (status === "solved") return <CircleCheck className={cn("size-4 text-success", className)} aria-label="Solved" />;
  if (status === "attempted") return <CircleDot className={cn("size-4 text-warning", className)} aria-label="Attempted" />;
  return <Circle className={cn("size-4 text-border-strong", className)} aria-label="Not started" />;
}
