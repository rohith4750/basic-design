import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT ?? "5432"}/${process.env.DB_NAME}`;

if (!connectionString || connectionString.includes("undefined")) {
  throw new Error("Missing PostgreSQL environment variables.");
}

type GlobalPg = {
  pool?: Pool;
};

const globalForPg = globalThis as typeof globalThis & {
  _pg?: GlobalPg;
};

const cache = globalForPg._pg ?? {};

if (!cache.pool) {
  cache.pool = new Pool({ connectionString });
}

globalForPg._pg = cache;

export const pg = cache.pool;
