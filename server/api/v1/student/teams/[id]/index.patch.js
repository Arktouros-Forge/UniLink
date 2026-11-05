import { z } from "zod";

import { updateTeam } from "@server/services/teams/teams.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { errorResponse, successResponse } from "@server/utils/api-response.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    maxMembers: z.number().int().min(1).max(100).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
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

  const paramsResult = paramsSchema.safeParse(getRouterParams(event));

  if (!paramsResult.success) {
    const response = errorResponse("Invalid team ID", null, 422);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const bodyResult = bodySchema.safeParse(await readBody(event));

  if (!bodyResult.success) {
    const response = errorResponse(
      "Validation failed",
      bodyResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      422,
    );

    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = await updateTeam(
    user.id,
    paramsResult.data.id,
    bodyResult.data,
  );

  const errorMap = {
    TEAM_NOT_FOUND: ["Team not found", 404],
    FORBIDDEN: ["Only the team creator can update this team", 403],
    COMPETITION_CLOSED: ["Competition is closed", 409],
    COMPETITION_DEADLINE_PASSED: ["Competition deadline has passed", 409],
    INVALID_TEAM_SIZE: ["Invalid team size", 422],
    TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT: [
      "Team size exceeds the competition limit",
      422,
    ],
    TEAM_SIZE_BELOW_CURRENT_MEMBERS: [
      "Team size cannot be lower than the current accepted member count",
      422,
    ],
  };

  if (result?.error) {
    const [message, statusCode] = errorMap[result.error] ?? [
      "Unable to update team",
      400,
    ];

    const response = errorResponse(message, null, statusCode);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(result, "Team updated successfully");
});
