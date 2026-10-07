import Link from "next/link";
import { TriangleAlert, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, action, className }: { icon: LucideIcon; title: string; description: string; action?: { label: string; href?: string; onClick?: () => void }; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-[var(--radius-panel)] border border-dashed border-border-strong px-6 py-12 text-center", className)}>
      <div className="mb-3 rounded-full bg-surface-2 p-3"><Icon className="size-5 text-muted" aria-hidden /></div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && (action.href ? (
        <Link href={action.href} className="mt-4"><Button size="sm">{action.label}</Button></Link>
      ) : (
        <Button size="sm" className="mt-4" onClick={action.onClick}>{action.label}</Button>
      ))}
    </div>
  );
}

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-[var(--radius-panel)] border border-danger/40 bg-danger-soft px-6 py-10 text-center">
      <TriangleAlert className="mb-2 size-6 text-danger" aria-hidden />
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {onRetry && <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function PageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="space-y-2"><Skeleton className="h-7 w-64" /><Skeleton className="h-4 w-96 max-w-full" /></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: cards }, (_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid gap-4 lg:grid-cols-3"><Skeleton className="h-72 lg:col-span-2" /><Skeleton className="h-72" /></div>
    </div>
  );
}
