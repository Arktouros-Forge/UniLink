import { getCurrentUser } from "@server/utils/current-user.js";
import { errorResponse, successResponse } from "@server/utils/api-response.js";
import { getStudentDashboard } from "@server/services/dashboard/dashboard.service.js";

export default defineEventHandler(async (event) => {
  const currentUser = await getCurrentUser(event);

  if (!currentUser) {
    const response = errorResponse("Unauthorized", null, 401);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  if (currentUser.role !== "student") {
    const response = errorResponse(
      "Only students can access this dashboard",
      null,
      403,
    );
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const dashboard = await getStudentDashboard(currentUser.id);

  return successResponse(dashboard, "Dashboard retrieved successfully");
});
