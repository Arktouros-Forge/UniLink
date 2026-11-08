import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, tz } from "./_shared";
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
    course: text("course"),
    dueDate: date("due_date"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),

    completed: boolean("completed").notNull().default(false),
    completedAt: tz("completed_at"),

    createdAt: createdAt(),
  },
  (t) => [
    index("tasks_user_open_due_idx").on(t.userId, t.completed, t.dueDate),
    check(
      "tasks_completed_at_check",
      sql`(${t.completed} and ${t.completedAt} is not null) or (not ${t.completed} and ${t.completedAt} is null)`,
    ),
  ],
);
