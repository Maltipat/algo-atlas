"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { loginUrl, requiresSession } from "@/lib/auth/routes";
import { useHydrated } from "@/hooks/use-app";
import { Dialog, DialogTitle, DrawerContent } from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/shared/states";
import { Header } from "./header";
import { Logo, Sidebar, SidebarNav } from "./sidebar";

const COLLAPSE_KEY = "dsa-mastery-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const hydrated = useHydrated();
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const fullBleed = pathname.startsWith("/problems/");

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1"); } catch { /* storage unavailable */ }
  }, []);
  // Middleware already blocks protected pages server-side. This is the client-side
  // counterpart for the case where the cookie outlives the browser-stored account
  // (cleared site data, expired store), which would otherwise render pages that
  // assume a user. Public pages are left alone so the app opens without an account.
  const protectedPage = requiresSession(pathname);
  useEffect(() => {
    if (hydrated && !user && protectedPage) router.replace(loginUrl(pathname));
  }, [hydrated, user, router, pathname, protectedPage]);

  const toggle = () => {
    setCollapsed((c) => {
      try { localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1"); } catch { /* ignore */ }
      return !c;
    });
  };

  return (
    <div className="flex min-h-dvh">
      <Sidebar collapsed={collapsed || fullBleed} onToggle={toggle} />
      <Dialog open={drawer} onOpenChange={setDrawer}>
        <DrawerContent aria-describedby={undefined}>
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <Logo />
            <button onClick={() => setDrawer(false)} className="rounded-md p-1.5 text-muted hover:bg-surface-2" aria-label="Close navigation"><X className="size-4" /></button>
          </div>
          <div className="h-[calc(100dvh-3.5rem)] overflow-y-auto scroll-thin">
            <SidebarNav onNavigate={() => setDrawer(false)} />
          </div>
        </DrawerContent>
      </Dialog>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setDrawer(true)} />
        <main className={fullBleed ? "min-w-0 flex-1" : "mx-auto w-full max-w-[1320px] min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8"}>
          {hydrated && (user || !protectedPage) ? children : <div className={fullBleed ? "p-6" : ""}><PageSkeleton /></div>}
        </main>
      </div>
    </div>
  );
}
