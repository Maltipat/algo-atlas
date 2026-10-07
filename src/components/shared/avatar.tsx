import { cn, initials } from "@/lib/utils";

export function Avatar({ name, hue, size = 32, className }: { name: string; hue: number; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white", className)}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, hsl(${hue} 65% 52%), hsl(${(hue + 40) % 360} 60% 42%))` }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
