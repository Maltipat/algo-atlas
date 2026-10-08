"use client";

import { useAppStore } from "@/store/app-store";

/**
 * Authentication against the server.
 *
 * Credentials go to /api/auth/login or /api/auth/signup, which verify them against
 * the stored password hash and reply with an HttpOnly session cookie. The identity in
 * that reply is what the local progress vault is bound to — the client never decides
 * who it is, and there is no longer any endpoint that mints a session from a
 * caller-supplied uid or email.
 */
type Result = { ok: true } | { ok: false; error: string; code?: "no-account" | "duplicate" };

const EMAIL = /^\S+@\S+\.\S+$/;
const OFFLINE = "Could not reach the server. Check your connection and try again.";

type AuthResponse = { authenticated?: boolean; user?: { id: string; email: string; name: string }; error?: string; code?: string };

async function post(path: string, body: unknown): Promise<{ status: number; data: AuthResponse } | null> {
  try {
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as AuthResponse;
    return { status: res.status, data };
  } catch {
    return null;
  }
}

/** Binds local progress to the verified identity and reports success. */
function adopt(data: AuthResponse): Result {
  if (!data.user) return { ok: false, error: OFFLINE };
  useAppStore.getState().adoptServerUser(data.user);
  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<Result> {
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (!password) return { ok: false, error: "Enter your password." };

  const res = await post("/api/auth/login", { email, password });
  if (!res) return { ok: false, error: OFFLINE };
  if (res.status === 401) return { ok: false, error: res.data.error ?? "Email or password is incorrect." };
  if (res.status !== 200) return { ok: false, error: res.data.error ?? "Could not log in." };
  return adopt(res.data);
}

export async function signUp(name: string, email: string, password: string): Promise<Result> {
  if (!name.trim()) return { ok: false, error: "Enter your name." };
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const res = await post("/api/auth/signup", { name: name.trim(), email, password });
  if (!res) return { ok: false, error: OFFLINE };
  if (res.status === 409) return { ok: false, code: "duplicate", error: res.data.error ?? "An account with this email already exists." };
  if (res.status !== 200) return { ok: false, error: res.data.error ?? "Could not create the account." };
  return adopt(res.data);
}

/**
 * The shared demo account. It authenticates one fixed, publicly advertised account
 * on the server — it is not a way to become an arbitrary user.
 */
export async function signInDemo(): Promise<Result> {
  const res = await post("/api/auth/demo", {});
  if (!res) return { ok: false, error: OFFLINE };
  if (res.status !== 200) return { ok: false, error: res.data.error ?? "Could not open the demo account." };
  return adopt(res.data);
}

export async function closeServerSession(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    /* the local session is cleared regardless; the row is revoked on the next successful call */
  }
}

/** True when this browser holds a session the server still accepts. */
export async function hasServerSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return false;
    return ((await res.json()) as { authenticated?: boolean }).authenticated === true;
  } catch {
    return false;
  }
}

export async function signOut(): Promise<void> {
  await closeServerSession();
  useAppStore.getState().logout();
}
