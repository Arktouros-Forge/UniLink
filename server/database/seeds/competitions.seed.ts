import { db } from "@database/client";
import {
  categories,
  competitionCategories,
  competitions,
} from "@database/schema";
import { SEED_USER_IDS } from "./users.seed";

const SEED_COMPETITION_IDS = {
  hackathon: "00000000-0000-4000-8000-000000000101",
  business: "00000000-0000-4000-8000-000000000102",
  design: "00000000-0000-4000-8000-000000000103",
} as const;

export async function seedCompetitions() {
  await db
    .insert(competitions)
    .values([
      {
        id: SEED_COMPETITION_IDS.hackathon,
        title: "National Student Hackathon",
        description:
          "A hackathon for university students to build innovative solutions.",
        deadline: new Date("2027-06-30T23:59:00+08:00"),
        maxTeamSize: 5,
        host: "UniLink Demo Organizer",
        sourceUrl: "https://example.com/hackathon",
        status: "published",
        createdBy: SEED_USER_IDS.admin,
        createdByRole: "admin",
      },
      {
        id: SEED_COMPETITION_IDS.business,
        title: "Student Business Plan Competition",
        description:
          "Present an innovative business idea and compete with other students.",
        deadline: new Date("2027-07-15T23:59:00+08:00"),
        maxTeamSize: 4,
        host: "UniLink Demo Organizer",
        sourceUrl: "https://example.com/business",
        status: "published",
        createdBy: SEED_USER_IDS.admin,
        createdByRole: "admin",
      },
      {
        id: SEED_COMPETITION_IDS.design,
        title: "UI/UX Design Challenge",
        description:
          "Design a user-friendly digital product for a real-world problem.",
        deadline: new Date("2027-08-01T23:59:00+08:00"),
        maxTeamSize: 3,
        host: "UniLink Demo Organizer",
        sourceUrl: "https://example.com/design",
        status: "published",
        createdBy: SEED_USER_IDS.student,
        createdByRole: "student",
      },
    ])
    .onConflictDoNothing();

  const seededCategories = await db.select().from(categories);

  const categoryIds = new Map(
    seededCategories.map((category) => [category.slug, category.id]),
  );

  const categoryRelations: {
    competitionId: string;
    categoryId: string;
  }[] = [];

  const technologyId = categoryIds.get("technology");
  const businessId = categoryIds.get("business");
  const designId = categoryIds.get("design");

  if (technologyId) {
    categoryRelations.push({
      competitionId: SEED_COMPETITION_IDS.hackathon,
      categoryId: technologyId,
    });
  }

  if (businessId) {
    categoryRelations.push({
      competitionId: SEED_COMPETITION_IDS.business,
      categoryId: businessId,
    });
  }

  if (designId) {
    categoryRelations.push({
      competitionId: SEED_COMPETITION_IDS.design,
      categoryId: designId,
    });
  }

  if (categoryRelations.length > 0) {
    await db
      .insert(competitionCategories)
      .values(categoryRelations)
      .onConflictDoNothing();
  }

  console.log("✓ Competitions seeded");
}
