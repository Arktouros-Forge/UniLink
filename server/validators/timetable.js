import { z } from "zod";

import { nullableText, timeString, trimmed } from "./common.js";

const normalizeTime = (value) => (value.length === 5 ? `${value}:00` : value);

const time = timeString.transform(normalizeTime);

export const eventBody = z
  .object({
    courseCode: nullableText(20),
    title: trimmed(2, 150),
    dayOfWeek: z.number().int().min(1).max(7),
    startTime: time,
    endTime: time,
    room: nullableText(60),
    lecturerId: z.uuid().nullable().optional(),
    lecturerNameFreeText: nullableText(120),
    recurrence: z.enum(["none", "weekly"]).default("weekly"),
  })
  .refine((d) => d.endTime > d.startTime, {
    path: ["endTime"],
    message: "End time must be after start time",
  });

export const eventPatch = z
  .object({
    courseCode: nullableText(20),
    title: trimmed(2, 150),
    dayOfWeek: z.number().int().min(1).max(7),
    startTime: time,
    endTime: time,
    room: nullableText(60),
    lecturerId: z.uuid().nullable(),
    lecturerNameFreeText: nullableText(120),
    recurrence: z.enum(["none", "weekly"]),
  })
  .partial()
  .refine(
    (d) => Object.keys(d).length > 0,
    "Provide at least one field to update",
  )
  .refine((d) => !d.startTime || !d.endTime || d.endTime > d.startTime, {
    path: ["endTime"],
    message: "End time must be after start time",
  });

const importedEvent = z.object({
  courseCode: z.string().max(20).nullish(),
  title: trimmed(2, 150),
  dayOfWeek: z.number().int().min(1).max(7),
  startTime: time,
  endTime: time,
  room: z.string().max(60).nullish(),
  lecturerName: z.string().max(120).nullish(),
  recurrence: z.enum(["none", "weekly"]).optional(),
});

export const importBody = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("json"),
    events: z.array(importedEvent).min(1).max(200),
    replace: z.boolean().default(false),
  }),
  z.object({
    format: z.literal("ics"),
    content: z.string().min(20).max(500_000),
    replace: z.boolean().default(false),
  }),
]);

export const exportQuery = z.object({
  format: z.enum(["json", "ics"]).default("json"),
});
export const clearQuery = z.object({
  source: z.enum(["manual", "ics_import", "json_import"]).optional(),
});
export const dayQuery = z.object({
  day: z.coerce.number().int().min(1).max(7).optional(),
});
