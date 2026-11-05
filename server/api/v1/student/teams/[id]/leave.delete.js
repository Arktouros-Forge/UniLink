import { z } from "zod";
import { getRouterParam, setResponseStatus } from "h3";

import { leaveTeam } from "@server/services/teams/teams.service.js";
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

  const result = await leaveTeam(user.id, paramsResult.data.id);

  if (!result.success) {
    const errorMap = {
      NOT_TEAM_MEMBER: ["You are not a member of this team", 404],
      CREATOR_CANNOT_LEAVE: ["The team creator cannot leave the team", 409],
      COMPETITION_CLOSED: ["This competition is closed", 409],
      COMPETITION_DEADLINE_PASSED: ["The competition deadline has passed", 409],
    };

    const [message, statusCode] = errorMap[result.error] ?? [
      "Unable to leave team",
      400,
    ];

    const response = errorResponse(message, null, statusCode);

    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(null, "You left the team successfully");
});
