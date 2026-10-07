import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, sessionFromRequest, sessionSecretConfigured, signSession } from "@/lib/auth/session";

/**
 * The session endpoint the existing client-side login, signup and demo flows call
 * once they succeed. It issues the HttpOnly cookie that protected routes verify.
 *
 * GET    — report whether this request carries a valid session.
 * POST   — mint a session cookie.
 * DELETE — clear it (log out).
 */

const EMAIL = /^\S+@\S+\.\S+$/;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function GET(req: Request) {
  const session = await sessionFromRequest(req);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 200 });
  return NextResponse.json({ authenticated: true, user: { uid: session.uid, email: session.email, name: session.name } });
}

export async function POST(req: Request) {
  if (!sessionSecretConfigured()) {
    return NextResponse.json({ error: "Sessions are unavailable: AUTH_SECRET is not configured on the server." }, { status: 500 });
  }

  let body: { uid?: unknown; email?: unknown; name?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const uid = typeof body.uid === "string" ? body.uid.slice(0, 64) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!uid || !EMAIL.test(email) || !name) {
    return NextResponse.json({ error: "uid, a valid email and name are required." }, { status: 400 });
  }

  const token = await signSession({ uid, email, name });
  if (!token) return NextResponse.json({ error: "Could not issue a session." }, { status: 500 });

  const res = NextResponse.json({ authenticated: true, user: { uid, email, name } });
  res.cookies.set(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}
