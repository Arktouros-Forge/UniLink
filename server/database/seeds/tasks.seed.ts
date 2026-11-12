import { tasks } from "@database/schema";

import { courseSeeds } from "./data/reference";
import { generalTasks, taskTemplates } from "./data/activity";
import { SEED_USER_IDS, seedUuid, type SeedContext } from "./lib/context";
import { insertMany } from "./lib/insert";
import { daysFromNow } from "./lib/random";

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export async function seedTasks(ctx: SeedContext) {
  const { rng, now } = ctx;
  const active = ctx.students.filter((s) => s.status === "active");

  const taskRows: (typeof tasks.$inferInsert)[] = [];

  for (const student of active) {
    const level = Math.max(1, Math.min(4, 2026 - Number(student.year) + 1));
    const pool = courseSeeds.filter(([code]) => {
      if (code.startsWith("UM")) return true;
      if (
        student.major === "Informatika" ||
        student.major === "Sistem Informasi" ||
        student.major === "Teknologi Informasi"
      )
        return Number(code[2]) <= level;
      return (
        code.startsWith("UM") ||
        (code.startsWith("EL") && student.major === "Teknik Elektro")
      );
    });
    const courses = rng.sample(pool.length ? pool : courseSeeds, rng.int(4, 7));
    const taskCount = student.id === SEED_USER_IDS.student ? 9 : rng.int(3, 8);
    for (let i = 0; i < taskCount; i++) {
      const [code, course] = rng.pick(courses);
      const general = rng.chance(0.2);
      const [titleTpl, notes] = rng.pick(taskTemplates);
      const done = rng.chance(0.35);
      const due = daysFromNow(rng.int(done ? -14 : -2, 21), now);

      taskRows.push({
        id: seedUuid(40, taskRows.length + 1),
        userId: student.id,
        title: general
          ? rng.pick(generalTasks)
          : titleTpl.replace("{topic}", course),
        notes: general ? null : notes,
        course: general ? null : code,
        dueDate: isoDate(due),
        priority: rng.weighted([
          ["low", 0.2],
          ["medium", 0.5],
          ["high", 0.3],
        ] as const),
        completed: done,
        completedAt: done ? daysFromNow(rng.int(-10, 0), now) : null,
        createdAt: daysFromNow(-rng.int(1, 30), now),
      });
    }
  }

  await insertMany(tasks, taskRows);

  console.log(
    `✓ Tasks: ${taskRows.length}`,
  );
}
