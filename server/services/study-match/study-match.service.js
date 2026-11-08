import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@database/index";
import {
  helpSigns,
  skills,
  studyRequests,
  users,
} from "@database/schema/index";

import { assert, fail } from "../../utils/errors.js";
import { likePattern } from "../../utils/pagination.js";
import { finishPage, totalOver, whatsappUrl } from "../_sql.js";

const DAY = 86_400_000;
const REQUEST_TTL_DAYS = 7;

const effectiveRequestStatus = sql`case when ${studyRequests.status} = 'pending' and ${studyRequests.expiresAt} <= now() then 'expired' else ${studyRequests.status} end`;
const effectiveSignStatus = sql`case when ${helpSigns.status} = 'open' and ${helpSigns.expiresAt} <= now() then 'expired' else ${helpSigns.status} end`;

const person = (id, fullName, year, major, photo) =>
  sql`json_build_object('id', ${id}, 'fullName', ${fullName}, 'year', ${year}, 'major', ${major}, 'profilePhotoUrl', ${photo})`;

export async function listSigns(
  viewerId,
  { scope, skillId, q, status, page, limit },
) {
  const author = alias(users, "author");
  const conditions = [];

  if (scope === "mine") conditions.push(eq(helpSigns.userId, viewerId));
  else {
    conditions.push(
      eq(helpSigns.status, "open"),
      sql`${helpSigns.expiresAt} > now()`,
      sql`${helpSigns.userId} <> ${viewerId}`,
    );
    conditions.push(sql`${author.status} = 'active'`);
  }
  if (scope === "mine" && status)
    conditions.push(sql`${effectiveSignStatus} = ${status}`);
  if (skillId) conditions.push(eq(helpSigns.skillId, skillId));
  if (q)
    conditions.push(
      or(
        ilike(helpSigns.title, likePattern(q)),
        ilike(helpSigns.description, likePattern(q)),
      ),
    );

  const where = and(...conditions);

  const rows = await db
    .select({
      id: helpSigns.id,
      title: helpSigns.title,
      description: helpSigns.description,
      preferredTime: helpSigns.preferredTime,
      status: effectiveSignStatus,
      createdAt: helpSigns.createdAt,
      expiresAt: helpSigns.expiresAt,
      skill: sql`json_build_object('id', ${skills.id}, 'name', ${skills.name}, 'slug', ${skills.slug})`,
      author: person(
        author.id,
        author.fullName,
        author.year,
        author.major,
        author.profilePhotoUrl,
      ),
      canHelp:
        sql`exists (select 1 from user_skills us where us.user_id = ${viewerId} and us.skill_id = ${helpSigns.skillId})`.mapWith(
          Boolean,
        ),
      offerCount:
        sql`(select count(*) from study_requests r where r.sign_id = ${helpSigns.id} and r.deleted_at is null and r.status <> 'cancelled')`.mapWith(
          Number,
        ),
      myOfferStatus: sql`(select r.status from study_requests r where r.sign_id = ${helpSigns.id} and r.helper_id = ${viewerId} and r.deleted_at is null order by r.created_at desc limit 1)`,
      total: totalOver(),
    })
    .from(helpSigns)
    .innerJoin(author, eq(author.id, helpSigns.userId))
    .innerJoin(skills, eq(skills.id, helpSigns.skillId))
    .where(where)
    .orderBy(desc(helpSigns.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const result = await finishPage(rows, { page, limit });
  return { signs: result.items, pagination: result.pagination };
}

export async function getSign(viewerId, id) {
  const author = alias(users, "author");

  const [sign] = await db
    .select({
      id: helpSigns.id,
      userId: helpSigns.userId,
      title: helpSigns.title,
      description: helpSigns.description,
      preferredTime: helpSigns.preferredTime,
      status: effectiveSignStatus,
      createdAt: helpSigns.createdAt,
      expiresAt: helpSigns.expiresAt,
      skill: sql`json_build_object('id', ${skills.id}, 'name', ${skills.name}, 'slug', ${skills.slug}, 'description', ${skills.description})`,
      author: person(
        author.id,
        author.fullName,
        author.year,
        author.major,
        author.profilePhotoUrl,
      ),
      canHelp:
        sql`exists (select 1 from user_skills us where us.user_id = ${viewerId} and us.skill_id = ${helpSigns.skillId})`.mapWith(
          Boolean,
        ),
    })
    .from(helpSigns)
    .innerJoin(author, eq(author.id, helpSigns.userId))
    .innerJoin(skills, eq(skills.id, helpSigns.skillId))
    .where(eq(helpSigns.id, id))
    .limit(1);

  if (!sign) fail("SIGN_NOT_FOUND");

  const helper = alias(users, "helper");
  const isOwner = sign.userId === viewerId;

  const offers = await db
    .select({
      id: studyRequests.id,
      status: effectiveRequestStatus,
      description: studyRequests.description,
      createdAt: studyRequests.createdAt,
      helper: person(
        helper.id,
        helper.fullName,
        helper.year,
        helper.major,
        helper.profilePhotoUrl,
      ),
      contact: sql`case when ${studyRequests.status} = 'accepted' and ${isOwner} then json_build_object('whatsappUrl', 'https://wa.me/' || regexp_replace(${helper.phone}, '\\D', '', 'g')) else null end`,
    })
    .from(studyRequests)
    .innerJoin(helper, eq(helper.id, studyRequests.helperId))
    .where(
      and(
        eq(studyRequests.signId, id),
        sql`${studyRequests.deletedAt} is null`,
        isOwner ? undefined : eq(studyRequests.helperId, viewerId),
      ),
    )
    .orderBy(desc(studyRequests.createdAt));

  const { userId, ...rest } = sign;
  return { ...rest, isOwner, offers };
}

export async function createSign(
  userId,
  { skillId, title, description, preferredTime, expiresInDays },
) {
  const [skill] = await db
    .select({ id: skills.id })
    .from(skills)
    .where(eq(skills.id, skillId))
    .limit(1);
  if (!skill) fail("SKILL_NOT_FOUND");

  const [row] = await db
    .insert(helpSigns)
    .values({
      userId,
      skillId,
      title,
      description,
      preferredTime: preferredTime ?? null,
      expiresAt: new Date(Date.now() + expiresInDays * DAY),
    })
    .returning({ id: helpSigns.id });

  return getSign(userId, row.id);
}

export async function updateSign(userId, id, { close, ...data }) {
  const [current] = await db
    .select({ userId: helpSigns.userId, status: effectiveSignStatus })
    .from(helpSigns)
    .where(eq(helpSigns.id, id))
    .limit(1);
  if (!current) fail("SIGN_NOT_FOUND");
  assert(current.userId === userId, "FORBIDDEN");
  assert(current.status === "open", "SIGN_NOT_OPEN");

  await db
    .update(helpSigns)
    .set({
      ...data,
      ...(close ? { status: "closed", closedAt: new Date() } : {}),
    })
    .where(eq(helpSigns.id, id));

  return getSign(userId, id);
}

export async function deleteSign(userId, id) {
  const removed = await db
    .delete(helpSigns)
    .where(and(eq(helpSigns.id, id), eq(helpSigns.userId, userId)))
    .returning({ id: helpSigns.id });
  if (!removed.length) fail("SIGN_NOT_FOUND");
  return { id };
}

async function assertAvailableStudent(userId) {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.id, userId),
        eq(users.role, "student"),
        eq(users.status, "active"),
      ),
    )
    .limit(1);
  if (!row) fail("HELPER_BLOCKED");
}

