import { and, asc, count, desc, eq, gt, isNull, ne, or } from "drizzle-orm";

import { db } from "@database/index";
import {
  competitions,
  lecturers,
  studyRequests,
  teamMembers,
  teams,
  timetableEvents,
  users,
} from "@database/schema/index";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

async function getStudyMatchSummary(userId) {
  const now = new Date();

  const incomingCondition = or(
    and(
      eq(studyRequests.initiatedBy, "requester"),
      eq(studyRequests.helperId, userId),
    ),
    and(
      eq(studyRequests.initiatedBy, "helper"),
      eq(studyRequests.requesterId, userId),
    ),
  );

  const conditions = and(
    eq(studyRequests.status, "pending"),
    isNull(studyRequests.deletedAt),
    gt(studyRequests.expiresAt, now),
    incomingCondition,
  );

  const [countResult, latestResult] = await Promise.all([
    db.select({ total: count() }).from(studyRequests).where(conditions),

    db
      .select({
        id: studyRequests.id,
        requesterId: studyRequests.requesterId,
        helperId: studyRequests.helperId,
        initiatedBy: studyRequests.initiatedBy,
        subject: studyRequests.subject,
        createdAt: studyRequests.createdAt,
      })
      .from(studyRequests)
      .where(conditions)
      .orderBy(desc(studyRequests.createdAt))
      .limit(1),
  ]);

  const latest = latestResult[0];

  if (!latest) {
    return {
      pendingRequestCount: Number(countResult[0]?.total ?? 0),
      latestRequest: null,
    };
  }

  const senderId =
    latest.initiatedBy === "requester" ? latest.requesterId : latest.helperId;

  const [sender] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      profilePhotoUrl: users.profilePhotoUrl,
    })
    .from(users)
    .where(eq(users.id, senderId))
    .limit(1);

  return {
    pendingRequestCount: Number(countResult[0]?.total ?? 0),
    latestRequest: {
      id: latest.id,
      subject: latest.subject,
      createdAt: latest.createdAt,
      sender: sender ?? null,
    },
  };
}

async function getTeamSummary(userId) {
  const activeConditions = and(
    eq(teamMembers.userId, userId),
    eq(teamMembers.status, "accepted"),
    ne(competitions.status, "closed"),
  );

  const [activeTeams, latestResult] = await Promise.all([
    db
      .selectDistinct({
        teamId: teams.id,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(competitions, eq(teams.competitionId, competitions.id))
      .where(activeConditions),

    db
      .select({
        id: teams.id,
        name: teams.name,
        createdAt: teams.createdAt,
        teamMaxMembers: teams.maxMembers,
        competitionName: competitions.title,
        competitionMaxTeamSize: competitions.maxTeamSize,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(competitions, eq(teams.competitionId, competitions.id))
      .where(activeConditions)
      .orderBy(desc(teams.createdAt))
      .limit(1),
  ]);

  const latest = latestResult[0];

  if (!latest) {
    return {
      activeTeamCount: activeTeams.length,
      latestTeam: null,
    };
  }

  const [memberCountResult] = await db
    .select({
      total: count(),
    })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, latest.id),
        eq(teamMembers.status, "accepted"),
      ),
    );

  return {
    activeTeamCount: activeTeams.length,
    latestTeam: {
      id: latest.id,
      name: latest.name,
      competitionName: latest.competitionName,
      currentMemberCount: Number(memberCountResult?.total ?? 0),
      maxTeamSize:
        latest.teamMaxMembers ?? latest.competitionMaxTeamSize ?? null,
    },
  };
}

async function getTimetableSummary(userId) {
  const events = await db
    .select({
      id: timetableEvents.id,
      courseCode: timetableEvents.courseCode,
      title: timetableEvents.title,
      dayOfWeek: timetableEvents.dayOfWeek,
      startTime: timetableEvents.startTime,
      endTime: timetableEvents.endTime,
      room: timetableEvents.room,
      lecturerName: lecturers.name,
      lecturerNameFreeText: timetableEvents.lecturerNameFreeText,
    })
    .from(timetableEvents)
    .leftJoin(lecturers, eq(timetableEvents.lecturerId, lecturers.id))
    .where(eq(timetableEvents.userId, userId))
    .orderBy(asc(timetableEvents.dayOfWeek), asc(timetableEvents.startTime));

  return {
    events: events.map((event) => ({
      id: event.id,
      courseCode: event.courseCode,
      title: event.title,
      dayOfWeek: event.dayOfWeek,
      dayName: DAY_NAMES[event.dayOfWeek - 1] ?? null,
      startTime: event.startTime,
      endTime: event.endTime,
      room: event.room,
      lecturer: event.lecturerName ?? event.lecturerNameFreeText ?? null,
    })),
  };
}

export async function getStudentDashboard(userId) {
  const [studyMatch, teams, timetable] = await Promise.all([
    getStudyMatchSummary(userId),
    getTeamSummary(userId),
    getTimetableSummary(userId),
  ]);

  return {
    studyMatch,
    teams,
    timetable,
  };
}
