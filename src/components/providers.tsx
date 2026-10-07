"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/store/app-store";

function StoreBootstrap() {
  useEffect(() => {
    const finish = () => {
      useAppStore.getState().ensureInitialized();
      useAppStore.setState({ hydrated: true });
    };
    const unsub = useAppStore.persist.onFinishHydration(finish);
    void useAppStore.persist.rehydrate();
    if (useAppStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <StoreBootstrap />
        {children}
        <Toaster position="bottom-right" toastOptions={{ className: "!bg-surface !text-foreground !border-border" }} />
      </TooltipProvider>
    </ThemeProvider>
  );
}
