import { z } from "zod";

import {
  nullableText,
  optionalUrl,
  pagination,
  phone,
  searchText,
  trimmed,
} from "./common.js";

const partialOf = (schema) =>
  schema
    .partial()
    .refine(
      (d) => Object.keys(d).length > 0,
      "Provide at least one field to update",
    );

export const referenceQuery = pagination(15, 100).extend({ q: searchText });

export const forceQuery = z.object({
  force: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export const skillBody = z.object({
  name: trimmed(2, 60),
  description: nullableText(300),
});
export const skillPatch = partialOf(skillBody);

export const categoryBody = z.object({
  name: trimmed(2, 60),
  description: nullableText(300),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #1E3FA6"),
});
export const categoryPatch = partialOf(categoryBody);
