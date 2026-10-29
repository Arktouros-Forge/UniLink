import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  time,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { lecturers } from "./lecturers";

export const timetableRecurrenceEnum = pgEnum("timetable_recurrence", [
  "none",
  "weekly",
]);

export const timetableSourceEnum = pgEnum("timetable_source", [
  "manual",
  "ics_import",
  "json_import",
]);

export const timetableEvents = pgTable(
  "timetable_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    courseCode: text("course_code"),
    title: text("title").notNull(),

    dayOfWeek: integer("day_of_week").notNull(),

    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),

    room: text("room"),

    lecturerId: uuid("lecturer_id").references(() => lecturers.id, {
      onDelete: "set null",
    }),

    lecturerNameFreeText: text("lecturer_name_free_text"),

    recurrence: timetableRecurrenceEnum("recurrence")
      .notNull()
      .default("weekly"),

    source: timetableSourceEnum("source").notNull().default("manual"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("timetable_events_user_id_idx").on(table.userId),
    index("timetable_events_lecturer_id_idx").on(table.lecturerId),
  ],
);
