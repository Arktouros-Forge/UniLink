import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { skills } from "./skills";

export const helpSignStatusEnum = pgEnum("help_sign_status", [
  "open",
  "fulfilled",
  "closed",
  "expired",
]);

export const studyRequestInitiatorEnum = pgEnum("study_request_initiator", [
  "requester",
  "helper",
]);

export const studyRequestStatusEnum = pgEnum("study_request_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
  "cancelled",
]);

export const helpSigns = pgTable(
  "help_signs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description").notNull(),
    preferredTime: text("preferred_time"),

    status: helpSignStatusEnum("status").notNull().default("open"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    closedAt: timestamp("closed_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    index("help_signs_skill_id_idx").on(table.skillId),
    index("help_signs_user_id_idx").on(table.userId),
    index("help_signs_status_idx").on(table.status),
  ],
);

export const studyRequests = pgTable(
  "study_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    helperId: uuid("helper_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    initiatedBy: studyRequestInitiatorEnum("initiated_by")
      .notNull()
      .default("requester"),

    signId: uuid("sign_id").references(() => helpSigns.id, {
      onDelete: "set null",
    }),

    subject: text("subject").notNull(),
    description: text("description").notNull(),
    preferredTime: text("preferred_time"),

    status: studyRequestStatusEnum("status").notNull().default("pending"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    respondedAt: timestamp("responded_at", {
      withTimezone: true,
    }),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    index("study_requests_requester_id_idx").on(table.requesterId),
    index("study_requests_helper_id_idx").on(table.helperId),
    index("study_requests_sign_id_idx").on(table.signId),
    index("study_requests_status_idx").on(table.status),
  ],
);
