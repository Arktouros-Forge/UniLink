import { sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, tz } from "./_shared";
import { skills } from "./skills";
import { users } from "./users";

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

    createdAt: createdAt(),
    expiresAt: tz("expires_at").notNull(),
    closedAt: tz("closed_at"),
  },
  (t) => [
    index("help_signs_board_idx").on(t.status, t.expiresAt),
    index("help_signs_skill_status_idx").on(t.skillId, t.status),
    index("help_signs_user_id_idx").on(t.userId, t.createdAt),
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

    createdAt: createdAt(),
    respondedAt: tz("responded_at"),
    expiresAt: tz("expires_at").notNull(),
    deletedAt: tz("deleted_at"),
  },
  (t) => [
    index("study_requests_requester_idx").on(
      t.requesterId,
      t.status,
      t.createdAt,
    ),
    index("study_requests_helper_idx").on(t.helperId, t.status, t.createdAt),
    index("study_requests_sign_id_idx").on(t.signId),
    uniqueIndex("study_requests_one_pending_per_pair")
      .on(t.requesterId, t.helperId, sql`lower(btrim(${t.subject}))`)
      .where(sql`${t.status} = 'pending' and ${t.deletedAt} is null`),
  ],
);
