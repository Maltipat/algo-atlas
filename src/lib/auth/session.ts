/**
 * Server-visible sessions.
 *
 * The app's accounts live in the browser (see src/services/auth-service.ts), which
 * gives the server nothing to check. This module adds the missing half: when the
 * existing login, signup or demo entry point succeeds, the client asks the server
 * to mint a session, and the server returns an HttpOnly cookie holding a payload
 * signed with HMAC-SHA256. Protected routes verify that signature before doing any
 * work, so a request without a valid cookie is rejected whatever the client does.
 *
 * Web Crypto only, so this runs unchanged in middleware (Edge) and route handlers.
 */

export const SESSION_COOKIE = "algoatlas_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session = {
  /** User id from the client store, for correlating with client-side progress. */
  uid: string;
  email: string;
  name: string;
  /** Issued at / expires at, both seconds since epoch. */
  iat: number;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Fails closed: with no usable AUTH_SECRET nothing can be signed and nothing
 * verifies, so every protected route rejects rather than silently trusting input.
 * Development falls back to a fixed secret so `npm run dev` works out of the box.
 */
function secret(): string | null {
  const configured = process.env.AUTH_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === "production") return null;
  return "dev-only-insecure-secret-do-not-use-in-production";
}

export function sessionSecretConfigured(): boolean {
  return secret() !== null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

async function hmacKey(): Promise<CryptoKey | null> {
  const value = secret();
  if (!value) return null;
  return crypto.subtle.importKey("raw", encoder.encode(value), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Returns `<payload>.<signature>`, or null when no secret is configured. */
export async function signSession(input: Pick<Session, "uid" | "email" | "name">): Promise<string | null> {
  const key = await hmacKey();
  if (!key) return null;
  const now = Math.floor(Date.now() / 1000);
  const session: Session = { ...input, iat: now, exp: now + SESSION_MAX_AGE };
  const payload = toBase64Url(encoder.encode(JSON.stringify(session)));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
  return `${payload}.${toBase64Url(signature)}`;
}

/** Verifies the signature and expiry. Any tampering or truncation yields null. */
export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const key = await hmacKey();
  if (!key) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;
  const payload = token.slice(0, separator);
  const signature = fromBase64Url(token.slice(separator + 1));
  if (!signature) return null;

  const valid = await crypto.subtle.verify("HMAC", key, signature as BufferSource, encoder.encode(payload));
  if (!valid) return null;

  const decoded = fromBase64Url(payload);
  if (!decoded) return null;
  try {
    const session = JSON.parse(decoder.decode(decoded)) as Session;
    if (typeof session?.uid !== "string" || typeof session?.email !== "string" || typeof session?.exp !== "number") return null;
    if (session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

/** Reads the session cookie straight off a request, for handlers without `cookies()`. */
export async function sessionFromRequest(req: Request): Promise<Session | null> {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) return verifySession(rest.join("="));
  }
  return null;
}
