import { z } from "zod";

import { nullableText, trimmed } from "./common.js";

export const teamBody = z.object({
  competitionId: z.uuid(),
  name: trimmed(2, 80),
  description: nullableText(500),
  maxMembers: z.number().int().min(1).max(50).nullable().optional(),
});

export const teamPatch = teamBody
  .omit({ competitionId: true })
  .partial()
  .refine(
    (d) => Object.keys(d).length > 0,
    "Provide at least one field to update",
  );

export const respondBody = z.object({
  decision: z.enum(["accept", "decline", "remove"]),
});

export const resultBody = z.object({
  result: z.enum(["won", "lost", "unknown"]),
});

export const memberParams = z.object({ id: z.uuid(), userId: z.uuid() });
