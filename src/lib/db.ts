import { PrismaClient } from "@prisma/client";

/**
 * Lazy Prisma client.
 *
 * Constructed on first use rather than at import, so a deployment without
 * DATABASE_URL does not throw inside middleware — which runs on every request and
 * would turn a configuration gap into a site-wide 500. Callers get null instead and
 * fail closed: no session resolves, protected routes refuse, public pages still work.
 *
 * Next reloads modules in development, so the instance is parked on globalThis to
 * avoid exhausting database connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function databaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getPrisma(): PrismaClient | null {
  if (!databaseConfigured()) return null;
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient();
    } catch {
      return null;
    }
  }
  return globalForPrisma.prisma;
}
