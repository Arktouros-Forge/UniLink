import { count } from "drizzle-orm";
import { db } from "@database";
import { users } from "@database/schema/index";
import { successResponse } from "@server/utils/api-response.js";

export default defineEventHandler(async () => {
  const [{ total }] = await db.select({ total: count() }).from(users);

  const testUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .limit(5);

  return successResponse(
    {
      database: "connected",
      totalUsers: total,
      users: testUsers,
    },
    "Database records retrieved",
  );
});
