"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { signUp } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await signUp(form.name, form.email, form.password);
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    router.replace("/roadmap");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Start at Level 1 with a fresh roadmap.</p>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <div><Label htmlFor="name">Name</Label><Input id="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} /><p className="mt-1 text-xs text-muted">At least 8 characters.</p></div>
        {error && <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />} Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link></p>
    </div>
  );
}
