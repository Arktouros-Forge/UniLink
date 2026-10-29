import { getCurrentUser } from "@server/utils/current-user.js";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    return errorResponse("You are not logged in");
  }

  return successResponse(user, "Profile retrieved successfully");
});
