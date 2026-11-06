import { z } from "zod";

import {
  dateString,
  nullableText,
  pagination,
  searchText,
  trimmed,
} from "./common.js";

export const tasksQuery = pagination(20, 100).extend({
  status: z
    .enum(["all", "open", "done", "overdue", "today", "upcoming"])
    .default("all"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  q: searchText,
  sort: z.enum(["due", "created"]).default("due"),
});

export const taskBody = z.object({
  title: trimmed(1, 200),
  notes: nullableText(1000),
  course: nullableText(60),
  dueDate: dateString.nullable().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const taskPatch = taskBody
  .partial()
  .extend({ completed: z.boolean().optional() })
  .refine(
    (d) => Object.keys(d).length > 0,
    "Provide at least one field to update",
  );
