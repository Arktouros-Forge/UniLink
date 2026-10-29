import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const lecturers = pgTable("lecturers", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),

  phone: text("phone"),
  profilePhotoUrl: text("profile_photo_url"),
  bio: text("bio"),
  nidn: text("nidn").unique(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
