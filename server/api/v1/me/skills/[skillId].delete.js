import { z } from "zod";
import { removeUserSkill } from "@server/services/users/user-skills.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

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

  const skillId = getRouterParam(event, "skillId");
  const validation = z.uuid().safeParse(skillId);

  if (!validation.success) {
    const response = errorResponse("Invalid skill ID", null, 400);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const deleted = await removeUserSkill(user.id, validation.data);

  if (!deleted) {
    const response = errorResponse("User skill not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(null, "Skill removed successfully");
});
