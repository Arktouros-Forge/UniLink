import { eq } from "drizzle-orm";
import { getCookie } from "h3";

import { db } from "@database/index";
import { users } from "@database/schema/index";

import { createTtlCache } from "./ttl-cache.js";

export const SESSION_COOKIE = "unilink_test_user";

const sessions = createTtlCache({ ttl: 10_000, max: 1000 });

export const forgetSession = (userId) => sessions.delete(userId);

async function loadSession(userId) {
  const [row] = await db
    .select({
      id: users.id,
      role: users.role,
      status: users.status,
      blockedReason: users.blockedReason,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row ?? null;
}

export async function resolveSession(event) {
  if (!import.meta.dev) return null;
  const userId = getCookie(event, SESSION_COOKIE);
  if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) return null;

  const cached = sessions.get(userId);
  if (cached !== undefined) return cached;
  return sessions.set(userId, await loadSession(userId));
}
