import { db } from "@database/client";
import { users } from "@database/schema";

export const SEED_USER_IDS = {
  student: "00000000-0000-4000-8000-000000000001",
  admin: "00000000-0000-4000-8000-000000000002",
} as const;

const STUDENT_PASSWORD = "Student123!";
const ADMIN_PASSWORD = "Admin123!";

export async function seedUsers() {
  const [studentPasswordHash, adminPasswordHash] = await Promise.all([
    Bun.password.hash(STUDENT_PASSWORD),
    Bun.password.hash(ADMIN_PASSWORD),
  ]);

  const students = [
    {
      id: SEED_USER_IDS.student,
      username: "student01",
      email: "student01@unilink.test",
      fullName: "Test Student",
      nim: "2300010001",
      phone: "+6281234567890",
      year: "2023",
    },
    {
      id: "00000000-0000-4000-8000-000000000003",
      username: "andiputra",
      email: "andi@unilink.test",
      fullName: "Andi Pratama",
      nim: "2300010002",
      phone: "+6281234567892",
      year: "2023",
    },
    {
      id: "00000000-0000-4000-8000-000000000004",
      username: "sitinur",
      email: "siti@unilink.test",
      fullName: "Siti Nurhaliza",
      nim: "2200010003",
      phone: "+6281234567893",
      year: "2022",
    },
    {
      id: "00000000-0000-4000-8000-000000000005",
      username: "bimawijaya",
      email: "bima@unilink.test",
      fullName: "Bima Wijaya",
      nim: "2400010004",
      phone: "+6281234567894",
      year: "2024",
    },
    {
      id: "00000000-0000-4000-8000-000000000006",
      username: "nadiaf",
      email: "nadia@unilink.test",
      fullName: "Nadia Fitri",
      nim: "2300010005",
      phone: "+6281234567895",
      year: "2023",
    },
    {
      id: "00000000-0000-4000-8000-000000000007",
      username: "rizkyahmad",
      email: "rizky@unilink.test",
      fullName: "Rizky Ahmad",
      nim: "2100010006",
      phone: "+6281234567896",
      year: "2021",
    },
    {
      id: "00000000-0000-4000-8000-000000000008",
      username: "clarissa",
      email: "clarissa@unilink.test",
      fullName: "Clarissa Putri",
      nim: "2400010007",
      phone: "+6281234567897",
      year: "2024",
    },
    {
      id: "00000000-0000-4000-8000-000000000009",
      username: "fajarhidayat",
      email: "fajar@unilink.test",
      fullName: "Fajar Hidayat",
      nim: "2200010008",
      phone: "+6281234567898",
      year: "2022",
    },
    {
      id: "00000000-0000-4000-8000-000000000010",
      username: "melatip",
      email: "melati@unilink.test",
      fullName: "Melati Permata",
      nim: "2300010009",
      phone: "+6281234567899",
      year: "2023",
    },
    {
      id: "00000000-0000-4000-8000-000000000011",
      username: "dimasar",
      email: "dimas@unilink.test",
      fullName: "Dimas Arya",
      nim: "2500010010",
      phone: "+6281234567800",
      year: "2025",
    },
    {
      id: "00000000-0000-4000-8000-000000000012",
      username: "putridewi",
      email: "putri@unilink.test",
      fullName: "Putri Dewi",
      nim: "2100010011",
      phone: "+6281234567801",
      year: "2021",
    },
    {
      id: "00000000-0000-4000-8000-000000000013",
      username: "ariframadan",
      email: "arif@unilink.test",
      fullName: "Arif Ramadan",
      nim: "2400010012",
      phone: "+6281234567802",
      year: "2024",
    },
    {
      id: "00000000-0000-4000-8000-000000000014",
      username: "chelsea",
      email: "chelsea@unilink.test",
      fullName: "Chelsea Ananda",
      nim: "2200010013",
      phone: "+6281234567803",
      year: "2022",
    },
    {
      id: "00000000-0000-4000-8000-000000000015",
      username: "yogapratama",
      email: "yoga@unilink.test",
      fullName: "Yoga Pratama",
      nim: "2300010014",
      phone: "+6281234567804",
      year: "2023",
    },
    {
      id: "00000000-0000-4000-8000-000000000016",
      username: "ameliar",
      email: "amelia@unilink.test",
      fullName: "Amelia Rahma",
      nim: "2500010015",
      phone: "+6281234567805",
      year: "2025",
    },
  ] as const;

  const admin = {
    id: SEED_USER_IDS.admin,
    username: "admin",
    email: "admin@unilink.test",
    fullName: "UniLink Administrator",
    nim: "2000010001",
    phone: "+6281234567891",
    role: "admin",
    year: "2020",
    password: adminPasswordHash,
  } as const;

  for (const student of students) {
    await db
      .insert(users)
      .values({
        ...student,
        role: "student",
        password: studentPasswordHash,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: student.username,
          email: student.email,
          fullName: student.fullName,
          nim: student.nim,
          phone: student.phone,
          year: student.year,
          password: studentPasswordHash,
          updatedAt: new Date(),
        },
      });
  }

  await db
    .insert(users)
    .values(admin)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        nim: admin.nim,
        phone: admin.phone,
        role: "admin",
        year: admin.year,
        password: adminPasswordHash,
        updatedAt: new Date(),
      },
    });

  console.log(`✓ Seeded ${students.length} students and 1 admin`);
}
