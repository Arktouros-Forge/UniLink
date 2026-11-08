import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@database/index";
import {
  competitions,
  teamMembers,
  teams,
  users,
} from "@database/schema/index";

import { assert, fail } from "../../utils/errors.js";
import { ref, userSkillsJson, whatsappUrl } from "../_sql.js";

const memberCount = (teamIdColumn) =>
  sql`(select count(*) from team_members m where m.team_id = ${ref(teamIdColumn)} and m.status = 'accepted')`.mapWith(
    Number,
  );

async function loadTeam(executor, teamId, { lock = false } = {}) {
  const query = executor
    .select({
      id: teams.id,
      competitionId: teams.competitionId,
      name: teams.name,
      description: teams.description,
      creatorId: teams.creatorId,
      maxMembers: teams.maxMembers,
      result: teams.result,
      resultReportedAt: teams.resultReportedAt,
      competitionTitle: competitions.title,
      competitionStatus: competitions.status,
      competitionDeadline: competitions.deadline,
      competitionMaxTeamSize: competitions.maxTeamSize,
    })
    .from(teams)
    .innerJoin(competitions, eq(competitions.id, teams.competitionId))
    .where(eq(teams.id, teamId));

  const [team] = lock ? await query.for("update", { of: teams }) : await query;
  if (!team) fail("TEAM_NOT_FOUND");
  return team;
}

const capacity = (team) =>
  team.maxMembers ?? team.competitionMaxTeamSize ?? null;

function assertEditable(team) {
  assert(team.competitionStatus !== "closed", "COMPETITION_CLOSED");
  assert(
    new Date(team.competitionDeadline) > new Date(),
    "COMPETITION_DEADLINE_PASSED",
  );
}

async function acceptedCount(executor, teamId) {
  const [row] = await executor
    .select({ n: memberCount(teams.id) })
    .from(teams)
    .where(eq(teams.id, teamId));
  return row.n;
}

export async function getTeam(viewerId, teamId) {
  const team = await loadTeam(db, teamId);

  const members = await db
    .select({
      memberId: teamMembers.id,
      userId: users.id,
      fullName: users.fullName,
      username: users.username,
      year: users.year,
      major: users.major,
      profilePhotoUrl: users.profilePhotoUrl,
      phone: users.phone,
      status: teamMembers.status,
      joinedAt: teamMembers.joinedAt,
      skills: userSkillsJson(users.id),
    })
    .from(teamMembers)
    .innerJoin(users, eq(users.id, teamMembers.userId))
    .where(eq(teamMembers.teamId, teamId))
    .orderBy(asc(teamMembers.joinedAt));

  const me = members.find((member) => member.userId === viewerId);
  const isCreator = team.creatorId === viewerId;
  const isAccepted = me?.status === "accepted";

  const visible = members
    .filter((member) => isCreator || member.status === "accepted")
    .map(({ phone, ...member }) => ({
      ...member,
      isCreator: member.userId === team.creatorId,
      contact:
        isAccepted && member.status === "accepted" && member.userId !== viewerId
          ? { whatsappUrl: whatsappUrl(phone) }
          : null,
    }));

  const accepted = members.filter(
    (member) => member.status === "accepted",
  ).length;
  const limit = capacity(team);

  return {
    ...team,
    acceptedCount: accepted,
    pendingCount: members.length - accepted,
    isFull: limit !== null && accepted >= limit,
    members: visible,
    viewer: {
      isCreator,
      status: me?.status ?? null,
      canJoin: !me && (limit === null || accepted < limit),
    },
  };
}

