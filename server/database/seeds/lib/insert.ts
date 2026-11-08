import type { PgTable } from "drizzle-orm/pg-core";

import { db } from "@database/client";

import { chunk } from "./random";

export async function insertMany<T extends PgTable>(
  table: T,
  rows: T["$inferInsert"][],
  size = 400,
) {
  for (const part of chunk(rows, size)) {
    await db.insert(table).values(part).onConflictDoNothing();
  }
  return rows.length;
}
