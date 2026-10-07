"use client";

import Editor from "react-simple-code-editor";
import type { Language } from "@/types";
import { highlight } from "@/lib/highlight";

/**
 * Lightweight editor (react-simple-code-editor + Prism) with a line-number gutter.
 * It works on mobile keyboards, unlike heavier editors. Swap for Monaco or CodeMirror
 * here without touching the problem page.
 */
export function CodeEditor({ value, onChange, language, fontSize = 14 }: { value: string; onChange: (v: string) => void; language: Language; fontSize?: number }) {
  const lines = value.split("\n").length;
  const lineHeight = Math.round(fontSize * 1.6);
  return (
    <div className="flex min-h-full font-mono" style={{ fontSize, lineHeight: `${lineHeight}px` }}>
      <div aria-hidden className="select-none border-r border-border bg-surface px-3 py-3 text-right text-muted/60 tabular-nums">
        {Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => highlight(code, language)}
        tabSize={4}
        insertSpaces
        padding={12}
        textareaId="code-editor"
        aria-label="Code editor"
        className="code-tokens min-w-0 flex-1"
        style={{ fontFamily: "var(--font-mono)", fontSize, lineHeight: `${lineHeight}px`, minHeight: "100%" }}
        textareaClassName="focus:outline-none"
      />
    </div>
  );
}
