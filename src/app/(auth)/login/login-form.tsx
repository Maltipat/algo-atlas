"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useHydrated } from "@/hooks/use-app";
import { hasServerSession, signIn, signInDemo } from "@/services/auth-service";
import { LOGIN_REQUIRED_MESSAGE, safeNext, signupUrl } from "@/lib/auth/routes";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const next = safeNext(useSearchParams().get("next"));
  const hydrated = useHydrated();
  const user = useAppStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [noAccount, setNoAccount] = useState(false);
  const [busy, setBusy] = useState(false);

  /**
   * Leaving the login page waits for the server session, not for the store.
   *
   * The store's `user` is set the instant the client-side sign-in succeeds, which is
   * before POST /api/auth/session has returned the cookie. Navigating on that signal
   * sent a request carrying no session, so middleware bounced it back here and the
   * page appeared to hang. Navigation now happens from the awaited sign-in result,
   * by which point the cookie exists.
   *
   * A full document navigation is used so the server sees the new cookie on the next
   * request rather than a client-cached response.
   */
  const leave = () => window.location.assign(next);

  // Someone who is already signed in should not sit on the login page — but only
  // leave once the server agrees there is a session, otherwise this races too.
  useEffect(() => {
    if (!hydrated || !user) return;
    let cancelled = false;
    void hasServerSession().then((ok) => { if (ok && !cancelled) leave(); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoAccount(false);
    setBusy(true);
    const res = await signIn(email, password);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      setNoAccount(res.code === "no-account");
      return;
    }
    leave();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-1 text-sm text-muted">Pick up where you left off.</p>
      {/* Set whenever a guard sent the visitor here, so the redirect is explained. */}
      {next !== "/" && (
        <p role="status" className="mt-4 rounded-md bg-warning-soft px-3 py-2 text-sm text-warning">
          {LOGIN_REQUIRED_MESSAGE} You will be taken to <span className="font-medium">{next}</span> afterwards.
        </p>
      )}
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {error && (
          <div role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
            <p>{error}</p>
            {noAccount && (
              <Link href={signupUrl(next, email)} className="mt-1 inline-block font-medium underline">
                Create an account for {email}
              </Link>
            )}
          </div>
        )}
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
          if (!res.ok) { setError(res.error); return; }
          leave();
        }}
      >
        Continue with the demo account
      </Button>
      <p className="mt-2 text-center text-xs text-muted">The demo account (demo@algoatlas.app) has five months of sample progress.</p>
      <p className="mt-4 rounded-md bg-primary-soft px-3 py-2 text-center text-xs text-muted">Your account and password live on the server; the password is hashed and never stored in plain text. Your practice progress is saved in this browser.</p>
      <p className="mt-6 text-center text-sm text-muted">New here? <Link href={signupUrl(next)} className="font-medium text-primary hover:underline">Create an account</Link></p>
    </div>
  );
}
