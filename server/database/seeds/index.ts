import { client } from "@database/client";

import { seedUsers } from "./users.seed";
import { seedSkills } from "./skills.seed";
import { seedCategories } from "./categories.seed";
import { seedLecturers } from "./lecturers.seed";
import { seedCompetitions } from "./competitions.seed";

async function main() {
  console.log("Starting UniLink database seeding...\n");

  await seedUsers();
  await seedSkills();
  await seedCategories();
  await seedLecturers();
  await seedCompetitions();

  console.log("\n✓ Database seeding completed");
}

try {
  await main();
} catch (error) {
  console.error("\n✗ Database seeding failed:", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
