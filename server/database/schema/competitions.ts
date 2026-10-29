import {
  pgEnum,
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  uniqueIndex,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

import { users } from "./users";
import { categories } from "./categories";

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
    deadline: timestamp("deadline", {
      withTimezone: true,
    }).notNull(),

    maxTeamSize: integer("max_team_size"),

    host: text("host").notNull(),
    sourceUrl: text("source_url"),
    imageUrl: text("image_url"),

    status: competitionStatusEnum("status").notNull().default("draft"),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdByRole: competitionCreatorRoleEnum("created_by_role").notNull(),

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
  },
  (table) => [
    uniqueIndex("competitions_title_host_unique").on(
      sql`lower(btrim(${table.title}))`,
      sql`lower(btrim(${table.host}))`,
    ),
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
  (table) => [
    primaryKey({
      columns: [table.competitionId, table.categoryId],
    }),
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

    resultReportedAt: timestamp("result_reported_at", {
      withTimezone: true,
    }),

    resultReportedBy: uuid("result_reported_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("teams_competition_id_idx").on(table.competitionId),
    uniqueIndex("teams_competition_creator_unique").on(
      table.competitionId,
      table.creatorId,
    ),
  ],
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    status: teamMemberStatusEnum("status").notNull().default("accepted"),

    joinedAt: timestamp("joined_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("team_members_team_user_unique").on(table.teamId, table.userId),

    index("team_members_user_id_idx").on(table.userId),
  ],
);
