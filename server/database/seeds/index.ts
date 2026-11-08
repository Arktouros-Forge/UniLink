import { client } from "@database/client";

import { seedCompetitions } from "./competitions.seed";
import { createContext, SEED_CREDENTIALS } from "./lib/context";
import { seedPlanner } from "./planner.seed";
import { seedReference } from "./reference.seed";
import { seedStudy } from "./study.seed";
import { seedUsers } from "./users.seed";

async function main() {
  const started = performance.now();
  console.log("Seeding UniLink...\n");

  const ctx = createContext();

  await seedReference(ctx);
  await seedUsers(ctx);
  await seedCompetitions(ctx);
  await seedStudy(ctx);
  await seedPlanner(ctx);

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
  process.exitCode = 1;
} finally {
  await client.end();
}
