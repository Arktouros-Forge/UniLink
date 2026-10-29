import { eq } from "drizzle-orm";
import { setCookie } from "h3";
import { db } from "@database";
import { users } from "@database/schema/index";
import { successResponse, errorResponse } from "@server/utils/api-response.js";

const TEST_USER_ID = "00000000-0000-4000-8000-000000000001";

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    const response = errorResponse("Not found", null, 404);
    setResponseStatus(event, response.statusCode);
    return response;
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, TEST_USER_ID))
    .limit(1);

  if (!user) {
    const response = errorResponse(
      "Test Profile 1 not found. Run your seed script first.",
      null,
      404,
    );
    setResponseStatus(event, response.statusCode);
    return response;
  }

  setCookie(event, "unilink_test_user", user.id, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return successResponse(user, "Logged in as Test Profile 1");
});
