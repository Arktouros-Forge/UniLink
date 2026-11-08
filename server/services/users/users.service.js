import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  ilike,
  inArray,
  isNotNull,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@database/index";
import {
  skills,
  studyRequests,
  userSkills,
  users,
} from "@database/schema/index";

import { composeMail } from "../../emails/templates.js";
import { fail } from "../../utils/errors.js";
import { sendMailSafely } from "../../utils/mailer.js";
import { sendVerification } from "../auth/auth.service.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { forgetSession } from "../../utils/auth.js";
import { likePattern } from "../../utils/pagination.js";
import { finishPage, ref, totalOver, userSkillsJson, whatsappUrl } from "../_sql.js";

const publicFields = {
  id: users.id,
  username: users.username,
  fullName: users.fullName,
  year: users.year,
  major: users.major,
  bio: users.bio,
  personalWebsite: users.personalWebsite,
  profilePhotoUrl: users.profilePhotoUrl,
  skills: userSkillsJson(users.id),
};

const privateFields = {
  ...publicFields,
  nim: users.nim,
  email: users.email,
  phone: users.phone,
  role: users.role,
  status: users.status,
  onboardedAt: users.onboardedAt,
  emailVerifiedAt: users.emailVerifiedAt,
  createdAt: users.createdAt,
};

export async function getMe(userId) {
  const [user] = await db
    .select(privateFields)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) fail("USER_NOT_FOUND");
  return user;
}

export async function assertSkillsExist(executor, skillIds) {
  if (!skillIds.length) return;
  const found = await executor
    .select({ id: skills.id })
    .from(skills)
    .where(inArray(skills.id, skillIds));
  if (found.length !== new Set(skillIds).size) fail("SKILL_NOT_FOUND");
}

export async function replaceUserSkills(tx, userId, skillIds) {
  const wanted = new Set(skillIds);
  const current = await tx
    .select({ id: userSkills.skillId })
    .from(userSkills)
    .where(eq(userSkills.userId, userId));
  const have = new Set(current.map((row) => row.id));

  const remove = [...have].filter((id) => !wanted.has(id));
  const add = [...wanted].filter((id) => !have.has(id));

  if (remove.length)
    await tx
      .delete(userSkills)
      .where(
        and(eq(userSkills.userId, userId), inArray(userSkills.skillId, remove)),
      );
  if (add.length)
    await tx
      .insert(userSkills)
      .values(add.map((skillId) => ({ userId, skillId })));
}

export async function updateProfile(
  userId,
  { skills: skillIds, onboarded, ...fields },
) {
  await db.transaction(async (tx) => {
    await assertSkillsExist(tx, skillIds ?? []);

    const [current] = await tx
      .select({ onboardedAt: users.onboardedAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!current) fail("USER_NOT_FOUND");
    if (fields.year && current.onboardedAt) delete fields.year;

    const patch = {
      ...fields,
      ...(onboarded && !current.onboardedAt ? { onboardedAt: new Date() } : {}),
    };
    if (Object.keys(patch).length)
      await tx.update(users).set(patch).where(eq(users.id, userId));
    if (skillIds) await replaceUserSkills(tx, userId, skillIds);
  });

  return getMe(userId);
}

export async function changeEmail(userId, currentPassword, email) {
  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) fail("USER_NOT_FOUND");
  if (!(await verifyPassword(currentPassword, user.password)))
    fail("INVALID_CURRENT_PASSWORD");

  const [updated] = await db
    .update(users)
    .set({ email, emailVerifiedAt: null })
    .where(eq(users.id, userId))
    .returning({ id: users.id, email: users.email });
  forgetSession(userId);
  await sendVerification(userId);
  return updated;
}

export async function changePassword(userId, currentPassword, newPassword) {
  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) fail("USER_NOT_FOUND");
  if (!(await verifyPassword(currentPassword, user.password)))
    fail("INVALID_CURRENT_PASSWORD");

  const updatedUser = await db
    .update(users)
    .set({
      password: await hashPassword(newPassword),
      sessionVersion: sql`${users.sessionVersion} + 1`,
    })
    .where(eq(users.id, userId))
    .returning({ id: users.id, role: users.role, sessionVersion: users.sessionVersion, email: users.email, fullName: users.fullName })
    .then(([row]) => row);
  forgetSession(userId);
  sendMailSafely(composeMail("passwordChanged", updatedUser.email, { name: updatedUser.fullName }));
  return updatedUser;
}

