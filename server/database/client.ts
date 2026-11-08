import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) throw new Error("DATABASE_URL is not configured");

const globalForDb = globalThis as unknown as {
  __unilinkSql?: ReturnType<typeof postgres>;
};

export const client =
  globalForDb.__unilinkSql ??
  (globalForDb.__unilinkSql = postgres(url, {
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 60 * 30,
    ssl: process.env.DATABASE_SSL === "false" ? false : "require",
    prepare: process.env.DATABASE_PREPARE !== "false",
    transform: { undefined: null },
  }));

export const db = drizzle(client, { schema });
