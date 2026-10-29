import { client } from "@database/client";

async function cleanDatabase() {
  if (process.env.ALLOW_DB_RESET !== "true") {
    throw new Error(
      "Database reset blocked. Set ALLOW_DB_RESET=true in .env to continue.",
    );
  }

  console.log("Cleaning database...");

  await client.unsafe(`
    TRUNCATE TABLE
      public.competition_categories,
      public.team_members,
      public.teams,
      public.competitions,
      public.help_signs,
      public.study_requests,
      public.tasks,
      public.timetable_events,
      public.user_skills,
      public.lecturers,
      public.skills,
      public.categories,
      public.users
    RESTART IDENTITY CASCADE;
  `);

  console.log("✓ Database cleaned");
}

try {
  await cleanDatabase();
} catch (error) {
  console.error("✗ Database cleaning failed:", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
