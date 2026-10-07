"use client";
import * as T from "@radix-ui/react-tooltip";
import * as React from "react";

export const TooltipProvider = T.Provider;

export function Tooltip({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactNode; side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <T.Root delayDuration={200}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content side={side} sideOffset={6} className="z-[60] max-w-xs rounded-md border border-border bg-foreground px-2 py-1 text-xs text-background shadow-lg data-[state=delayed-open]:animate-fade-in">
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}
