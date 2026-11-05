import { and, asc, count, eq, inArray, ne, sql } from "drizzle-orm";

import { db } from "@database/index";
import {
  competitions,
  teamMembers,
  teams,
  users,
} from "@database/schema/index";

async function getAcceptedMemberCount(executor, teamId) {
  const [result] = await executor
    .select({
      count: count(),
    })
    .from(teamMembers)
    .where(
      and(eq(teamMembers.teamId, teamId), eq(teamMembers.status, "accepted")),
    );

  return Number(result?.count ?? 0);
}

async function getTeamWithDetails(executor, teamId) {
  const [team] = await executor
    .select({
      id: teams.id,
      competitionId: teams.competitionId,
      competitionTitle: competitions.title,
      competitionDeadline: competitions.deadline,
      competitionStatus: competitions.status,
      name: teams.name,
      description: teams.description,
      maxMembers: teams.maxMembers,
      creatorId: teams.creatorId,
      result: teams.result,
      resultReportedAt: teams.resultReportedAt,
      resultReportedBy: teams.resultReportedBy,
      createdAt: teams.createdAt,
    })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(teams.id, teamId))
    .limit(1);

  if (!team) return null;

  const members = await executor
    .select({
      id: teamMembers.id,
      userId: teamMembers.userId,
      username: users.username,
      fullName: users.fullName,
      profilePhotoUrl: users.profilePhotoUrl,
      status: teamMembers.status,
      joinedAt: teamMembers.joinedAt,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId))
    .orderBy(asc(teamMembers.joinedAt));

  const acceptedMemberCount = members.filter(
    (member) => member.status === "accepted",
  ).length;

  return {
    ...team,
    acceptedMemberCount,
    members,
  };
}

export async function createTeam(userId, data) {
  return db.transaction(async (tx) => {
    const [competition] = await tx
      .select({
        id: competitions.id,
        status: competitions.status,
        deadline: competitions.deadline,
        maxTeamSize: competitions.maxTeamSize,
      })
      .from(competitions)
      .where(eq(competitions.id, data.competitionId))
      .limit(1);

    if (!competition) {
      return { error: "COMPETITION_NOT_FOUND" };
    }

    if (competition.status === "closed") {
      return { error: "COMPETITION_CLOSED" };
    }

    if (competition.deadline && new Date(competition.deadline) <= new Date()) {
      return { error: "COMPETITION_DEADLINE_PASSED" };
    }

    const [existingMembership] = await tx
      .select({
        id: teamMembers.id,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(
        and(
          eq(teamMembers.userId, userId),
          eq(teams.competitionId, data.competitionId),
        ),
      )
      .limit(1);

    if (existingMembership) {
      return { error: "ALREADY_IN_TEAM" };
    }

    const [existingCreatorTeam] = await tx
      .select({
        id: teams.id,
      })
      .from(teams)
      .where(
        and(
          eq(teams.competitionId, data.competitionId),
          eq(teams.creatorId, userId),
        ),
      )
      .limit(1);

    if (existingCreatorTeam) {
      return { error: "TEAM_ALREADY_CREATED" };
    }

    const maxMembers = data.maxMembers ?? competition.maxTeamSize ?? null;

    if (maxMembers !== null && maxMembers < 1) {
      return { error: "INVALID_TEAM_SIZE" };
    }

    if (
      competition.maxTeamSize !== null &&
      maxMembers !== null &&
      maxMembers > competition.maxTeamSize
    ) {
      return { error: "TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT" };
    }

    const [team] = await tx
      .insert(teams)
      .values({
        competitionId: competition.id,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        maxMembers,
        creatorId: userId,
      })
      .returning();

    await tx.insert(teamMembers).values({
      teamId: team.id,
      userId,
      status: "accepted",
    });

    return getTeamWithDetails(tx, team.id);
  });
}

export async function getTeamById(teamId) {
  return getTeamWithDetails(db, teamId);
}

export async function updateTeam(userId, teamId, data) {
  const [team] = await db
    .select({
      id: teams.id,
      competitionId: teams.competitionId,
      creatorId: teams.creatorId,
      maxMembers: teams.maxMembers,
      competitionMaxTeamSize: competitions.maxTeamSize,
      competitionStatus: competitions.status,
      competitionDeadline: competitions.deadline,
    })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(teams.id, teamId))
    .limit(1);

  if (!team) return { error: "TEAM_NOT_FOUND" };

  if (team.creatorId !== userId) {
    return { error: "FORBIDDEN" };
  }

  if (team.competitionStatus === "closed") {
    return { error: "COMPETITION_CLOSED" };
  }

  if (
    team.competitionDeadline &&
    new Date(team.competitionDeadline) <= new Date()
  ) {
    return { error: "COMPETITION_DEADLINE_PASSED" };
  }

  const nextMaxMembers =
    data.maxMembers !== undefined ? data.maxMembers : team.maxMembers;

  if (nextMaxMembers !== null && nextMaxMembers < 1) {
    return { error: "INVALID_TEAM_SIZE" };
  }

  if (
    team.competitionMaxTeamSize !== null &&
    nextMaxMembers !== null &&
    nextMaxMembers > team.competitionMaxTeamSize
  ) {
    return { error: "TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT" };
  }

  const acceptedMemberCount = await getAcceptedMemberCount(db, teamId);

  if (nextMaxMembers !== null && acceptedMemberCount > nextMaxMembers) {
    return { error: "TEAM_SIZE_BELOW_CURRENT_MEMBERS" };
  }

  await db
    .update(teams)
    .set({
      ...(data.name !== undefined && {
        name: data.name.trim(),
      }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || null,
      }),
      ...(data.maxMembers !== undefined && {
        maxMembers: data.maxMembers,
      }),
    })
    .where(eq(teams.id, teamId));

  return getTeamWithDetails(db, teamId);
}

