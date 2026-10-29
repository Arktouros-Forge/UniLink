import { and, asc, eq } from "drizzle-orm";
import { db } from "@database/index";
import { skills, userSkills } from "@database/schema/index";

export async function getUserSkills(userId) {
  return db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      description: skills.description,
      addedAt: userSkills.createdAt,
    })
    .from(userSkills)
    .innerJoin(skills, eq(userSkills.skillId, skills.id))
    .where(eq(userSkills.userId, userId))
    .orderBy(asc(skills.name));
}

export async function addUserSkill(userId, skillId) {
  const [skill] = await db
    .select({
      id: skills.id,
      name: skills.name,
      slug: skills.slug,
      description: skills.description,
    })
    .from(skills)
    .where(eq(skills.id, skillId))
    .limit(1);

  if (!skill) {
    return {
      success: false,
      reason: "SKILL_NOT_FOUND",
    };
  }

  const [inserted] = await db
    .insert(userSkills)
    .values({
      userId,
      skillId,
    })
    .onConflictDoNothing()
    .returning({
      id: userSkills.id,
    });

  if (!inserted) {
    return {
      success: false,
      reason: "SKILL_ALREADY_ADDED",
    };
  }

  return {
    success: true,
    data: skill,
  };
}

export async function removeUserSkill(userId, skillId) {
  const [deleted] = await db
    .delete(userSkills)
    .where(and(eq(userSkills.userId, userId), eq(userSkills.skillId, skillId)))
    .returning({
      id: userSkills.id,
    });

  return Boolean(deleted);
}
