import { db } from "@database/client";
import { categories } from "@database/schema";

export async function seedCategories() {
  await db
    .insert(categories)
    .values([
      {
        name: "Technology",
        slug: "technology",
        description: "Technology and computing competitions",
        color: "#3B82F6",
      },
      {
        name: "Business",
        slug: "business",
        description: "Business and entrepreneurship competitions",
        color: "#10B981",
      },
      {
        name: "Design",
        slug: "design",
        description: "Design and creative competitions",
        color: "#A855F7",
      },
      {
        name: "Science",
        slug: "science",
        description: "Science and research competitions",
        color: "#F59E0B",
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Categories seeded");
}