export async function listMyTeams(userId) {
  return db
    .select({
      id: teams.id,
      name: teams.name,
      description: teams.description,
      result: teams.result,
      maxMembers: teams.maxMembers,
      myStatus: teamMembers.status,
      isCreator: sql`${teams.creatorId} = ${userId}`.mapWith(Boolean),
      acceptedCount: memberCount(teams.id),
      pendingCount:
        sql`(select count(*) from team_members m where m.team_id = ${teams.id} and m.status = 'pending')`.mapWith(
          Number,
        ),
      competition: sql`json_build_object('id', ${competitions.id}, 'title', ${competitions.title}, 'host', ${competitions.host}, 'deadline', ${competitions.deadline}, 'status', ${competitions.status}, 'maxTeamSize', ${competitions.maxTeamSize})`,
      members: sql`coalesce((
        select json_agg(json_build_object('id', mu.id, 'fullName', mu.full_name, 'profilePhotoUrl', mu.profile_photo_url) order by m.joined_at)
        from team_members m join users mu on mu.id = m.user_id
        where m.team_id = ${teams.id} and m.status = 'accepted'
      ), '[]'::json)`,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teams.id, teamMembers.teamId))
    .innerJoin(competitions, eq(competitions.id, teams.competitionId))
    .where(eq(teamMembers.userId, userId))
    .orderBy(desc(competitions.deadline));
}

export async function createTeam(
  userId,
  { competitionId, name, description, maxMembers },
) {
  const id = await db.transaction(async (tx) => {
    const [competition] = await tx
      .select({
        status: competitions.status,
        deadline: competitions.deadline,
        maxTeamSize: competitions.maxTeamSize,
      })
      .from(competitions)
      .where(eq(competitions.id, competitionId))
      .for("share");

    if (!competition) fail("COMPETITION_NOT_FOUND");
    assert(competition.status === "published", "COMPETITION_CLOSED");
    assert(
      new Date(competition.deadline) > new Date(),
      "COMPETITION_DEADLINE_PASSED",
    );

    const size = maxMembers ?? competition.maxTeamSize ?? null;
    if (
      competition.maxTeamSize !== null &&
      size !== null &&
      size > competition.maxTeamSize
    )
      fail("TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT");

    const [existing] = await tx
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.competitionId, competitionId),
          eq(teamMembers.userId, userId),
          eq(teamMembers.status, "accepted"),
        ),
      )
      .limit(1);
    if (existing) fail("ALREADY_IN_TEAM");

    const [team] = await tx
      .insert(teams)
      .values({
        competitionId,
        name: name.trim(),
        description: description ?? null,
        maxMembers: size,
        creatorId: userId,
      })
      .returning({ id: teams.id });

    await tx
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.competitionId, competitionId),
          eq(teamMembers.userId, userId),
          eq(teamMembers.status, "pending"),
        ),
      );
    await tx
      .insert(teamMembers)
      .values({ teamId: team.id, competitionId, userId, status: "accepted" });
    return team.id;
  });

  return getTeam(userId, id);
}

export async function updateTeam(userId, teamId, data) {
  await db.transaction(async (tx) => {
    const team = await loadTeam(tx, teamId, { lock: true });
    assert(team.creatorId === userId, "FORBIDDEN");
    assertEditable(team);

    const next =
      data.maxMembers !== undefined ? data.maxMembers : team.maxMembers;
    if (
      team.competitionMaxTeamSize !== null &&
      next !== null &&
      next > team.competitionMaxTeamSize
    )
      fail("TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT");
    if (next !== null && (await acceptedCount(tx, teamId)) > next)
      fail("TEAM_SIZE_BELOW_CURRENT_MEMBERS");

    await tx
      .update(teams)
      .set({
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.maxMembers !== undefined && { maxMembers: data.maxMembers }),
      })
      .where(eq(teams.id, teamId));
  });

  return getTeam(userId, teamId);
}

export async function deleteTeam(userId, teamId) {
  const team = await loadTeam(db, teamId);
  assert(team.creatorId === userId, "FORBIDDEN");
  assertEditable(team);
  await db.delete(teams).where(eq(teams.id, teamId));
  return { id: teamId };
}

