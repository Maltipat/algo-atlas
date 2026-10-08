import { NextResponse } from "next/server";
import type { PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, cookieOptions, createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const EMAIL = /^\S+@\S+\.\S+$/;

/** Derives a unique @handle, since username is unique in the schema. */
async function uniqueUsername(prisma: PrismaClient, email: string): Promise<string> {
  const base = (email.split("@")[0] ?? "user").replace(/[^a-z0-9_]/gi, "_").toLowerCase().slice(0, 24) || "user";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}${i}`;
    if (!(await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } }))) return candidate;
  }
  return `${base}${Date.now().toString(36)}`;
}

/**
 * POST /api/auth/signup — create an account and sign it in.
 *
 * The password is hashed before storage and never logged or returned. The response
 * carries no token in its body; the session is handed back only as an HttpOnly cookie.
 */
export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Accounts are unavailable: the server has no database configured." }, { status: 503 });
  }

  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name) return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (password.length > 200) return NextResponse.json({ error: "Password must be under 200 characters." }, { status: 400 });

  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    return NextResponse.json({ error: "An account with this email already exists. Log in instead.", code: "duplicate" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { email, name, username: await uniqueUsername(prisma, email), passwordHash: await hashPassword(password) },
    select: { id: true, email: true, name: true },
  });

  const token = await createSession(user.id, req.headers.get("user-agent"));
  if (!token) return NextResponse.json({ error: "Could not start a session." }, { status: 500 });
  const res = NextResponse.json({ authenticated: true, user });
  res.cookies.set(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE });
  return res;
}
