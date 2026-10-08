import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, cookieOptions, createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const EMAIL = /^\S+@\S+\.\S+$/;
/** One message for both "no such user" and "wrong password", so it cannot be used to enumerate accounts. */
const INVALID = "Email or password is incorrect.";

/**
 * POST /api/auth/login — exchange credentials for a session.
 *
 * Identity comes from verifying the password against the stored hash. Nothing the
 * client claims about who it is has any effect.
 */
export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Accounts are unavailable: the server has no database configured." }, { status: 503 });
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!password) return NextResponse.json({ error: "Enter your password." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, name: true, passwordHash: true } });

  // Hash even when the user is unknown, so the reply takes a similar time either way.
  const ok = await verifyPassword(password, user?.passwordHash ?? null);
  if (!user || !ok) return NextResponse.json({ error: INVALID }, { status: 401 });

  const token = await createSession(user.id, req.headers.get("user-agent"));
  if (!token) return NextResponse.json({ error: "Could not start a session." }, { status: 500 });
  const res = NextResponse.json({ authenticated: true, user: { id: user.id, email: user.email, name: user.name } });
  res.cookies.set(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE });
  return res;
}
