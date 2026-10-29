import { z } from "zod";
import { readBody, setResponseStatus } from "h3";

import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";
import { createCompetition } from "@server/services/competitions/competitions.service.js";

const bodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  deadline: z.coerce
    .date()
    .refine(
      (date) => date.getTime() > Date.now(),
      "Deadline must be in the future",
    ),
  maxTeamSize: z.number().int().positive().nullable().optional(),
  host: z.string().trim().min(1).max(200),
  sourceUrl: z.url().nullable().optional(),
  imageUrl: z.url().nullable().optional(),
  categoryIds: z.array(z.uuid()).min(1),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (user.role !== "student") {
    const response = errorResponse("Access denied", null, 403);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = bodySchema.safeParse(await readBody(event));

  if (!result.success) {
    const response = errorResponse(
      "Invalid competition data",
      result.error.issues,
      422,
    );
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const competition = await createCompetition(user.id, result.data);

  if (competition.error === "DUPLICATE_COMPETITION") {
    const response = errorResponse(
      "A competition with this title and host already exists",
      null,
      409,
    );
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (competition.error === "CATEGORY_NOT_FOUND") {
    const response = errorResponse(
      "One or more categories were not found",
      null,
      400,
    );
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const response = successResponse(
    competition,
    "Competition created successfully",
    201,
  );

  setResponseStatus(event, response.statusCode);
  return response;
});
