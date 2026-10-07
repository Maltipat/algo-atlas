"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useHydrated } from "@/hooks/use-app";
import { signIn, signInDemo } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const hydrated = useHydrated();
  const user = useAppStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (hydrated && user) router.replace(next); }, [hydrated, user, router, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await signIn(email, password);
    setBusy(false);
    if (!res.ok) setError(res.error);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-1 text-sm text-muted">Pick up where you left off.</p>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {error && <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />} Log in</Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
      <Button
        variant="outline"
        className="w-full"
        disabled={busy}
        onClick={async () => {
          setError(null);
          setBusy(true);
          const res = await signInDemo();
          setBusy(false);
          if (!res.ok) setError(res.error);
        }}
      >
        Continue with the demo account
      </Button>
      <p className="mt-2 text-center text-xs text-muted">The demo account (demo@algoatlas.app) has five months of sample progress.</p>
      <p className="mt-4 rounded-md bg-primary-soft px-3 py-2 text-center text-xs text-muted">This is a portfolio demo. Sign-in is simulated and no account is real — everything you do is stored only in your own browser and is visible to nobody else.</p>
      <p className="mt-6 text-center text-sm text-muted">New here? <Link href="/signup" className="font-medium text-primary hover:underline">Create an account</Link></p>
    </div>
  );
}
