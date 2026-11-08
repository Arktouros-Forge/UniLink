import { userSkills, users } from "@database/schema";

import {
  bioTemplates,
  firstNames,
  lastNames,
  majorSkillPools,
  majors,
} from "./data/people";
import {
  SEED_CREDENTIALS,
  SEED_USER_IDS,
  seedUuid,
  type SeedContext,
  type SeedStudent,
} from "./lib/context";
import { insertMany } from "./lib/insert";
import { daysFromNow, slugify } from "./lib/random";
import { hashPassword } from "@server/utils/password.js";

const STUDENT_COUNT = Number(process.env.SEED_STUDENTS ?? 60);

const yearWeights = [
  ["2021", 0.12],
  ["2022", 0.2],
  ["2023", 0.3],
  ["2024", 0.24],
  ["2025", 0.14],
] as const;

export async function seedUsers(ctx: SeedContext) {
  const { rng, now } = ctx;
  const [studentHash, adminHash] = await Promise.all([
    hashPassword(SEED_CREDENTIALS.student.password),
    hashPassword(SEED_CREDENTIALS.admin.password),
  ]);

  const usedNames = new Set<string>(["Ayu Pramesti"]);
  const usedUsernames = new Set<string>(["ayu.pramesti", "admin"]);

  const people: (SeedStudent & {
    username: string;
    email: string;
    nim: string;
    bio: string;
    blockedReason: string | null;
    onboarded: boolean;
  })[] = [];

  const main = {
    id: SEED_USER_IDS.student,
    fullName: "Ayu Pramesti",
    year: "2023",
    major: "Informatika",
    phone: "+6281239001001",
    status: "active" as const,
    username: "ayu.pramesti",
    email: SEED_CREDENTIALS.student.email,
    nim: "2308561001",
    bio: "Mahasiswa Informatika yang suka algoritma dan basis data. Aktif mencari tim untuk GEMASTIK dan COMPFEST.",
    blockedReason: null,
    onboarded: true,
  };
  people.push(main);

  for (let i = 0; people.length < STUDENT_COUNT; i++) {
    const fullName = `${firstNames[(i * 7) % firstNames.length]} ${lastNames[(i * 11 + Math.floor(i / 50)) % lastNames.length]}`;
    if (usedNames.has(fullName)) continue;
    usedNames.add(fullName);

    const year = rng.weighted(yearWeights);
    const major = rng.weighted(majors);
    const base = slugify(fullName).replace(/-/g, ".");
    const username = usedUsernames.has(base)
      ? `${base}${rng.int(2, 99)}`
      : base;
    usedUsernames.add(username);

    const n = people.length;
    const blocked = n === STUDENT_COUNT - 1;

    people.push({
      id: seedUuid(1, n),
      fullName,
      year,
      major,
      phone: `+62${rng.int(811, 859)}${rng.int(1000000, 9999999)}`,
      status: blocked ? "blocked" : "active",
      username,
      email: `${username}@unilink.test`,
      nim: `${year.slice(2)}08${String(rng.int(1, 9)).padStart(1, "0")}${String(1000 + n).padStart(4, "0")}`,
      bio: "",
      blockedReason: blocked
        ? "Melanggar ketentuan penggunaan: mengirim permintaan berulang yang tidak relevan."
        : null,
      onboarded: !blocked && rng.chance(0.93),
    });
  }

  const skillNames = [...ctx.ids.skills.keys()];
  const mainSkills = [
    "Python",
    "Algoritma & Struktur Data",
    "Basis Data & SQL",
    "Web Frontend",
  ];

  const skillRows: { userId: string; skillId: string }[] = [];

  for (const person of people) {
    const pool = (majorSkillPools[person.major] ?? skillNames).filter((name) =>
      ctx.ids.skills.has(name),
    );
    const chosen =
      person.id === main.id ? mainSkills : rng.sample(pool, rng.int(2, 5));
    ctx.skillsByUser.set(person.id, chosen);
    chosen.forEach((name) =>
      skillRows.push({ userId: person.id, skillId: ctx.ids.skills.get(name)! }),
    );
    if (!person.bio)
      person.bio = rng.pick(bioTemplates).replace("{skill}", chosen[0]);
  }

  const rows = people.map((person) => ({
    id: person.id,
    username: person.username,
    email: person.email,
    password: studentHash,
    emailVerifiedAt: daysFromNow(-rng.int(20, 400), now),
    fullName: person.fullName,
    nim: person.nim,
    phone: person.phone,
    role: "student" as const,
    year: person.year as (typeof users.$inferInsert)["year"],
    major: person.major,
    bio: person.bio,
    status: person.status,
    blockedReason: person.blockedReason,
    onboardedAt: person.onboarded ? daysFromNow(-rng.int(20, 400), now) : null,
    lastLoginAt:
      person.status === "blocked" ? null : daysFromNow(-rng.int(0, 14), now),
    createdAt: daysFromNow(-rng.int(30, 420), now),
  }));

  rows.push({
    id: SEED_USER_IDS.admin,
    username: "admin",
    email: SEED_CREDENTIALS.admin.email,
    password: adminHash,
    emailVerifiedAt: daysFromNow(-400, now),
    fullName: "Administrator UniLink",
    nim: "2000000001",
    phone: "+6281200000001",
    role: "admin" as never,
    year: "2020",
    major: null as never,
    bio: null as never,
    status: "active",
    blockedReason: null,
    onboardedAt: daysFromNow(-500, now),
    lastLoginAt: daysFromNow(-1, now),
    createdAt: daysFromNow(-500, now),
  });

  await insertMany(users, rows);
  await insertMany(userSkills, skillRows);

  ctx.students = people;
  ctx.ids.students = people
    .filter((p) => p.status === "active")
    .map((p) => p.id);

  console.log(
    `✓ Users: ${people.length} students (1 blocked) + 1 admin, ${skillRows.length} skill links`,
  );
}
