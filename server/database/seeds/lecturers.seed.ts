import { db } from "@database/client";
import { lecturers } from "@database/schema";

export async function seedLecturers() {
  await db
    .insert(lecturers)
    .values([
      {
        name: "Dr. Budi Santoso",
        email: "budi.santoso@unilink.test",
        nidn: "0012345678",
        bio: "Lecturer in computer science.",
      },
      {
        name: "Dr. Siti Rahmawati",
        email: "siti.rahmawati@unilink.test",
        nidn: "0012345679",
        bio: "Lecturer in information systems.",
      },
      {
        name: "Andi Wijaya, M.Kom.",
        email: "andi.wijaya@unilink.test",
        nidn: "0012345680",
        bio: "Lecturer in software engineering.",
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Lecturers seeded");
}
