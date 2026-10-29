import { z } from "zod";
import { getSkillById } from "@server/services/skills/skills.service.js";
import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

export default defineEventHandler(async (event) => {
  const currentUser = await getCurrentUser(event);

  if (!currentUser) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (currentUser.role !== "student") {
    const response = errorResponse("Student access required", null, 403);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const id = getRouterParam(event, "id");
  const validation = z.uuid().safeParse(id);

  if (!validation.success) {
    const response = errorResponse("Invalid skill ID", null, 400);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const skill = await getSkillById(validation.data);

  if (!skill) {
    const response = errorResponse("Skill not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  return successResponse(skill, "Skill retrieved successfully");
});
