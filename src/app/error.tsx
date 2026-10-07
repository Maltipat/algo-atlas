"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/states";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <ErrorState title="Something went wrong on this page" description="Your progress is saved. Try again, or reload the page if the problem continues." onRetry={reset} />
    </div>
  );
}
