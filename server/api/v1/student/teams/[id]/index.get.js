import { z } from "zod";

import { getTeamById } from "@server/services/teams/teams.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { errorResponse, successResponse } from "@server/utils/api-response.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
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

  const params = getRouterParams(event);
  const result = paramsSchema.safeParse(params);

  if (!result.success) {
    const response = errorResponse(
      "Invalid team ID",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      422,
    );

    setResponseStatus(event, response.statusCode);
    return response;
  }

  const team = await getTeamById(result.data.id);

  if (!team) {
    const response = errorResponse("Team not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(team, "Team retrieved successfully");
});
