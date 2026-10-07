import { Suspense } from "react";
import { PageSkeleton } from "@/components/shared/states";
import { SearchResults } from "./search-results";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return <Suspense fallback={<PageSkeleton />}><SearchResults /></Suspense>;
}
