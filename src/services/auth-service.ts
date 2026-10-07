"use client";

import { useAppStore } from "@/store/app-store";

/**
 * Mock authentication. Sessions live in the persisted client store.
 *
 * To use real auth, replace these two functions with calls to Auth.js (NextAuth)
 * `signIn("credentials", …)` or your provider, and load the user's progress from
 * /api routes backed by Prisma instead of localStorage. Nothing in the UI changes.
 */
type Result = { ok: true } | { ok: false; error: string };

const EMAIL = /^\S+@\S+\.\S+$/;

export async function signIn(email: string, password: string): Promise<Result> {
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  await new Promise((r) => setTimeout(r, 300));
  const ok = useAppStore.getState().login(email);
  return ok ? { ok: true } : { ok: false, error: "No account with this email exists in this browser. Create an account or use the demo account." };
}

export async function signUp(name: string, email: string, password: string): Promise<Result> {
  if (!name.trim()) return { ok: false, error: "Enter your name." };
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  await new Promise((r) => setTimeout(r, 300));
  useAppStore.getState().signup(name.trim(), email.trim());
  return { ok: true };
}
