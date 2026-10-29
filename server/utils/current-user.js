import { eq } from "drizzle-orm";
import { getCookie } from "h3";
import { db } from "~~/server/database/index";
import { users } from "~~/server/database/schema/index";

export async function getCurrentUser(event) {
  if (!import.meta.dev) return null;

  const userId = getCookie(event, "unilink_test_user");

  if (!userId) return null;

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      nim: users.nim,
      email: users.email,
      phone: users.phone,
      role: users.role,
      year: users.year,
      personalWebsite: users.personalWebsite,
      profilePhotoUrl: users.profilePhotoUrl,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}
