import { index, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "./_shared";
import { users } from "./users";

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const userSkills = pgTable(
  "user_skills",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),

    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.skillId] }),
    index("user_skills_skill_id_idx").on(t.skillId),
  ],
);