export async function deleteTeam(userId, teamId) {
  const [team] = await db
    .select({
      id: teams.id,
      creatorId: teams.creatorId,
      competitionStatus: competitions.status,
      competitionDeadline: competitions.deadline,
    })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(teams.id, teamId))
    .limit(1);

  if (!team) return { error: "TEAM_NOT_FOUND" };

  if (team.creatorId !== userId) {
    return { error: "FORBIDDEN" };
  }

  if (team.competitionStatus === "closed") {
    return { error: "COMPETITION_CLOSED" };
  }

  if (
    team.competitionDeadline &&
    new Date(team.competitionDeadline) <= new Date()
  ) {
    return { error: "COMPETITION_DEADLINE_PASSED" };
  }

  await db.delete(teams).where(eq(teams.id, teamId));

  return { success: true };
}

export async function joinTeam(userId, teamId) {
  return db.transaction(async (tx) => {
    const [team] = await tx
      .select({
        id: teams.id,
        competitionId: teams.competitionId,
        maxMembers: teams.maxMembers,
        competitionMaxTeamSize: competitions.maxTeamSize,
        competitionStatus: competitions.status,
        competitionDeadline: competitions.deadline,
      })
      .from(teams)
      .innerJoin(competitions, eq(teams.competitionId, competitions.id))
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) return { error: "TEAM_NOT_FOUND" };

    if (team.competitionStatus === "closed") {
      return { error: "COMPETITION_CLOSED" };
    }

    if (
      team.competitionDeadline &&
      new Date(team.competitionDeadline) <= new Date()
    ) {
      return { error: "COMPETITION_DEADLINE_PASSED" };
    }

    const [existingMembership] = await tx
      .select({
        id: teamMembers.id,
        teamId: teamMembers.teamId,
        status: teamMembers.status,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(
        and(
          eq(teamMembers.userId, userId),
          eq(teams.competitionId, team.competitionId),
        ),
      )
      .limit(1);

    if (existingMembership) {
      if (existingMembership.teamId === teamId) {
        return existingMembership.status === "pending"
          ? { error: "JOIN_REQUEST_ALREADY_EXISTS" }
          : { error: "ALREADY_TEAM_MEMBER" };
      }

      return { error: "ALREADY_IN_TEAM" };
    }

    const acceptedMemberCount = await getAcceptedMemberCount(tx, teamId);

    const maxMembers = team.maxMembers ?? team.competitionMaxTeamSize;

    if (maxMembers !== null && acceptedMemberCount >= maxMembers) {
      return { error: "TEAM_FULL" };
    }

    const [member] = await tx
      .insert(teamMembers)
      .values({
        teamId,
        userId,
        status: "pending",
      })
      .returning();

    return {
      ...member,
      message: "Join request submitted",
    };
  });
}

export async function leaveTeam(userId, teamId) {
  const [membership] = await db
    .select({
      id: teamMembers.id,
      status: teamMembers.status,
      creatorId: teams.creatorId,
      competitionStatus: competitions.status,
      competitionDeadline: competitions.deadline,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)))
    .limit(1);

  if (!membership) return { error: "NOT_TEAM_MEMBER" };

  if (membership.creatorId === userId) {
    return { error: "CREATOR_CANNOT_LEAVE" };
  }

  if (membership.competitionStatus === "closed") {
    return { error: "COMPETITION_CLOSED" };
  }

  if (
    membership.competitionDeadline &&
    new Date(membership.competitionDeadline) <= new Date()
  ) {
    return { error: "COMPETITION_DEADLINE_PASSED" };
  }

  await db.delete(teamMembers).where(eq(teamMembers.id, membership.id));

  return { success: true };
}

