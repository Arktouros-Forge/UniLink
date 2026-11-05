import { z } from "zod";
import { getRouterParam, setResponseStatus } from "h3";

import { getTeamMembers } from "@server/services/teams/teams.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

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

  const paramsResult = paramsSchema.safeParse({
    id: getRouterParam(event, "id"),
  });

  if (!paramsResult.success) {
    const response = errorResponse(
      "Invalid team ID",
      paramsResult.error.issues.map((issue) => ({
        field: issue.path.join(".") || "id",
        message: issue.message,
      })),
      422,
    );

    setResponseStatus(event, response.statusCode);
    return response;
  }

  const result = await getTeamMembers(paramsResult.data.id);

  if (!result.success) {
    const response = errorResponse("Team not found", null, 404);

    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(result.data, "Team members retrieved successfully");
});
