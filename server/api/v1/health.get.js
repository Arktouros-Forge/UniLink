import { sql } from "drizzle-orm";

import { db } from "@database/index";
import { defineApi } from "@server/utils/api.js";

export default defineApi({ auth: false }, async () => {
  const started = performance.now();
  await db.execute(sql`select 1`);
  return {
    status: "ok",
    database: "up",
    latencyMs: Math.round(performance.now() - started),
  };
});
