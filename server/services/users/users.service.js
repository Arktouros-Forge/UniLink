import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "@database/index";
import { users } from "@database/schema/index";

export async function getUserById(userId) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      nim: users.nim,
      email: users.email,
      phone: users.phone,
      role: users.role,
      year: users.year,
      personalWebsite: users.personalWebsite,
      profilePhotoUrl: users.profilePhotoUrl,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function getStudents({ q, page, limit }) {
  const conditions = [eq(users.role, "student")];

  if (q) {
    conditions.push(
      or(ilike(users.username, `%${q}%`), ilike(users.fullName, `%${q}%`)),
    );
  }

  const where = and(...conditions);
  const offset = (page - 1) * limit;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        year: users.year,
        personalWebsite: users.personalWebsite,
        profilePhotoUrl: users.profilePhotoUrl,
      })
      .from(users)
      .where(where)
      .orderBy(asc(users.username))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(users).where(where),
  ]);

  return {
    users: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getStudentById(userId) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      role: users.role,
      year: users.year,
      personalWebsite: users.personalWebsite,
      profilePhotoUrl: users.profilePhotoUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.role, "student")))
    .limit(1);

  return user ?? null;
}

export async function updateUserProfile(userId, data) {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      nim: users.nim,
      email: users.email,
      phone: users.phone,
      role: users.role,
      year: users.year,
      personalWebsite: users.personalWebsite,
      profilePhotoUrl: users.profilePhotoUrl,
      status: users.status,
    });

  return updatedUser ?? null;
}
