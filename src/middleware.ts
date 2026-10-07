import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_REQUIRED_MESSAGE, loginUrl, requiresSession } from "@/lib/auth/routes";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Server-side gate in front of every page and API that needs an account.
 *
 * Default-deny: a path is reachable without a session only if src/lib/auth/routes.ts
 * lists it as public. Protected APIs get 401; protected pages redirect to /login,
 * so typing a URL directly or refreshing cannot slip past the check.
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!requiresSession(pathname)) return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: LOGIN_REQUIRED_MESSAGE }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  const target = loginUrl(`${pathname}${search}`);
  url.pathname = target.slice(0, target.indexOf("?"));
  url.search = target.slice(target.indexOf("?"));
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next's own assets and static files in /public.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|webmanifest)$).*)"],
};
