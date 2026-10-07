"use client";

import { Bookmark } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { problemsById } from "@/data/problems";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { ProblemTable } from "@/components/problems/problem-table";
import { EmptyState } from "@/components/shared/states";

export default function BookmarksPage() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const list = bookmarks.map((id) => problemsById[id]).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <div>
      <PageHeader title="Bookmarks" description="Problems you saved to come back to." />
      {list.length === 0 ? (
        <EmptyState icon={Bookmark} title="No bookmarks yet" description="Use the bookmark icon on any problem to save it here." action={{ label: "Browse problems", href: "/problems" }} />
      ) : (
        <Card className="overflow-hidden"><ProblemTable problems={list} showCompanies /></Card>
      )}
    </div>
  );
}
