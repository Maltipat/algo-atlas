"use client";

import Link from "next/link";
import { companies } from "@/data/companies";
import { problems } from "@/data/problems";
import { topicsBySlug } from "@/data/topics";
import { useAppStore } from "@/store/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { Progress } from "@/components/ui/progress";
import { CompanyMark } from "@/components/shared/company-mark";

export default function CompaniesPage() {
  const progress = useAppStore((s) => s.problemProgress);
  return (
    <div>
      <PageHeader title="Companies" description="What each company tends to ask, how its process works, and the problems tagged with it." />
      <div className="grid gap-3 md:grid-cols-2">
        {companies.map((c) => {
          const list = problems.filter((p) => p.companies.includes(c.slug));
          const solved = list.filter((p) => progress[p.id]?.status === "solved").length;
          return (
            <Link key={c.slug} href={`/companies/${c.slug}`} className="group rounded-[var(--radius-panel)] border border-border bg-surface p-5 hover:border-primary/60">
              <div className="flex items-center gap-3"><CompanyMark name={c.name} color={c.color} size={40} /><div className="flex-1"><p className="font-semibold group-hover:text-primary">{c.name}</p><p className="text-xs text-muted">{solved}/{list.length} tagged problems solved</p></div></div>
              <p className="mt-3 line-clamp-2 text-sm text-muted">{c.description}</p>
              <p className="mt-3 text-xs text-muted">Focus: {c.focusTopics.slice(0, 4).map((f) => topicsBySlug[f.topic]?.name).join(", ")}</p>
              <Progress value={(solved / Math.max(1, list.length)) * 100} className="mt-3" label={`${c.name} progress`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
