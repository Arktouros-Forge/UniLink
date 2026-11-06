import { z } from "zod";

import { nullableText, pagination, searchText, trimmed } from "./common.js";

export const signsQuery = pagination(9, 50).extend({
  scope: z.enum(["board", "mine"]).default("board"),
  skillId: z.uuid().optional(),
  q: searchText,
  status: z.enum(["open", "fulfilled", "closed", "expired"]).optional(),
});

export const signBody = z.object({
  skillId: z.uuid(),
  title: trimmed(5, 120),
  description: trimmed(10, 1000),
  preferredTime: nullableText(120),
  expiresInDays: z.number().int().min(1).max(30).default(14),
});

export const signPatch = z
  .object({
    title: trimmed(5, 120),
    description: trimmed(10, 1000),
    preferredTime: nullableText(120),
    close: z.boolean(),
  })
  .partial()
  .refine(
    (d) => Object.keys(d).length > 0,
    "Provide at least one field to update",
  );

export const offerBody = z.object({
  description: trimmed(10, 1000),
  preferredTime: nullableText(120),
});

export const requestBody = z.object({
  helperId: z.uuid(),
  subject: trimmed(3, 120),
  description: trimmed(10, 1000),
  preferredTime: nullableText(120),
});

export const requestsQuery = pagination(10, 50).extend({
  box: z.enum(["all", "incoming", "outgoing"]).default("all"),
  status: z
    .enum(["pending", "accepted", "declined", "expired", "cancelled"])
    .optional(),
});

export const respondBody = z.object({
  action: z.enum(["accept", "decline", "cancel"]),
});

export const historyQuery = pagination(10, 50).extend({
  role: z.enum(["all", "helper", "requester"]).default("all"),
});
