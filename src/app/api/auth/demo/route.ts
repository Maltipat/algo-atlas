import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, cookieOptions, createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const DEMO_EMAIL = "demo@algoatlas.app";

/**
 * POST /api/auth/demo — sign in to the shared, publicly advertised demo account.
 *
 * This authenticates one fixed account and ignores the request body entirely, so it
 * cannot be used to become somebody else. It exists so a visitor can look around
 * without creating an account; everything it unlocks is sample data.
 */
export async function POST() {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Accounts are unavailable: the server has no database configured." }, { status: 503 });
  }

  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL }, select: { id: true, email: true, name: true } });
  if (!user) {
    user = await prisma.user.create({
      // The password is never advertised; the demo is entered through this route.
      data: { email: DEMO_EMAIL, name: "Demo Learner", username: "demo_learner", passwordHash: await hashPassword(crypto.randomUUID() + crypto.randomUUID()) },
      select: { id: true, email: true, name: true },
    });
  }

  const token = await createSession(user.id, "demo");
  if (!token) return NextResponse.json({ error: "Could not start a session." }, { status: 500 });
  const res = NextResponse.json({ authenticated: true, user });
  res.cookies.set(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE });
  return res;
}
