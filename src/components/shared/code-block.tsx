"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import type { Language } from "@/types";
import { highlight } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export function CodeBlock({ code, language = "python", className, title }: { code: string; language?: Language; className?: string; title?: string }) {
  const html = useMemo(() => highlight(code, language), [code, language]);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className={cn("group relative overflow-hidden rounded-[var(--radius-control)] border border-border bg-code", className)}>
      {title && <div className="border-b border-border px-3 py-1.5 text-xs text-muted">{title}</div>}
      <button onClick={copy} className="absolute right-2 top-2 rounded-md border border-border bg-surface p-1.5 text-muted opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100" aria-label="Copy code">
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </button>
      <pre className="code-tokens overflow-x-auto p-3 text-[13px] leading-relaxed scroll-thin"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
    </div>
  );
}
