import { z } from "zod";
import { getRouterParam, setResponseStatus } from "h3";

import { joinTeam } from "@server/services/teams/teams.service.js";
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

  const result = await joinTeam(user.id, paramsResult.data.id);

  if (!result.success) {
    const errorMap = {
      TEAM_NOT_FOUND: ["Team not found", 404],
      COMPETITION_CLOSED: ["This competition is closed", 409],
      COMPETITION_DEADLINE_PASSED: ["The competition deadline has passed", 409],
      ALREADY_TEAM_MEMBER: ["You are already a member of this team", 409],
      JOIN_REQUEST_ALREADY_EXISTS: [
        "You already have a pending join request for this team",
        409,
      ],
      ALREADY_IN_TEAM: [
        "You are already a member of another team in this competition",
        409,
      ],
      TEAM_FULL: ["This team is full", 409],
    };

    const [message, statusCode] = errorMap[result.error] ?? [
      "Unable to join team",
      400,
    ];

    const response = errorResponse(message, null, statusCode);

    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(result.data, "Join request sent successfully");
});
