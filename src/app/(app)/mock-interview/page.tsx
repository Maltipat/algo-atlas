import { Suspense } from "react";
import { PageSkeleton } from "@/components/shared/states";
import { MockInterview } from "./mock-interview";

export const metadata = { title: "Mock interview" };

export default function MockInterviewPage() {
  return <Suspense fallback={<PageSkeleton />}><MockInterview /></Suspense>;
}
