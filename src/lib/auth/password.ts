import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number, options: { N: number; r: number; p: number }) => Promise<Buffer>;

/**
 * Password hashing with scrypt from node:crypto — memory-hard, in the standard
 * library, no dependency to keep patched.
 *
 * Stored as `scrypt$N$r$p$salt$hash`, all base64. Keeping the parameters in the
 * string means existing hashes stay verifiable if the cost is raised later.
 */
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, PARAMS);
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

/** Constant-time comparison. Returns false for anything malformed rather than throwing. */
export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const N = Number(n), rr = Number(r), pp = Number(p);
  if (!Number.isFinite(N) || !Number.isFinite(rr) || !Number.isFinite(pp)) return false;

  try {
    const salt = Buffer.from(saltB64!, "base64");
    const expected = Buffer.from(hashB64!, "base64");
    const derived = await scrypt(password, salt, expected.length, { N, r: rr, p: pp });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
