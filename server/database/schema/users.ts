import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["student", "admin"]);

export const userStatusEnum = pgEnum("user_status", ["active", "blocked"]);

export const cohortYearEnum = pgEnum("cohort_year", [
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),

  password: text("password").notNull(),

  fullName: text("full_name").notNull(),
  nim: text("nim").notNull().unique(),
  phone: text("phone").notNull(),

  role: userRoleEnum("role").notNull().default("student"),
  year: cohortYearEnum("year").notNull(),

  personalWebsite: text("personal_website"),
  profilePhotoUrl: text("profile_photo_url"),

  status: userStatusEnum("status").notNull().default("active"),
  blockedReason: text("blocked_reason"),

  lastLoginAt: timestamp("last_login_at", {
    withTimezone: true,
  }),

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
