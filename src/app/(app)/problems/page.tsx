import { Suspense } from "react";
import { PageSkeleton } from "@/components/shared/states";
import { ProblemLibrary } from "./problem-library";

export const metadata = { title: "Problems" };

export default function ProblemsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProblemLibrary />
    </Suspense>
  );
}
