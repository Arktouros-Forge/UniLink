import { db } from "@database/client";
import { skills } from "@database/schema";

export async function seedSkills() {
  await db
    .insert(skills)
    .values([
      {
        name: "JavaScript",
        slug: "javascript",
        description: "JavaScript programming language",
      },
      {
        name: "TypeScript",
        slug: "typescript",
        description: "TypeScript programming language",
      },
      {
        name: "Python",
        slug: "python",
        description: "Python programming language",
      },
      {
        name: "UI/UX Design",
        slug: "ui-ux-design",
        description: "User interface and experience design",
      },
      {
        name: "Database",
        slug: "database",
        description: "Database design and management",
      },
      {
        name: "Machine Learning",
        slug: "machine-learning",
        description: "Machine learning and artificial intelligence",
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Skills seeded");
}
