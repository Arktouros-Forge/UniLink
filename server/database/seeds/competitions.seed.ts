import {
  competitionCategories,
  competitions,
  teamMembers,
  teams,
} from "@database/schema";

import {
  competitionSeeds,
  teamBlurbs,
  teamNamePool,
} from "./data/competitions";
import { SEED_USER_IDS, seedUuid, type SeedContext } from "./lib/context";
import { insertMany } from "./lib/insert";
import { daysFromNow } from "./lib/random";

export async function seedCompetitions(ctx: SeedContext) {
  const { rng, now } = ctx;
  const students = ctx.ids.students;

  const competitionRows = competitionSeeds.map((seed, index) => {
    const id = seedUuid(20, index + 1);
    ctx.ids.competitions.set(seed.key, id);
    const createdBy =
      seed.by === "admin" ? SEED_USER_IDS.admin : rng.pick(students.slice(1));

    return {
      id,
      title: seed.title,
      description: seed.description,
      deadline: daysFromNow(seed.deadlineInDays, now),
      maxTeamSize: seed.maxTeamSize,
      host: seed.host,
      prize: seed.prize,
      sourceUrl: `https://example.com/kompetisi/${seed.key}`,
      imageUrl: null,
      status: seed.status,
      createdBy,
      createdByRole: seed.by,
      createdAt: daysFromNow(-rng.int(10, 120), now),
    };
  });

  await insertMany(competitions, competitionRows);

  await insertMany(
    competitionCategories,
    competitionSeeds.flatMap((seed) =>
      seed.categories.map((name) => ({
        competitionId: ctx.ids.competitions.get(seed.key)!,
        categoryId: ctx.ids.categories.get(name)!,
      })),
    ),
  );

  const teamRows: (typeof teams.$inferInsert)[] = [];
  const memberRows: (typeof teamMembers.$inferInsert)[] = [];
  const names = rng.shuffle(teamNamePool);
  let teamCounter = 0;

  for (const seed of competitionSeeds) {
    if (!seed.teams) continue;
    const competitionId = ctx.ids.competitions.get(seed.key)!;
    const busy = new Set<string>();
    const closed = seed.status === "closed";

    for (let t = 0; t < seed.teams; t++) {
      teamCounter++;
      const teamId = seedUuid(21, teamCounter);

      const preferMain =
        (seed.key === "gemastik" && t === 0) ||
        (seed.key === "ibpc" && t === 1);
      const creatorPool = students.filter(
        (id) => !busy.has(id) && id !== SEED_USER_IDS.student,
      );
      const creatorId =
        seed.key === "gemastik" && t === 0
          ? SEED_USER_IDS.student
          : rng.pick(creatorPool);
      busy.add(creatorId);

      const roster = [creatorId];
      const accepted = Math.min(
        seed.maxTeamSize,
        1 + rng.int(closed ? 1 : 0, seed.maxTeamSize - 1),
      );
      const wantMain = preferMain && seed.key === "ibpc";

      if (wantMain) {
        roster.push(SEED_USER_IDS.student);
        busy.add(SEED_USER_IDS.student);
      }

      while (roster.length < accepted) {
        const candidate = rng.pick(
          students.filter(
            (id) => !busy.has(id) && id !== SEED_USER_IDS.student,
          ),
        );
        busy.add(candidate);
        roster.push(candidate);
      }

      const reporter = closed ? rng.pick(roster) : null;

      teamRows.push({
        id: teamId,
        competitionId,
        name: names[teamCounter % names.length],
        description: rng.pick(teamBlurbs),
        maxMembers: seed.maxTeamSize,
        creatorId,
        result: closed
          ? rng.weighted([
              ["won", 0.35],
              ["lost", 0.65],
            ] as const)
          : "unknown",
        resultReportedAt: closed
          ? daysFromNow(seed.deadlineInDays + rng.int(2, 9), now)
          : null,
        resultReportedBy: reporter,
        createdAt: daysFromNow(
          -rng.int(3, 40) + Math.min(seed.deadlineInDays, 0),
          now,
        ),
      });

      roster.forEach((userId, i) =>
        memberRows.push({
          teamId,
          competitionId,
          userId,
          status: "accepted",
          joinedAt: daysFromNow(
            -rng.int(1, 25) + Math.min(seed.deadlineInDays, 0),
            now,
          ),
        }),
      );

      const full = roster.length >= seed.maxTeamSize;
      if (!closed && !full) {
        const pendingCount = rng.int(
          0,
          Math.min(2, seed.maxTeamSize - roster.length),
        );
        const extra: string[] = [];
        if (seed.key === "gemastik" && t === 0)
          extra.push(...students.filter((id) => !busy.has(id)).slice(0, 2));
        else
          for (let p = 0; p < pendingCount; p++)
            extra.push(
              rng.pick(
                students.filter((id) => !busy.has(id) && !extra.includes(id)),
              ),
            );
        extra.forEach((userId) =>
          memberRows.push({
            teamId,
            competitionId,
            userId,
            status: "pending",
            joinedAt: daysFromNow(-rng.int(0, 4), now),
          }),
        );
      }
    }
  }

  const compfest = ctx.ids.competitions.get("compfest")!;
  const compfestTeam = teamRows.find((row) => row.competitionId === compfest);
  if (
    compfestTeam &&
    !memberRows.some(
      (m) => m.competitionId === compfest && m.userId === SEED_USER_IDS.student,
    )
  ) {
    memberRows.push({
      teamId: compfestTeam.id!,
      competitionId: compfest,
      userId: SEED_USER_IDS.student,
      status: "pending",
      joinedAt: daysFromNow(-1, now),
    });
  }

  await insertMany(teams, teamRows);
  await insertMany(teamMembers, memberRows);

  console.log(
    `✓ Competitions: ${competitionRows.length}, ${teamRows.length} teams, ${memberRows.length} memberships`,
  );
}