const requestExpiry = () => new Date(Date.now() + REQUEST_TTL_DAYS * DAY);

export async function offerHelp(
  helperId,
  signId,
  { description, preferredTime },
) {
  const [sign] = await db
    .select({
      userId: helpSigns.userId,
      title: helpSigns.title,
      status: effectiveSignStatus,
    })
    .from(helpSigns)
    .where(eq(helpSigns.id, signId))
    .limit(1);

  if (!sign) fail("SIGN_NOT_FOUND");
  assert(sign.userId !== helperId, "SELF_REQUEST");
  assert(sign.status === "open", "SIGN_NOT_OPEN");
  await assertAvailableStudent(sign.userId);

  const [row] = await db
    .insert(studyRequests)
    .values({
      requesterId: sign.userId,
      helperId,
      initiatedBy: "helper",
      signId,
      subject: sign.title,
      description,
      preferredTime: preferredTime ?? null,
      expiresAt: requestExpiry(),
    })
    .returning({ id: studyRequests.id });

  return getRequest(helperId, row.id);
}

export async function createRequest(
  requesterId,
  { helperId, subject, description, preferredTime },
) {
  assert(helperId !== requesterId, "SELF_REQUEST");
  await assertAvailableStudent(helperId);

  const [row] = await db
    .insert(studyRequests)
    .values({
      requesterId,
      helperId,
      initiatedBy: "requester",
      subject,
      description,
      preferredTime: preferredTime ?? null,
      expiresAt: requestExpiry(),
    })
    .returning({ id: studyRequests.id });

  return getRequest(requesterId, row.id);
}

