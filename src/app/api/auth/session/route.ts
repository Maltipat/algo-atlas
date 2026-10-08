import { NextResponse } from "next/server";
import { SESSION_COOKIE, cookieOptions, revokeSession, sessionFromRequest, tokenFromRequest } from "@/lib/auth/session";

export const runtime = "nodejs";

/**
 * GET    — report the current session, resolved from the database.
 * DELETE — log out: revoke the row, then clear the cookie.
 *
 * There is deliberately no POST. Sessions are issued only by /api/auth/signup and
 * /api/auth/login, which establish identity from credentials. The previous POST here
 * minted a session from whatever uid/email the caller supplied, which let anyone
 * authenticate as anyone with a single fetch.
 */
export async function GET(req: Request) {
  const session = await sessionFromRequest(req);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 200 });
  return NextResponse.json({ authenticated: true, user: { uid: session.uid, email: session.email, name: session.name } });
}

export async function DELETE(req: Request) {
  // Revoke first: if clearing the cookie somehow fails, the token is already dead.
  await revokeSession(tokenFromRequest(req));
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}

export async function POST() {
  return NextResponse.json(
    { error: "Sessions are issued by /api/auth/login and /api/auth/signup only." },
    { status: 405, headers: { Allow: "GET, DELETE" } },
  );
}
