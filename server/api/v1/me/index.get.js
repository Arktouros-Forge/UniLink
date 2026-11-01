import { getCurrentUser } from "@server/utils/current-user.js";
import { getUserById } from "@server/services/users/users.service.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

export default defineEventHandler(async (event) => {
  const currentUser = await getCurrentUser(event);

  if (!currentUser) {
    const response = errorResponse("You are not logged in", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const profile = await getUserById(currentUser.id);

  return successResponse(profile, "Profile retrieved successfully");
});
