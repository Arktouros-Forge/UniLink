import { client } from "@database/client";

import { explain } from "./lib/explain";

async function cleanDatabase() {
  if (process.env.ALLOW_DB_RESET?.toLowerCase() !== "true") {
    throw new Error(
      "Database reset blocked. Set ALLOW_DB_RESET=true in .env to continue.",
    );
  }

  console.log("Cleaning database...");

  await client.unsafe(`
    SET client_min_messages = warning;
    DROP SCHEMA IF EXISTS drizzle CASCADE;
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO CURRENT_USER;
    GRANT ALL ON SCHEMA public TO public;
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
  `);

  console.log("✓ Database cleaned (schemas dropped, run db:migrate next)");
}

try {
  await cleanDatabase();
} catch (error) {
  console.error("✗ Database cleaning failed:", error);
  console.error(explain(error));
  console.error(
    "  If your database user cannot drop the public schema, drop the tables manually or use a fresh database.",
  );
  process.exitCode = 1;
} finally {
  await client.end();
}
