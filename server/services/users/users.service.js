import { and, asc, count, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@database/index";
import { skills, userSkills, users } from "@database/schema/index";

export async function getUserAuthContext(userId) {
  const [user] = await db
    .select({
      id: users.id,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

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

  if (!user) return null;

  return {
    ...user,
    skills: await getUserSkills(userId),
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

  if (!user) return null;

  return {
    ...user,
    skills: await getUserSkills(userId),
  };
}

export async function updateUserProfile(userId, data) {
  const { skills: skillIds, ...profileData } = data;

  return db.transaction(async (tx) => {
    if (skillIds !== undefined) {
      const existingSkills = skillIds.length
        ? await tx
            .select({ id: skills.id })
            .from(skills)
            .where(inArray(skills.id, skillIds))
        : [];

      const existingIds = new Set(existingSkills.map((skill) => skill.id));

      const invalidSkillIds = skillIds.filter((id) => !existingIds.has(id));

      if (invalidSkillIds.length > 0) {
        return {
          success: false,
          reason: "INVALID_SKILLS",
          invalidSkillIds,
        };
      }
    }

    const [updatedUser] = await tx
      .update(users)
      .set({
        ...profileData,
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

    if (!updatedUser) {
      return {
        success: false,
        reason: "USER_NOT_FOUND",
      };
    }

    if (skillIds !== undefined) {
      await tx.delete(userSkills).where(eq(userSkills.userId, userId));

      if (skillIds.length > 0) {
        await tx.insert(userSkills).values(
          skillIds.map((skillId) => ({
            userId,
            skillId,
          })),
        );
      }
    }

    return {
      success: true,
      data: {
        ...updatedUser,
        skills: await getUserSkills(userId, tx),
      },
    };
  });
}

export async function getStudents({ q, page = 1, limit = 10 }) {
  const conditions = [eq(users.role, "student")];

  if (q) {
    conditions.push(
      or(
        ilike(users.fullName, `%${q}%`),
        ilike(users.username, `%${q}%`),
        ilike(users.nim, `%${q}%`),
      ),
    );
  }

  const where = and(...conditions);

  const [students, [{ total }]] = await Promise.all([
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
      .orderBy(asc(users.fullName))
      .limit(limit)
      .offset((page - 1) * limit),

    db.select({ total: count() }).from(users).where(where),
  ]);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getUserSkills(userId, executor = db) {
  return executor
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      description: skills.description,
      addedAt: userSkills.createdAt,
    })
    .from(userSkills)
    .innerJoin(skills, eq(userSkills.skillId, skills.id))
    .where(eq(userSkills.userId, userId));
}
