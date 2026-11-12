import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@database/index";
import { users } from "@database/schema/index";

import { assert, fail } from "../../utils/errors.js";
import { forgetSession } from "../../utils/auth.js";
import { likePattern } from "../../utils/pagination.js";
import { finishPage, totalOver, userSkillsJson } from "../_sql.js";
import {
  assertSkillsExist,
  replaceUserSkills,
} from "../users/users.service.js";

const fields = {
  id: users.id,
  username: users.username,
  fullName: users.fullName,
  nim: users.nim,
  email: users.email,
  phone: users.phone,
  role: users.role,
  year: users.year,
  major: users.major,
  bio: users.bio,
  personalWebsite: users.personalWebsite,
  profilePhotoUrl: users.profilePhotoUrl,
  status: users.status,
  blockedReason: users.blockedReason,
  onboardedAt: users.onboardedAt,
  lastLoginAt: users.lastLoginAt,
  createdAt: users.createdAt,
  skills: userSkillsJson(users.id),
};

export async function listUsers({ q, role, status, year, page, limit }) {
  const conditions = [];
  if (role) conditions.push(eq(users.role, role));
  if (status) conditions.push(eq(users.status, status));
  if (year) conditions.push(eq(users.year, year));
  if (q) {
    const pattern = likePattern(q);
    conditions.push(
      or(
        ilike(users.fullName, pattern),
        ilike(users.username, pattern),
        ilike(users.email, pattern),
        ilike(users.nim, pattern),
      ),
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({ ...fields, total: totalOver() })
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const result = await finishPage(rows, { page, limit });
  return { users: result.items, pagination: result.pagination };
}

export async function getUser(id) {
  const [user] = await db
    .select(fields)
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!user) fail("USER_NOT_FOUND");

  const [activity] = await db.execute(sql`
    select
      (select count(*)::int from tasks where user_id = ${id}) as tasks,
      (select count(*)::int from team_members where user_id = ${id} and status = 'accepted') as teams,
      (select count(*)::int from help_signs where user_id = ${id}) as signs,
      (select count(*)::int from study_requests where (requester_id = ${id} or helper_id = ${id}) and deleted_at is null) as requests
  `);

  const [recentTeams, recentRequests] = await Promise.all([
    db.execute(sql`
      select t.id, t.name, c.title as "competitionTitle", m.status
      from team_members m join teams t on t.id = m.team_id join competitions c on c.id = t.competition_id
      where m.user_id = ${id} order by m.joined_at desc limit 5
    `),
    db.execute(sql`
      select r.id, r.subject, r.status, r.created_at as "createdAt"
      from study_requests r where (r.requester_id = ${id} or r.helper_id = ${id}) and r.deleted_at is null
      order by r.created_at desc limit 5
    `),
  ]);

  return {
    ...user,
    activity,
    recentTeams: [...recentTeams],
    recentRequests: [...recentRequests],
  };
}

export async function updateUser(id, { skills: skillIds, ...data }) {
  await db.transaction(async (tx) => {
    const [target] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!target) fail("USER_NOT_FOUND");
    await assertSkillsExist(tx, skillIds ?? []);

    if (Object.keys(data).length)
      await tx.update(users).set(data).where(eq(users.id, id));
    if (skillIds) await replaceUserSkills(tx, id, skillIds);
  });

  return getUser(id);
}

export async function setUserStatus(adminId, id, { status, reason }) {
  assert(id !== adminId, "CANNOT_MODIFY_SELF");

  const [target] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!target) fail("USER_NOT_FOUND");
  assert(target.role !== "admin", "CANNOT_MODIFY_ADMIN");

  await db
    .update(users)
    .set({
      status,
      blockedReason: status === "blocked" ? (reason ?? null) : null,
    })
    .where(eq(users.id, id));

  forgetSession(id);
  return getUser(id);
}

export async function deleteUser(adminId, id) {
  assert(id !== adminId, "CANNOT_MODIFY_SELF");

  const [target] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!target) fail("USER_NOT_FOUND");
  assert(target.role !== "admin", "CANNOT_MODIFY_ADMIN");

  await db.delete(users).where(eq(users.id, id));
  forgetSession(id);
  return { id };
}
