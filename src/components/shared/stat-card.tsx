import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon: LucideIcon; tone?: "default" | "success" | "warning" | "primary" }) {
  const toneClass = { default: "text-muted", success: "text-success", warning: "text-warning", primary: "text-primary" }[tone];
  return (
    <div className="rounded-[var(--radius-panel)] border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <Icon className={cn("size-4", toneClass)} aria-hidden />
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="mt-0.5 truncate text-xs text-muted">{hint}</div>}
    </div>
  );
}
