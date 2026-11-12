import { db } from "@database/client";
import { categories, skills } from "@database/schema";

import { categorySeeds, skillSeeds } from "./data/reference";
import type { SeedContext } from "./lib/context";
import { seedUuid } from "./lib/context";
import { slugify } from "./lib/random";
import { insertMany } from "./lib/insert";

export async function seedReference(ctx: SeedContext) {
  const skillRows = skillSeeds.map(([name, description], index) => ({
    id: seedUuid(10, index + 1),
    name,
    slug: slugify(name),
    description,
  }));
  await insertMany(skills, skillRows);
  skillRows.forEach((row) => ctx.ids.skills.set(row.name, row.id));

  const categoryRows = categorySeeds.map(
    ([name, description, color], index) => ({
      id: seedUuid(11, index + 1),
      name,
      slug: slugify(name),
      description,
      color,
    }),
  );
  await insertMany(categories, categoryRows);
  categoryRows.forEach((row) => ctx.ids.categories.set(row.name, row.id));

  console.log(
    `✓ Reference data: ${skillRows.length} skills, ${categoryRows.length} categories`,
  );
}

export { db };