function requestSelect(viewerId) {
  const other = alias(users, "other");
  const isRequester = sql`${studyRequests.requesterId} = ${viewerId}`;
  const initiatedByMe = sql`((${studyRequests.initiatedBy} = 'requester' and ${studyRequests.requesterId} = ${viewerId}) or (${studyRequests.initiatedBy} = 'helper' and ${studyRequests.helperId} = ${viewerId}))`;

  return {
    other,
    fields: {
      id: studyRequests.id,
      subject: studyRequests.subject,
      description: studyRequests.description,
      preferredTime: studyRequests.preferredTime,
      status: effectiveRequestStatus,
      createdAt: studyRequests.createdAt,
      respondedAt: studyRequests.respondedAt,
      expiresAt: studyRequests.expiresAt,
      signId: studyRequests.signId,
      direction: sql`case when ${initiatedByMe} then 'outgoing' else 'incoming' end`,
      myRole: sql`case when ${isRequester} then 'requester' else 'helper' end`,
      counterpart: person(
        other.id,
        other.fullName,
        other.year,
        other.major,
        other.profilePhotoUrl,
      ),
      counterpartSkills: sql`coalesce((select json_agg(s.name order by s.name) from user_skills us join skills s on s.id = us.skill_id where us.user_id = ${other.id}), '[]'::json)`,
      contact: sql`case when ${studyRequests.status} = 'accepted' then json_build_object('whatsappUrl', 'https://wa.me/' || regexp_replace(${other.phone}, '\\D', '', 'g')) else null end`,
    },
    join: sql`${other.id} = case when ${isRequester} then ${studyRequests.helperId} else ${studyRequests.requesterId} end`,
    initiatedByMe,
  };
}

export async function getRequest(viewerId, id) {
  const { other, fields, join } = requestSelect(viewerId);
  const [row] = await db
    .select(fields)
    .from(studyRequests)
    .innerJoin(other, join)
    .where(
      and(
        eq(studyRequests.id, id),
        sql`${studyRequests.deletedAt} is null`,
        or(
          eq(studyRequests.requesterId, viewerId),
          eq(studyRequests.helperId, viewerId),
        ),
      ),
    )
    .limit(1);
  if (!row) fail("REQUEST_NOT_FOUND");
  return row;
}

