import { z } from "zod";

import { createTeam } from "@server/services/teams/teams.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { errorResponse, successResponse } from "@server/utils/api-response.js";

const bodySchema = z.object({
  competitionId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
  maxMembers: z.number().int().min(1).max(100).nullable().optional(),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (user.role !== "student") {
    const response = errorResponse("Student access required", null, 403);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const body = await readBody(event);
  const result = bodySchema.safeParse(body);

  if (!result.success) {
    const response = errorResponse(
      "Validation failed",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      422,
    );

    setResponseStatus(event, response.statusCode);
    return response;
  }

  const resultCreate = await createTeam(user.id, result.data);

  const errors = {
    COMPETITION_NOT_FOUND: ["Competition not found", 404],
    COMPETITION_CLOSED: ["Competition is closed", 409],
    COMPETITION_DEADLINE_PASSED: ["Competition deadline has passed", 409],
    ALREADY_IN_TEAM: ["You already belong to a team for this competition", 409],
    TEAM_ALREADY_CREATED: [
      "You already created a team for this competition",
      409,
    ],
    INVALID_TEAM_SIZE: ["Invalid team size", 422],
    TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT: [
      "Team size exceeds the competition limit",
      422,
    ],
  };

  if (resultCreate?.error) {
    const [message, statusCode] = errors[resultCreate.error] ?? [
      "Unable to create team",
      400,
    ];

    const response = errorResponse(message, null, statusCode);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const response = successResponse(
    resultCreate,
    "Team created successfully",
    201,
  );

  setResponseStatus(event, response.statusCode);
  return response;
});
