"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV } from "./nav";
import { useAppStore } from "@/store/app-store";
import { LOGIN_REQUIRED_MESSAGE, loginUrl, requiresSession } from "@/lib/auth/routes";
import { categorizeRevision } from "@/lib/engine/revision";
import { useHydrated, useToday } from "@/hooks/use-app";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="AlgoAtlas home">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="12" cy="18" r="2.2" />
          <path d="M7.6 7.6 10.6 16M16.4 7.6 13.4 16M8.2 6h7.6" />
        </svg>
      </span>
      {!collapsed && <span className="text-[15px] font-semibold tracking-tight">AlgoAtlas</span>}
    </Link>
  );
}

function useRevisionCount() {
  const hydrated = useHydrated();
  const revision = useAppStore((s) => s.revision);
  const problemProgress = useAppStore((s) => s.problemProgress);
  const today = useToday();
  if (!hydrated) return 0;
  return categorizeRevision({ revision, problemProgress } as never, today).dueToday.length;
}

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const due = useRevisionCount();
  const signedIn = useAppStore((s) => !!s.user);
  const hydrated = useHydrated();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  // Every item stays visible and clickable when signed out. Clicking a protected
  // one says why and carries the destination to the login page, rather than
  // silently bouncing. The middleware enforces the same thing server-side.
  const guard = (href: string) => (event: React.MouseEvent) => {
    if (hydrated && !signedIn && requiresSession(href)) {
      event.preventDefault();
      toast.error(LOGIN_REQUIRED_MESSAGE, { description: "Log in to open this section." });
      router.push(loginUrl(href));
    }
    onNavigate?.();
  };
  return (
    <nav aria-label="Main" className="flex flex-col gap-5 px-3 py-4">
      {NAV.map((section) => (
        <div key={section.title}>
          {!collapsed && section.title !== "Dashboard" && <p className="mb-1.5 px-2 text-xs font-medium text-muted">{section.title}</p>}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(item.href);
              const locked = hydrated && !signedIn && requiresSession(item.href);
              const link = (
                <Link
                  href={item.href}
                  onClick={guard(item.href)}
                  aria-current={active ? "page" : undefined}
                  title={locked ? LOGIN_REQUIRED_MESSAGE : undefined}
                  className={cn(
                    "relative flex h-9 items-center gap-3 rounded-[var(--radius-control)] px-2.5 text-sm transition-colors",
                    active ? "bg-primary-soft font-medium text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <item.icon className="size-[18px] shrink-0" aria-hidden />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {item.badge === "revision" && due > 0 && (
                    collapsed
                      ? <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-warning" />
                      : <span className="ml-auto rounded-full bg-warning-soft px-1.5 text-xs font-medium tabular-nums text-warning">{due}</span>
                  )}
                  {locked && !collapsed && <Lock className="ml-auto size-3.5 shrink-0 opacity-60" aria-hidden />}
                </Link>
              );
              return <li key={item.href}>{collapsed ? <Tooltip content={item.label} side="right">{link}</Tooltip> : link}</li>;
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={cn("sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 lg:flex", collapsed ? "w-[68px]" : "w-60")}>
      <div className={cn("flex h-14 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
        <Logo collapsed={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin">
        <SidebarNav collapsed={collapsed} />
      </div>
      <button onClick={onToggle} className="flex h-11 items-center gap-2 border-t border-border px-4 text-sm text-muted hover:text-foreground" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        {collapsed ? <PanelLeftOpen className="mx-auto size-4" /> : <><PanelLeftClose className="size-4" /> Collapse</>}
      </button>
    </aside>
  );
}
