import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  boolean,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    notes: text("notes"),

    dueDate: date("due_date"),

    priority: taskPriorityEnum("priority").notNull().default("medium"),

    completed: boolean("completed").notNull().default(false),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    index("tasks_user_id_idx").on(table.userId),
    index("tasks_due_date_idx").on(table.dueDate),
  ],
);
