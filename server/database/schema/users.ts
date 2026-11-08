import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, tz, updatedAt } from "./_shared";

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

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    username: text("username").notNull().unique(),
    email: text("email").notNull(),
    password: text("password").notNull(),

    fullName: text("full_name").notNull(),
    nim: text("nim").unique(),
    phone: text("phone"),

    role: userRoleEnum("role").notNull().default("student"),
    year: cohortYearEnum("year"),

    major: text("major"),
    bio: text("bio"),
    personalWebsite: text("personal_website"),
    profilePhotoUrl: text("profile_photo_url"),

    status: userStatusEnum("status").notNull().default("active"),
    blockedReason: text("blocked_reason"),
    firebaseUid: text("firebase_uid").unique(),
    emailVerifiedAt: tz("email_verified_at"),
    sessionVersion: integer("session_version").notNull().default(0),
    onboardedAt: tz("onboarded_at"),
    lastLoginAt: tz("last_login_at"),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("users_email_lower_unique").on(sql`lower(${t.email})`),
    index("users_role_status_idx").on(t.role, t.status),
    index("users_year_idx").on(t.year),
    index("users_full_name_trgm_idx").using(
      "gin",
      sql`${t.fullName} gin_trgm_ops`,
    ),
  ],
);
