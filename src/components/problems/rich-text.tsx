import { Fragment } from "react";

/** Renders problem prose: blank-line paragraphs and `inline code`. */
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i} className="mb-3 leading-relaxed last:mb-0">
          {para.split(/(`[^`]+`)/g).map((part, j) =>
            part.startsWith("`") && part.endsWith("`") ? (
              <code key={j} className="rounded border border-border bg-surface-2 px-1 py-px font-mono text-[0.9em]">{part.slice(1, -1)}</code>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
