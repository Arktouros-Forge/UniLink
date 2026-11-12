import { client } from "@database/client";

import { explain } from "./lib/explain";

import { seedCompetitions } from "./competitions.seed";
import { createContext, SEED_CREDENTIALS } from "./lib/context";
import { seedTasks } from "./tasks.seed";
import { seedReference } from "./reference.seed";
import { seedStudy } from "./study.seed";
import { seedUsers } from "./users.seed";

async function main() {
  const started = performance.now();
  console.log("Seeding UniLink...\n");

  const [{ ready }] = await client`select to_regclass('public.users') is not null as ready`;
  if (!ready) {
    throw new Error("Tables not found. Run `bun run db:migrate` first, or `bun run db:reset` for a clean start.");
  }

  const ctx = createContext();

  await seedReference(ctx);
  await seedUsers(ctx);
  await seedCompetitions(ctx);
  await seedStudy(ctx);
  await seedTasks(ctx);

  console.log(`\n✓ Done in ${Math.round(performance.now() - started)} ms`);
  console.log(
    `  Student: ${SEED_CREDENTIALS.student.email} / ${SEED_CREDENTIALS.student.password}`,
  );
  console.log(
    `  Admin:   ${SEED_CREDENTIALS.admin.email} / ${SEED_CREDENTIALS.admin.password}`,
  );
}

try {
  await main();
} catch (error) {
  console.error("\n✗ Seeding failed:", error);
  console.error(explain(error));
  process.exitCode = 1;
} finally {
  await client.end();
}
