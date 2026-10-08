/**
 * The single definition of what is public and what needs a session.
 *
 * Imported by both src/middleware.ts (server enforcement) and the app shell
 * (client guard), so the two can never disagree about which pages are protected.
 *
 * The rule is default-deny: anything not matched below requires a session.
 */

export const LOGIN_REQUIRED_MESSAGE = "Please log in first to access this feature.";

/**
 * Readable without an account: the dashboard, the curriculum, the problem
 * library and the auth pages. These let someone see what the app offers before
 * signing up. Anything personal — progress, saved data, user-specific
 * recommendations — is not here and therefore requires a session.
 *
 * Public pages may still contain protected *actions* (run, submit, bookmark);
 * those are gated at the action, not the page.
 */
const PUBLIC_PAGES: RegExp[] = [
  /^\/$/, // dashboard, which renders a signed-out overview
  /^\/login$/,
  /^\/signup$/,
  /^\/problems$/,
  /^\/problems\/[^/]+$/,
  /^\/topics$/,
  /^\/topics\/[^/]+$/,
  /^\/patterns$/,
  /^\/patterns\/[^/]+$/,
  /^\/roadmap$/,
  /^\/courses$/,
  /^\/search$/,
];

// Deliberately absent, so default-deny covers them: the whole Interview
// experience (/interview, /interview/plans/*, /mock-interview) and Companies
// (/companies, /companies/[slug]), which are interview preparation too.

/** Content lookups behind the public pages. Read-only, no personal data. */
const PUBLIC_APIS: RegExp[] = [
  /^\/api\/problems(\/|$)/,
  /^\/api\/topics(\/|$)/,
  /^\/api\/patterns(\/|$)/,
  /^\/api\/search(\/|$)/,
  /^\/api\/daily-challenge(\/|$)/,
  /^\/api\/auth\/(session|login|signup|demo)$/,
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

/**
 * Only ever redirect to a path inside this app. Anything else — an absolute URL,
 * a protocol-relative `//evil.com`, a backslash variant that some browsers
 * normalise to one — becomes the dashboard, so `next` cannot drive an open
 * redirect off-site.
 */
export function safeNext(raw: string | null | undefined): string {
  if (!raw) return "/";
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return "/";
  }
  value = value.trim();
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (/^\/[^/]*:/.test(value)) return "/";
  return value;
}

/** Carries the destination from the login page into signup, so it survives the detour. */
export function signupUrl(nextPath: string, email?: string): string {
  const params = new URLSearchParams();
  if (nextPath && nextPath !== "/") params.set("next", nextPath);
  if (email) params.set("email", email);
  const qs = params.toString();
  return qs ? `/signup?${qs}` : "/signup";
}

/**
 * Public pages that still hold account-only actions, listed so the UI can label
 * them honestly. Nothing is enforced from this list — the actions gate themselves.
 */
export const PUBLIC_PAGES_WITH_PROTECTED_ACTIONS = [
  { path: "/problems", actions: ["Bookmark"] },
  { path: "/problems/[slug]", actions: ["Run", "Submit", "Bookmark", "Save draft", "Track progress", "Rate for revision"] },
] as const;
