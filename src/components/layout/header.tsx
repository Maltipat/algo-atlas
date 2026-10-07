"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Bell, Flame, LogOut, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useHydrated, useStats } from "@/hooks/use-app";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { Avatar } from "@/components/shared/avatar";
import { SearchDialog } from "./search-dialog";
import { cn, timeAgo } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function Notifications() {
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationsRead);
  const clear = useAppStore((s) => s.clearNotifications);
  const unread = notifications.filter((n) => !n.read).length;
  const router = useRouter();
  return (
    <DropdownMenu onOpenChange={(o) => { if (!o && unread) markRead(); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
          <Bell />
          {unread > 0 && <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white">{unread}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          {notifications.length > 0 && <button onClick={clear} className="text-xs text-muted hover:text-foreground">Clear all</button>}
        </div>
        <div className="max-h-80 overflow-y-auto p-1 scroll-thin">
          {notifications.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted">You are all caught up.</p>}
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} onSelect={() => n.href && router.push(n.href)} className="items-start">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{n.title}</span>
                <span className="block text-xs text-muted">{n.body}</span>
                <span className="mt-0.5 block text-[11px] text-muted">{timeAgo(n.createdAt)}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Marks the seeded sample account, so a visitor is never left wondering whose profile this is. */
function DemoBadge() {
  const isDemo = useAppStore((s) => s.user?.id === "u_demo");
  const hydrated = useHydrated();
  if (!hydrated || !isDemo) return null;
  return (
    <span
      className="mr-1 hidden rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary sm:block"
      title="Sample account with generated history. Your activity is stored only in this browser and is visible to nobody else."
    >
      Demo
    </span>
  );
}

function UserMenu() {
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full" aria-label="Account menu"><Avatar name={user.name} hue={user.avatarHue} size={32} /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block text-sm font-medium text-foreground">{user.name}</span>
          <span className="block">{user.email}</span>
          {user.id === "u_demo" && <span className="mt-1 block text-[11px]">Sample account — stored only in this browser.</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/profile")}><User /> Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/settings")}><Settings /> Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { logout(); router.replace("/login"); }}><LogOut /> Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ onMenu }: { onMenu: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const hydrated = useHydrated();
  const stats = useStats();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open navigation"><Menu /></Button>
      <button onClick={() => setSearchOpen(true)} className="flex h-9 w-full max-w-md items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-muted hover:border-border-strong">
        <Search className="size-4" aria-hidden />
        <span className="truncate">Search problems, topics, patterns…</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] sm:block">Ctrl K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-1">
        <DemoBadge />
        {hydrated && (
          <Link href="/analytics" className="mr-1 hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-sm font-medium sm:flex" aria-label={`${stats.currentStreak} day streak`}>
            <Flame className={cn("size-4", stats.activeToday ? "text-warning" : "text-muted")} aria-hidden />
            <span className="tabular-nums">{stats.currentStreak}</span>
          </Link>
        )}
        <Notifications />
        <ThemeToggle />
        <UserMenu />
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
