import { db } from "@database/client";
import { categories, lecturers, skills } from "@database/schema";

import { categorySeeds, lecturerSeeds, skillSeeds } from "./data/reference";
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

  const lecturerRows = lecturerSeeds.map(
    ([name, handle, nidn, bio], index) => ({
      id: seedUuid(12, index + 1),
      name,
      email: `${handle}@unud.test`,
      phone: `+62${ctx.rng.int(811, 859)}${ctx.rng.int(1000000, 9999999)}`,
      nidn,
      bio,
    }),
  );
  await insertMany(lecturers, lecturerRows);
  ctx.ids.lecturers = lecturerRows.map((row) => row.id);

  console.log(
    `✓ Reference data: ${skillRows.length} skills, ${categoryRows.length} categories, ${lecturerRows.length} lecturers`,
  );
}

export { db };
