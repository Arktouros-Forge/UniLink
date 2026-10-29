import { sql } from "drizzle-orm";
import { db } from "@database";
import { successResponse, errorResponse } from "@server/utils/api-response";

export default defineEventHandler(async (event) => {
  try {
    await db.execute(sql`SELECT 1`);

    return successResponse(
      {
        api: "connected",
        database: "connected",
      },
      "UniLink API is running",
    );
  } catch (error) {
    console.error("[Health Check]", error);

    setResponseStatus(event, 503);

    return errorResponse("Database connection failed", {
      database: "disconnected",
    });
  }
});
