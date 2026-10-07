"use client";

import { useMemo } from "react";
import type { DayActivity } from "@/types";
import { addDays, dayKey, startOfWeek } from "@/lib/engine/dates";
import { Tooltip } from "@/components/ui/tooltip";

const LEVEL_VARS = ["var(--heat-0)", "var(--heat-1)", "var(--heat-2)", "var(--heat-3)", "var(--heat-4)"];

function level(a?: DayActivity) {
  if (!a) return 0;
  const n = a.solved * 2 + a.attempted * 0.5 + a.reviews;
  if (n <= 0) return 0;
  if (n < 2) return 1;
  if (n < 4) return 2;
  if (n < 7) return 3;
  return 4;
}

/** Calendar heatmap of daily activity, weeks as columns (Monday on top). */
export function ActivityHeatmap({ activity, weeks = 20 }: { activity: Record<string, DayActivity>; weeks?: number }) {
  const columns = useMemo(() => {
    const end = new Date();
    const start = addDays(startOfWeek(end), -7 * (weeks - 1));
    return Array.from({ length: weeks }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const date = addDays(start, w * 7 + d);
        return { key: dayKey(date), date, future: date > end };
      }),
    );
  }, [weeks]);

  const months = columns.map((col, i) => {
    const first = col[0]!.date;
    const prev = i > 0 ? columns[i - 1]![0]!.date : null;
    return !prev || prev.getMonth() !== first.getMonth() ? first.toLocaleString("en-GB", { month: "short" }) : "";
  });

  return (
    <div className="overflow-x-auto scroll-thin">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-[3px] pl-7 text-[10px] text-muted">
          {months.map((m, i) => <span key={i} className="w-[13px] overflow-visible whitespace-nowrap">{m}</span>)}
        </div>
        <div className="flex gap-[3px]">
          <div className="mr-1 flex w-6 flex-col justify-between py-[1px] text-[10px] text-muted"><span>Mon</span><span>Thu</span><span>Sun</span></div>
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {col.map((cell) => {
                const a = activity[cell.key];
                const label = cell.future ? "" : `${cell.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: ${a?.solved ?? 0} solved, ${a?.attempted ?? 0} submissions, ${a?.reviews ?? 0} reviews`;
                return cell.future ? (
                  <span key={cell.key} className="size-[13px]" />
                ) : (
                  <Tooltip key={cell.key} content={label}>
                    <span role="img" aria-label={label} className="size-[13px] rounded-[3px]" style={{ background: LEVEL_VARS[level(a)] }} />
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted">
          Less {LEVEL_VARS.map((v) => <span key={v} className="size-[10px] rounded-[2px]" style={{ background: v }} />)} More
        </div>
      </div>
    </div>
  );
}
