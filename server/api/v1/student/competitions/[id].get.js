import { z } from "zod";
import { getRouterParam, setResponseStatus } from "h3";

import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";
import { getCompetitionById } from "@server/services/competitions/competitions.service.js";

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

  const result = z.uuid().safeParse(getRouterParam(event, "id"));

  if (!result.success) {
    const response = errorResponse("Invalid competition ID", null, 400);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const competition = await getCompetitionById(result.data, user.id);

  if (!competition) {
    const response = errorResponse("Competition not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(competition, "Competition retrieved successfully");
});
