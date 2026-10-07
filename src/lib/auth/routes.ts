/**
 * The single definition of what is public and what needs a session.
 *
 * Imported by both src/middleware.ts (server enforcement) and the app shell
 * (client guard), so the two can never disagree about which pages are protected.
 *
 * The rule is default-deny: anything not matched below requires a session.
 */

export const LOGIN_REQUIRED_MESSAGE = "Please log in first to access this feature.";

/** Readable without an account: the curriculum and the auth pages themselves. */
const PUBLIC_PAGES: RegExp[] = [
  /^\/login$/,
  /^\/signup$/,
  /^\/problems$/,
  /^\/problems\/[^/]+$/,
  /^\/topics$/,
  /^\/topics\/[^/]+$/,
  /^\/patterns$/,
  /^\/patterns\/[^/]+$/,
  /^\/companies$/,
  /^\/companies\/[^/]+$/,
  /^\/roadmap$/,
  /^\/courses$/,
  /^\/interview$/,
  /^\/search$/,
];

/** Content lookups behind the public pages. Read-only, no personal data. */
const PUBLIC_APIS: RegExp[] = [
  /^\/api\/problems(\/|$)/,
  /^\/api\/topics(\/|$)/,
  /^\/api\/patterns(\/|$)/,
  /^\/api\/companies(\/|$)/,
  /^\/api\/search(\/|$)/,
  /^\/api\/daily-challenge(\/|$)/,
  /^\/api\/auth\/session$/,
];

export function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.some((pattern) => pattern.test(pathname));
}

export function isPublicApi(pathname: string): boolean {
  return PUBLIC_APIS.some((pattern) => pattern.test(pathname));
}

/** True when this path may only be reached with a valid session. */
export function requiresSession(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return !isPublicApi(pathname);
  return !isPublicPage(pathname);
}

export function loginUrl(nextPath: string): string {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}
