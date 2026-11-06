import { z } from "zod";

import {
  nullableText,
  optionalUrl,
  pagination,
  searchText,
  trimmed,
} from "./common.js";

export const competitionsQuery = pagination(9, 50).extend({
  q: searchText,
  categoryId: z.uuid().optional(),
  state: z.enum(["open", "closed", "all"]).default("all"),
  status: z.enum(["draft", "published", "closed"]).optional(),
  sort: z.enum(["deadline", "newest", "popular"]).default("deadline"),
  mine: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

const base = z.object({
  title: trimmed(3, 200),
  description: trimmed(10, 10000),
  deadline: z.coerce.date(),
  maxTeamSize: z.number().int().min(1).max(50).nullable().optional(),
  host: trimmed(2, 200),
  prize: nullableText(200),
  sourceUrl: optionalUrl,
  imageUrl: optionalUrl,
  categoryIds: z.array(z.uuid()).min(1).max(5),
});

export const studentCompetitionBody = base.refine(
  (d) => d.deadline.getTime() > Date.now(),
  { path: ["deadline"], message: "Deadline must be in the future" },
);

export const adminCompetitionBody = base.extend({
  status: z.enum(["draft", "published", "closed"]).default("published"),
});

export const competitionPatch = base
  .extend({ status: z.enum(["draft", "published", "closed"]) })
  .partial()
  .refine(
    (d) => Object.keys(d).length > 0,
    "Provide at least one field to update",
  );
