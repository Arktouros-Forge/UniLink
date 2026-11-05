import { z } from "zod";

import { deleteTeam } from "@server/services/teams/teams.service.js";
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

  const result = paramsSchema.safeParse(getRouterParams(event));

  if (!result.success) {
    const response = errorResponse("Invalid team ID", null, 422);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const deleteResult = await deleteTeam(user.id, result.data.id);

  const errorMap = {
    TEAM_NOT_FOUND: ["Team not found", 404],
    FORBIDDEN: ["Only the team creator can delete this team", 403],
    COMPETITION_CLOSED: ["Competition is closed", 409],
    COMPETITION_DEADLINE_PASSED: ["Competition deadline has passed", 409],
  };

  if (deleteResult?.error) {
    const [message, statusCode] = errorMap[deleteResult.error] ?? [
      "Unable to delete team",
      400,
    ];

    const response = errorResponse(message, null, statusCode);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(null, "Team deleted successfully");
});
