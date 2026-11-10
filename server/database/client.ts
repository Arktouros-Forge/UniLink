import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) throw new Error("DATABASE_URL is not configured");

const flag = process.env.DATABASE_SSL?.trim().toLowerCase();
const isLocal = /@(localhost|127\.0\.0\.1|\[::1\]|host\.docker\.internal)(:|\/|$)/.test(url);
const ssl = flag === "true" ? "require" : flag === "false" ? false : isLocal ? false : "require";

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
    ssl,
    prepare: process.env.DATABASE_PREPARE !== "false",
    transform: { undefined: null },
  }));

export const db = drizzle(client, { schema });
