import { helpSigns, studyRequests } from "@database/schema";

import {
  fallbackTopic,
  helpTopics,
  preferredTimes,
  requestMessages,
} from "./data/activity";
import { SEED_USER_IDS, seedUuid, type SeedContext } from "./lib/context";
import { insertMany } from "./lib/insert";
import { daysFromNow } from "./lib/random";

export async function seedStudy(ctx: SeedContext) {
  const { rng, now } = ctx;
  const active = ctx.students.filter((s) => s.status === "active");

  const holdersOf = new Map<string, string[]>();
  for (const [userId, names] of ctx.skillsByUser)
    for (const name of names)
      holdersOf.set(name, [...(holdersOf.get(name) ?? []), userId]);

  const topicFor = (skill: string) => helpTopics[skill] ?? fallbackTopic;

  const signRows: (typeof helpSigns.$inferInsert)[] = [];
  const signMeta: {
    id: string;
    userId: string;
    skill: string;
    status: string;
  }[] = [];

  const wantedSkills = [...ctx.ids.skills.keys()].filter(
    (name) => (holdersOf.get(name)?.length ?? 0) >= 2,
  );

  for (let i = 0; i < 28; i++) {
    const skill = rng.pick(wantedSkills);
    const owner =
      i < 3
        ? SEED_USER_IDS.student
        : rng.pick(
            active
              .filter((s) => !holdersOf.get(skill)?.includes(s.id))
              .map((s) => s.id),
          );
    const topic = topicFor(skill);
    const idx = rng.int(0, topic.titles.length - 1);
    const status =
      i < 3
        ? (["open", "open", "fulfilled"] as const)[i]
        : rng.weighted([
            ["open", 0.55],
            ["fulfilled", 0.15],
            ["closed", 0.12],
            ["expired", 0.18],
          ] as const);
    const createdDays = -rng.int(0, status === "expired" ? 30 : 10);
    const expiresAt =
      status === "expired"
        ? daysFromNow(-rng.int(1, 6), now)
        : daysFromNow(createdDays + 14, now);
    const id = seedUuid(30, i + 1);

    signRows.push({
      id,
      userId: owner,
      skillId: ctx.ids.skills.get(skill)!,
      title: topic.titles[idx],
      description: topic.details[idx],
      preferredTime: rng.chance(0.8) ? rng.pick(preferredTimes) : null,
      status,
      createdAt: daysFromNow(createdDays, now),
      expiresAt,
      closedAt:
        status === "closed" || status === "fulfilled"
          ? daysFromNow(createdDays + rng.int(1, 5), now)
          : null,
    });
    signMeta.push({ id, userId: owner, skill, status });
  }

  const requestRows: (typeof studyRequests.$inferInsert)[] = [];
  const pairKeys = new Set<string>();
  let counter = 0;

  const push = (row: {
    requesterId: string;
    helperId: string;
    initiatedBy: "requester" | "helper";
    skill: string;
    signId?: string | null;
    status: "pending" | "accepted" | "declined" | "expired" | "cancelled";
    ageDays: number;
  }) => {
    if (row.requesterId === row.helperId) return;
    const topic = topicFor(row.skill);
    const idx = rng.int(0, topic.titles.length - 1);
    const subject = topic.titles[idx];
    const key = `${row.requesterId}|${row.helperId}|${subject.toLowerCase()}`;
    if (pairKeys.has(key)) return;
    pairKeys.add(key);

    const createdAt = daysFromNow(-row.ageDays, now);
    const responded = row.status === "accepted" || row.status === "declined";
    requestRows.push({
      id: seedUuid(31, ++counter),
      requesterId: row.requesterId,
      helperId: row.helperId,
      initiatedBy: row.initiatedBy,
      signId: row.signId ?? null,
      subject,
      description: `${rng.pick(requestMessages)} ${topic.details[idx]}`,
      preferredTime: rng.chance(0.75) ? rng.pick(preferredTimes) : null,
      status: row.status,
      createdAt,
      respondedAt: responded
        ? new Date(createdAt.getTime() + rng.int(1, 40) * 3_600_000)
        : null,
      expiresAt:
        row.status === "expired"
          ? daysFromNow(-rng.int(1, 5), now)
          : new Date(
              createdAt.getTime() +
                7 * 86_400_000 +
                (row.status === "pending" ? 3 * 86_400_000 : 0),
            ),
      deletedAt: null,
    });
  };

  const mainSkills = ctx.skillsByUser.get(SEED_USER_IDS.student)!;

  mainSkills.slice(0, 3).forEach((skill, i) => {
    const other = rng.pick(
      holdersOf.get(skill)!.filter((id) => id !== SEED_USER_IDS.student),
    );
    push({
      requesterId: other,
      helperId: SEED_USER_IDS.student,
      initiatedBy: "requester",
      skill,
      status: "pending",
      ageDays: i,
    });
  });

  const wantedByMain = ["Machine Learning", "UI/UX Design"].filter((name) =>
    holdersOf.has(name),
  );
  wantedByMain.forEach((skill, i) =>
    push({
      requesterId: SEED_USER_IDS.student,
      helperId: rng.pick(holdersOf.get(skill)!),
      initiatedBy: "requester",
      skill,
      status: i === 0 ? "accepted" : "pending",
      ageDays: i + 2,
    }),
  );

  for (const sign of signMeta.filter((s) => s.status !== "open")) {
    const helper = rng.pick(
      holdersOf.get(sign.skill)!.filter((id) => id !== sign.userId),
    );
    if (!helper) continue;
    push({
      requesterId: sign.userId,
      helperId: helper,
      initiatedBy: "helper",
      skill: sign.skill,
      signId: sign.id,
      status:
        sign.status === "fulfilled"
          ? "accepted"
          : sign.status === "expired"
            ? "expired"
            : "declined",
      ageDays: rng.int(3, 20),
    });
  }

  for (const sign of signMeta.filter((s) => s.status === "open").slice(0, 8)) {
    const helper = rng.pick(
      holdersOf.get(sign.skill)!.filter((id) => id !== sign.userId),
    );
    if (!helper) continue;
    push({
      requesterId: sign.userId,
      helperId: helper,
      initiatedBy: "helper",
      skill: sign.skill,
      signId: sign.id,
      status: "pending",
      ageDays: rng.int(0, 3),
    });
  }

  for (let i = 0; i < 70; i++) {
    const skill = rng.pick(wantedSkills);
    const helper = rng.pick(holdersOf.get(skill)!);
    const requester = rng.pick(active).id;
    push({
      requesterId: requester,
      helperId: helper,
      initiatedBy: "requester",
      skill,
      status: rng.weighted([
        ["pending", 0.3],
        ["accepted", 0.33],
        ["declined", 0.12],
        ["cancelled", 0.07],
        ["expired", 0.18],
      ] as const),
      ageDays: rng.int(0, 45),
    });
  }

  await insertMany(helpSigns, signRows);
  await insertMany(studyRequests, requestRows);

  console.log(
    `✓ Study match: ${signRows.length} help signs, ${requestRows.length} requests`,
  );
}
