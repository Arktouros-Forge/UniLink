import { sql } from "drizzle-orm";
import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "./_shared";

export const lecturers = pgTable(
  "lecturers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    profilePhotoUrl: text("profile_photo_url"),
    bio: text("bio"),
    nidn: text("nidn").unique(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("lecturers_email_lower_unique").on(sql`lower(${t.email})`),
  ],
);
