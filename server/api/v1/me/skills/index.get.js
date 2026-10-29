import { getUserSkills } from "@server/services/users/user-skills.service.js";
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

  const skills = await getUserSkills(user.id);

  return successResponse(skills, "User skills retrieved successfully");
});
