import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt } from "./_shared";
import { lecturers } from "./lecturers";
import { users } from "./users";

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

    createdAt: createdAt(),
  },
  (t) => [
    index("timetable_events_user_day_idx").on(
      t.userId,
      t.dayOfWeek,
      t.startTime,
    ),
    index("timetable_events_lecturer_id_idx").on(t.lecturerId),
    check("timetable_events_day_check", sql`${t.dayOfWeek} between 1 and 7`),
    check("timetable_events_time_check", sql`${t.endTime} > ${t.startTime}`),
  ],
);
