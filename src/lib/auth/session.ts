import { createHash, randomBytes } from "node:crypto";
import { getPrisma } from "@/lib/db";

/**
 * Database-backed sessions.
 *
 * The cookie carries an opaque 32-byte random token and nothing else — no identity,
 * no claims. Identity comes from the Session row the token's hash resolves to, so a
 * client cannot assert who it is. Only the SHA-256 of the token is stored, so reading
 * the table does not yield usable cookies.
 *
 * Because validity is a row rather than a signature, logging out can withdraw it:
 * revokedAt is set and every later request with that cookie fails. A stateless signed
 * token cannot be taken back before it expires, which is what made stolen cookies
 * replayable.
 *
 * Node runtime only (node:crypto + Prisma).
 */

export const SESSION_COOKIE = "algoatlas_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session = { uid: string; email: string; name: string; sessionId: string };

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

/** Creates a row and returns the raw token, which is only ever seen by this browser. */
export async function createSession(userId: string, userAgent?: string | null): Promise<string | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      userAgent: userAgent?.slice(0, 255) ?? null,
    },
  });
  return token;
}

/** Resolves a token to its user, or null when missing, unknown, expired or revoked. */
export async function resolveSession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const prisma = getPrisma();
  if (!prisma) return null;
  const row = await prisma.session
    .findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } })
    .catch(() => null);
  if (!row) return null;
  if (row.revokedAt) return null;
  if (row.expiresAt.getTime() <= Date.now()) return null;
  return { uid: row.userId, email: row.user.email, name: row.user.name, sessionId: row.id };
}

/** Logout. Idempotent, and a token that is already gone is treated as success. */
export async function revokeSession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.session
    .updateMany({ where: { tokenHash: hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } })
    .catch(() => undefined);
}

/** Signs every other session for this user out, used when the password changes. */
export async function revokeAllSessions(userId: string): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }).catch(() => undefined);
}

function readCookieHeader(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

export function tokenFromRequest(req: Request): string | undefined {
  return readCookieHeader(req.headers.get("cookie"), SESSION_COOKIE);
}

/** The one call every protected route handler makes before doing any work. */
export async function sessionFromRequest(req: Request): Promise<Session | null> {
  return resolveSession(tokenFromRequest(req));
}
