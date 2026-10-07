import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page does not exist</h1>
      <p className="mt-2 max-w-md text-sm text-muted">The link may be outdated, or the problem or topic was renamed. Search for it or head back to your dashboard.</p>
      <div className="mt-6 flex gap-2"><Link href="/"><Button>Go to dashboard</Button></Link><Link href="/problems"><Button variant="outline">Browse problems</Button></Link></div>
    </div>
  );
}
