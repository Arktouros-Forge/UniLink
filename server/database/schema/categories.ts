import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "./_shared";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").notNull(),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
