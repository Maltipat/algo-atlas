import { Logo } from "@/components/layout/sidebar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-muted">Demo mode: accounts and progress are stored in this browser.</p>
      </div>
      <aside className="relative hidden overflow-hidden border-l border-border bg-surface lg:block" aria-hidden>
        <div className="absolute inset-0 flex flex-col justify-center gap-10 px-16">
          <p className="max-w-md text-3xl font-semibold leading-tight tracking-tight">From your first loop to your final interview round.</p>
          <ol className="relative space-y-6 border-l-2 border-primary/40 pl-6">
            {[["Foundations", "Arrays, strings, recursion"], ["Core structures", "Hashing, stacks, binary search"], ["Trees", "Traversals, heaps, tries"], ["Graphs", "BFS, DFS, shortest paths"], ["Advanced", "Greedy, backtracking, DP"]].map(([t, d], i) => (
              <li key={t} className="relative">
                <span className={`absolute -left-[33px] top-1 size-4 rounded-full border-[3px] ${i < 2 ? "border-primary bg-primary" : "border-primary bg-surface"}`} />
                <p className="font-medium">Level {i + 1}: {t}</p>
                <p className="text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">264 problems, 44 topics, 17 patterns, spaced revision and analytics.</p>
        </div>
      </aside>
    </div>
  );
}
