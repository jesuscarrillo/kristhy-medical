import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

// During build time (e.g., Docker build), use a dummy connection string
// This is safe because we don't actually connect to the DB during build
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                    process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL && !process.env.DIRECT_URL;

const connectionString = process.env.DATABASE_URL ??
                        process.env.DIRECT_URL ??
                        (isBuildTime ? 'postgresql://dummy:dummy@localhost:5432/dummy?pgbouncer=true' : '');

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set");
}

const pool = globalForPrisma.prismaPool ?? new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}
