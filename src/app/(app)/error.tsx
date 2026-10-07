"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/states";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto max-w-xl py-16">
      <ErrorState title="Something went wrong on this page" description="Your progress is saved. Try again, or reload the page if the problem continues." onRetry={reset} />
    </div>
  );
}
