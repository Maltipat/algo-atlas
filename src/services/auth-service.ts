"use client";

import { useAppStore } from "@/store/app-store";

/**
 * Mock authentication. Accounts live in the persisted client store; the server
 * is told about the resulting session so protected routes and APIs can verify it
 * (src/lib/auth/session.ts). Both halves move together: if the cookie cannot be
 * issued, the client sign-in is rolled back rather than left half-done.
 *
 * To use real auth, replace signIn/signUp with Auth.js (NextAuth) `signIn("credentials", …)`
 * or your provider and load progress from /api routes backed by Prisma. The session
 * endpoint and route guards stay as they are.
 */
type Result = { ok: true } | { ok: false; error: string; code?: "no-account" | "duplicate" };

const EMAIL = /^\S+@\S+\.\S+$/;

/** Mints the HttpOnly session cookie for the user now in the store. */
async function openServerSession(): Promise<boolean> {
  const user = useAppStore.getState().user;
  if (!user) return false;
  try {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.id, email: user.email, name: user.name }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function closeServerSession(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    /* the client session is cleared regardless; the cookie expires on its own */
  }
}

/** True when the browser currently holds a valid session cookie. */
export async function hasServerSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return false;
    return ((await res.json()) as { authenticated?: boolean }).authenticated === true;
  } catch {
    return false;
  }
}

const SESSION_FAILED = "Could not start a session. Check your connection and try again.";

export async function signIn(email: string, password: string): Promise<Result> {
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  await new Promise((r) => setTimeout(r, 300));
  const ok = useAppStore.getState().login(email);
  // Accounts are per-browser, so a first-time visitor has nothing to log in to.
  // Flagged so the form can offer signup with this email rather than dead-ending.
  if (!ok) return { ok: false, code: "no-account", error: "No account with this email exists in this browser. Accounts are saved per browser, so you need to create one here first." };
  if (!(await openServerSession())) {
    useAppStore.getState().logout();
    return { ok: false, error: SESSION_FAILED };
  }
  return { ok: true };
}

export async function signUp(name: string, email: string, password: string): Promise<Result> {
  if (!name.trim()) return { ok: false, error: "Enter your name." };
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  await new Promise((r) => setTimeout(r, 300));
  // Accounts live per browser, so a repeat email would otherwise silently take over
  // the existing one. Refuse instead and point the person at logging in.
  if (!useAppStore.getState().signup(name.trim(), email.trim())) {
    return { ok: false, code: "duplicate", error: "An account with this email already exists in this browser. Log in instead." };
  }
  if (!(await openServerSession())) {
    useAppStore.getState().logout();
    return { ok: false, error: SESSION_FAILED };
  }
  return { ok: true };
}

/** The one-click demo account, which needs a real session like any other sign-in. */
export async function signInDemo(): Promise<Result> {
  useAppStore.getState().loginDemo();
  if (!(await openServerSession())) {
    useAppStore.getState().logout();
    return { ok: false, error: SESSION_FAILED };
  }
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await closeServerSession();
  useAppStore.getState().logout();
}