const MOCK_DEFAULTS = {
  student: "00000000-0000-4000-8000-000000000001",
  admin: "00000000-0000-4000-8000-000000000002",
};

export async function mockLogin({ userId, role = "student" }) {
  const where = eq(users.id, userId ?? MOCK_DEFAULTS[role]);
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      status: users.status,
      sessionVersion: users.sessionVersion,
    })
    .from(users)
    .where(where)
    .orderBy(asc(users.createdAt))
    .limit(1);

  if (!user)
    fail(
      "USER_NOT_FOUND",
      null,
      "No seeded user found. Run `bun run db:seed` first.",
    );
  if (user.status === "blocked") fail("BLOCKED");

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));
  forgetSession(user.id);
  return user;
}

export async function listStudents({
  q,
  skillIds = [],
  year,
  major,
  page,
  limit,
  excludeId,
}) {
  const conditions = [
    eq(users.role, "student"),
    eq(users.status, "active"),
    isNotNull(users.onboardedAt),
  ];

  if (excludeId) conditions.push(sql`${users.id} <> ${excludeId}`);
  if (year) conditions.push(eq(users.year, year));
  if (major) conditions.push(eq(users.major, major));
  if (q) {
    const pattern = likePattern(q);
    conditions.push(
      or(
        ilike(users.fullName, pattern),
        ilike(users.username, pattern),
        exists(
          db
            .select({ one: sql`1` })
            .from(userSkills)
            .innerJoin(skills, eq(skills.id, userSkills.skillId))
            .where(
              and(eq(userSkills.userId, users.id), ilike(skills.name, pattern)),
            ),
        ),
      ),
    );
  }

  const matched = skillIds.length
    ? sql`(select count(*) from user_skills us where us.user_id = ${ref(users.id)} and us.skill_id in (${sql.join(
        skillIds.map((id) => sql`${id}`),
        sql`, `,
      )}))`.mapWith(Number)
    : sql`0`.mapWith(Number);

  if (skillIds.length) conditions.push(sql`${matched} > 0`);

  const where = and(...conditions);

  const rows = await db
    .select({ ...publicFields, matchedSkills: matched, total: totalOver() })
    .from(users)
    .where(where)
    .orderBy(...(skillIds.length ? [desc(matched)] : []), asc(users.fullName))
    .limit(limit)
    .offset((page - 1) * limit);

  return finishPage(
    rows,
    { page, limit },
    async () => (await db.select({ n: count() }).from(users).where(where))[0].n,
  );
}

export async function getStudentProfile(studentId, viewerId) {
  const [user] = await db
    .select({ ...publicFields, phone: users.phone, createdAt: users.createdAt })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "student"),
        eq(users.status, "active"),
      ),
    )
    .limit(1);

  if (!user) fail("USER_NOT_FOUND");

  const [[stats], [relation]] = await Promise.all([
    db.execute(sql`
      select
        (select count(*)::int from study_requests r where r.deleted_at is null and r.status = 'accepted' and r.helper_id = ${studentId}) as helped,
        (select count(*)::int from team_members m where m.user_id = ${studentId} and m.status = 'accepted') as teams,
        (select count(*)::int from help_signs h where h.user_id = ${studentId} and h.status = 'open' and h.expires_at > now()) as open_signs
    `),
    db
      .select({
        id: studyRequests.id,
        status: studyRequests.status,
        initiatedBy: studyRequests.initiatedBy,
        subject: studyRequests.subject,
      })
      .from(studyRequests)
      .where(
        and(
          sql`${studyRequests.deletedAt} is null`,
          inArray(studyRequests.status, ["pending", "accepted"]),
          or(
            and(
              eq(studyRequests.requesterId, viewerId),
              eq(studyRequests.helperId, studentId),
            ),
            and(
              eq(studyRequests.requesterId, studentId),
              eq(studyRequests.helperId, viewerId),
            ),
          ),
        ),
      )
      .orderBy(desc(studyRequests.createdAt))
      .limit(1),
  ]);

  const { phone, ...rest } = user;
  const connected = relation?.status === "accepted";

  return {
    ...rest,
    stats: {
      helped: stats.helped,
      teams: stats.teams,
      openSigns: stats.open_signs,
    },
    relation: relation ?? null,
    contact: connected
      ? {
          phone,
          whatsappUrl: whatsappUrl(
            phone,
            "Halo, kita terhubung lewat UniLink.",
          ),
        }
      : null,
  };
}
