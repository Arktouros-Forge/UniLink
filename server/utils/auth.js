import { eq } from "drizzle-orm";

import { db } from "@database/index";
import { users } from "@database/schema/index";

import { readSession } from "./session.js";
import { createTtlCache } from "./ttl-cache.js";

const sessions = createTtlCache({ ttl: 10_000, max: 1000 });

export const forgetSession = (userId) => sessions.delete(userId);

async function loadSession(userId) {
  const [row] = await db
    .select({
      id: users.id,
      role: users.role,
      status: users.status,
      blockedReason: users.blockedReason,
      sessionVersion: users.sessionVersion,
      emailVerifiedAt: users.emailVerifiedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row ?? null;
}

export async function resolveSession(event) {
  const session = await readSession(event);
  if (!session?.id) return null;

  let user = sessions.get(session.id);
  if (user === undefined) user = sessions.set(session.id, await loadSession(session.id));

  if (!user || user.sessionVersion !== session.version) return null;
  return user;
}