export async function getTeamMembers(teamId) {
  const team = await getTeamById(teamId);

  // console.log("getTeamById result:", team);

  if (!team) return null;

  return db
    .select({
      id: teamMembers.id,
      userId: teamMembers.userId,
      username: users.username,
      fullName: users.fullName,
      profilePhotoUrl: users.profilePhotoUrl,
      status: teamMembers.status,
      joinedAt: teamMembers.joinedAt,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId))
    .orderBy(asc(teamMembers.joinedAt));
}

export async function updateMemberStatus(
  creatorId,
  teamId,
  memberUserId,
  status,
) {
  return db.transaction(async (tx) => {
    const [team] = await tx
      .select({
        id: teams.id,
        creatorId: teams.creatorId,
        maxMembers: teams.maxMembers,
        competitionMaxTeamSize: competitions.maxTeamSize,
        competitionStatus: competitions.status,
        competitionDeadline: competitions.deadline,
      })
      .from(teams)
      .innerJoin(competitions, eq(teams.competitionId, competitions.id))
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team) return { error: "TEAM_NOT_FOUND" };

    if (team.creatorId !== creatorId) {
      return { error: "FORBIDDEN" };
    }

    if (team.competitionStatus === "closed") {
      return { error: "COMPETITION_CLOSED" };
    }

    if (
      team.competitionDeadline &&
      new Date(team.competitionDeadline) <= new Date()
    ) {
      return { error: "COMPETITION_DEADLINE_PASSED" };
    }

    const [member] = await tx
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        status: teamMembers.status,
      })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, memberUserId),
        ),
      )
      .limit(1);

    if (!member) return { error: "MEMBER_NOT_FOUND" };

    if (member.userId === creatorId) {
      return { error: "CANNOT_CHANGE_CREATOR" };
    }

    if (status === "accepted") {
      const acceptedMemberCount = await getAcceptedMemberCount(tx, teamId);

      const maxMembers = team.maxMembers ?? team.competitionMaxTeamSize;

      if (maxMembers !== null && acceptedMemberCount >= maxMembers) {
        return { error: "TEAM_FULL" };
      }

      await tx
        .update(teamMembers)
        .set({
          status: "accepted",
        })
        .where(eq(teamMembers.id, member.id));
    } else {
      await tx.delete(teamMembers).where(eq(teamMembers.id, member.id));
    }

    return getTeamWithDetails(tx, teamId);
  });
}

export async function reportTeamResult(userId, teamId, result) {
  const [team] = await db
    .select({
      id: teams.id,
      competitionDeadline: competitions.deadline,
      competitionStatus: competitions.status,
    })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(teams.id, teamId))
    .limit(1);

  if (!team) return { error: "TEAM_NOT_FOUND" };

  if (
    !team.competitionDeadline ||
    new Date(team.competitionDeadline) > new Date()
  ) {
    return { error: "COMPETITION_NOT_FINISHED" };
  }

  const [membership] = await db
    .select({
      id: teamMembers.id,
    })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId),
        eq(teamMembers.status, "accepted"),
      ),
    )
    .limit(1);

  if (!membership) {
    return { error: "NOT_ACCEPTED_MEMBER" };
  }

  const [updatedTeam] = await db
    .update(teams)
    .set({
      result,
      resultReportedAt: new Date(),
      resultReportedBy: userId,
    })
    .where(eq(teams.id, teamId))
    .returning();

  return updatedTeam;
}