export async function joinTeam(userId, teamId) {
  return db.transaction(async (tx) => {
    const team = await loadTeam(tx, teamId, { lock: true });
    assert(team.competitionStatus === "published", "COMPETITION_CLOSED");
    assertEditable(team);

    const memberships = await tx
      .select({ teamId: teamMembers.teamId, status: teamMembers.status })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.competitionId, team.competitionId),
          eq(teamMembers.userId, userId),
        ),
      );

    const here = memberships.find((row) => row.teamId === teamId);
    if (here)
      fail(
        here.status === "pending"
          ? "JOIN_REQUEST_ALREADY_EXISTS"
          : "ALREADY_TEAM_MEMBER",
      );
    if (memberships.some((row) => row.status === "accepted"))
      fail("ALREADY_IN_TEAM");

    const limit = capacity(team);
    if (limit !== null && (await acceptedCount(tx, teamId)) >= limit)
      fail("TEAM_FULL");

    const [member] = await tx
      .insert(teamMembers)
      .values({
        teamId,
        competitionId: team.competitionId,
        userId,
        status: "pending",
      })
      .returning({
        id: teamMembers.id,
        status: teamMembers.status,
        joinedAt: teamMembers.joinedAt,
      });

    return member;
  });
}

export async function leaveTeam(userId, teamId) {
  const team = await loadTeam(db, teamId);
  assertEditable(team);
  assert(team.creatorId !== userId, "CREATOR_CANNOT_LEAVE");

  const removed = await db
    .delete(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)))
    .returning({ id: teamMembers.id });

  if (!removed.length) fail("NOT_TEAM_MEMBER");
  return { id: teamId };
}

export async function listMembers(viewerId, teamId) {
  const team = await getTeam(viewerId, teamId);
  return team.members;
}

export async function listJoinRequests(userId, teamId) {
  const team = await loadTeam(db, teamId);
  assert(team.creatorId === userId, "FORBIDDEN");

  return db
    .select({
      memberId: teamMembers.id,
      userId: users.id,
      fullName: users.fullName,
      username: users.username,
      year: users.year,
      major: users.major,
      bio: users.bio,
      profilePhotoUrl: users.profilePhotoUrl,
      requestedAt: teamMembers.joinedAt,
      skills: userSkillsJson(users.id),
    })
    .from(teamMembers)
    .innerJoin(users, eq(users.id, teamMembers.userId))
    .where(
      and(eq(teamMembers.teamId, teamId), eq(teamMembers.status, "pending")),
    )
    .orderBy(asc(teamMembers.joinedAt));
}

export async function respondToJoin(creatorId, teamId, memberUserId, decision) {
  await db.transaction(async (tx) => {
    const team = await loadTeam(tx, teamId, { lock: true });
    assert(team.creatorId === creatorId, "FORBIDDEN");
    assertEditable(team);
    assert(memberUserId !== creatorId, "CANNOT_CHANGE_CREATOR");

    const [member] = await tx
      .select({ id: teamMembers.id, status: teamMembers.status })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, memberUserId),
        ),
      )
      .limit(1);
    if (!member) fail("MEMBER_NOT_FOUND");

    if (
      decision === "decline" ||
      (decision === "remove" && member.status === "accepted")
    ) {
      await tx.delete(teamMembers).where(eq(teamMembers.id, member.id));
      return;
    }

    if (member.status === "accepted") return;

    const limit = capacity(team);
    if (limit !== null && (await acceptedCount(tx, teamId)) >= limit)
      fail("TEAM_FULL");

    const [clash] = await tx
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.competitionId, team.competitionId),
          eq(teamMembers.userId, memberUserId),
          eq(teamMembers.status, "accepted"),
        ),
      )
      .limit(1);
    if (clash) fail("ALREADY_IN_TEAM");

    await tx
      .update(teamMembers)
      .set({ status: "accepted" })
      .where(eq(teamMembers.id, member.id));
  });

  return getTeam(creatorId, teamId);
}

export async function reportResult(userId, teamId, result) {
  const team = await loadTeam(db, teamId);
  assert(
    new Date(team.competitionDeadline) <= new Date(),
    "COMPETITION_NOT_FINISHED",
  );

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.status, "accepted"),
      ),
    )
    .limit(1);
  if (!membership) fail("NOT_ACCEPTED_MEMBER");

  const [updated] = await db
    .update(teams)
    .set({ result, resultReportedAt: new Date(), resultReportedBy: userId })
    .where(eq(teams.id, teamId))
    .returning({
      id: teams.id,
      result: teams.result,
      resultReportedAt: teams.resultReportedAt,
    });

  return updated;
}
