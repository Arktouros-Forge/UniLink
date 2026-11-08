import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, tz, updatedAt } from "./_shared";
import { categories } from "./categories";
import { users } from "./users";

export const competitionStatusEnum = pgEnum("competition_status", [
  "draft",
  "published",
  "closed",
]);

export const competitionCreatorRoleEnum = pgEnum("competition_creator_role", [
  "admin",
  "student",
]);

export const teamResultEnum = pgEnum("team_result", ["unknown", "won", "lost"]);

export const teamMemberStatusEnum = pgEnum("team_member_status", [
  "pending",
  "accepted",
]);

export const competitions = pgTable(
  "competitions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: text("title").notNull(),
    description: text("description").notNull(),
    deadline: tz("deadline").notNull(),
    maxTeamSize: integer("max_team_size"),

    host: text("host").notNull(),
    prize: text("prize"),
    sourceUrl: text("source_url"),
    imageUrl: text("image_url"),

    status: competitionStatusEnum("status").notNull().default("draft"),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdByRole: competitionCreatorRoleEnum("created_by_role").notNull(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("competitions_title_host_unique").on(
      sql`lower(btrim(${t.title}))`,
      sql`lower(btrim(${t.host}))`,
    ),
    index("competitions_status_deadline_idx").on(t.status, t.deadline),
    index("competitions_created_by_idx").on(t.createdBy),
    index("competitions_title_trgm_idx").using(
      "gin",
      sql`${t.title} gin_trgm_ops`,
    ),
    check("competitions_max_team_size_check", sql`${t.maxTeamSize} > 0`),
  ],
);

export const competitionCategories = pgTable(
  "competition_categories",
  {
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.competitionId, t.categoryId] }),
    index("competition_categories_category_idx").on(t.categoryId),
  ],
);

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    description: text("description"),
    maxMembers: integer("max_members"),

    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    result: teamResultEnum("result").notNull().default("unknown"),
    resultReportedAt: tz("result_reported_at"),
    resultReportedBy: uuid("result_reported_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("teams_competition_id_idx").on(t.competitionId),
    index("teams_creator_id_idx").on(t.creatorId),
    uniqueIndex("teams_competition_creator_unique").on(
      t.competitionId,
      t.creatorId,
    ),
    check("teams_max_members_check", sql`${t.maxMembers} > 0`),
  ],
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),

    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    status: teamMemberStatusEnum("status").notNull().default("pending"),

    joinedAt: tz("joined_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("team_members_team_user_unique").on(t.teamId, t.userId),
    uniqueIndex("team_members_one_accepted_per_competition")
      .on(t.competitionId, t.userId)
      .where(sql`${t.status} = 'accepted'`),
    index("team_members_user_status_idx").on(t.userId, t.status),
    index("team_members_team_status_idx").on(t.teamId, t.status),
  ],
);