export async function listRequests(viewerId, { box, status, page, limit }) {
  const { other, fields, join, initiatedByMe } = requestSelect(viewerId);

  const conditions = [
    sql`${studyRequests.deletedAt} is null`,
    or(
      eq(studyRequests.requesterId, viewerId),
      eq(studyRequests.helperId, viewerId),
    ),
  ];
  if (box === "incoming") conditions.push(sql`not ${initiatedByMe}`);
  if (box === "outgoing") conditions.push(initiatedByMe);
  if (status) conditions.push(sql`${effectiveRequestStatus} = ${status}`);

  const where = and(...conditions);

  const [rows, [counts]] = await Promise.all([
    db
      .select({ ...fields, total: totalOver() })
      .from(studyRequests)
      .innerJoin(other, join)
      .where(where)
      .orderBy(desc(studyRequests.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.execute(sql`
      select
        count(*) filter (where status = 'pending' and expires_at > now() and not ${initiatedByMe})::int as "pendingIncoming",
        count(*) filter (where status = 'pending' and expires_at > now() and ${initiatedByMe})::int as "pendingOutgoing",
        count(*) filter (where status = 'accepted')::int as accepted
      from study_requests
      where deleted_at is null and (requester_id = ${viewerId} or helper_id = ${viewerId})
    `),
  ]);

  const result = await finishPage(rows, { page, limit });
  return { requests: result.items, counts, pagination: result.pagination };
}

export async function respondToRequest(userId, id, action) {
  await db.transaction(async (tx) => {
    const [request] = await tx
      .select()
      .from(studyRequests)
      .where(
        and(eq(studyRequests.id, id), sql`${studyRequests.deletedAt} is null`),
      )
      .for("update");
    if (
      !request ||
      (request.requesterId !== userId && request.helperId !== userId)
    )
      fail("REQUEST_NOT_FOUND");

    assert(request.status === "pending", "REQUEST_NOT_PENDING");
    assert(new Date(request.expiresAt) > new Date(), "REQUEST_EXPIRED");

    const initiatorId =
      request.initiatedBy === "requester"
        ? request.requesterId
        : request.helperId;

    if (action === "cancel") assert(initiatorId === userId, "FORBIDDEN");
    else assert(initiatorId !== userId, "FORBIDDEN");

    const status = {
      accept: "accepted",
      decline: "declined",
      cancel: "cancelled",
    }[action];
    await tx
      .update(studyRequests)
      .set({ status, respondedAt: new Date() })
      .where(eq(studyRequests.id, id));

    if (action === "accept" && request.signId) {
      await tx
        .update(helpSigns)
        .set({ status: "fulfilled", closedAt: new Date() })
        .where(
          and(eq(helpSigns.id, request.signId), eq(helpSigns.status, "open")),
        );
    }
  });

  return getRequest(userId, id);
}

export async function removeRequest(userId, id) {
  const [request] = await db
    .select({
      status: effectiveRequestStatus,
      requesterId: studyRequests.requesterId,
      helperId: studyRequests.helperId,
    })
    .from(studyRequests)
    .where(
      and(eq(studyRequests.id, id), sql`${studyRequests.deletedAt} is null`),
    )
    .limit(1);

  if (
    !request ||
    (request.requesterId !== userId && request.helperId !== userId)
  )
    fail("REQUEST_NOT_FOUND");
  assert(request.status !== "pending", "REQUEST_NOT_PENDING");

  await db
    .update(studyRequests)
    .set({ deletedAt: new Date() })
    .where(eq(studyRequests.id, id));
  return { id };
}

export async function getHistory(viewerId, { role, page, limit }) {
  const { other, fields, join } = requestSelect(viewerId);

  const conditions = [
    sql`${studyRequests.deletedAt} is null`,
    sql`${effectiveRequestStatus} <> 'pending'`,
    role === "helper"
      ? eq(studyRequests.helperId, viewerId)
      : role === "requester"
        ? eq(studyRequests.requesterId, viewerId)
        : or(
            eq(studyRequests.requesterId, viewerId),
            eq(studyRequests.helperId, viewerId),
          ),
  ];
  const where = and(...conditions);

  const [rows, [stats]] = await Promise.all([
    db
      .select({ ...fields, total: totalOver() })
      .from(studyRequests)
      .innerJoin(other, join)
      .where(where)
      .orderBy(
        desc(
          sql`coalesce(${studyRequests.respondedAt}, ${studyRequests.createdAt})`,
        ),
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.execute(sql`
      select
        count(*) filter (where status = 'accepted' and helper_id = ${viewerId})::int as helped,
        count(*) filter (where status = 'accepted' and requester_id = ${viewerId})::int as received,
        count(distinct case when status = 'accepted' then (case when helper_id = ${viewerId} then requester_id else helper_id end) end)::int as people
      from study_requests where deleted_at is null and (requester_id = ${viewerId} or helper_id = ${viewerId})
    `),
  ]);

  const result = await finishPage(rows, { page, limit });
  return { history: result.items, stats, pagination: result.pagination };
}
