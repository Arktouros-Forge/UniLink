import { asc, count, ilike, or, eq } from "drizzle-orm";
import { db } from "@database/index";
import { skills } from "@database/schema/index";

export async function getSkills({ q, page, limit }) {
  const conditions = q
    ? or(
        ilike(skills.name, `%${q}%`),
        ilike(skills.slug, `%${q}%`),
        ilike(skills.description, `%${q}%`),
      )
    : undefined;

  const offset = (page - 1) * limit;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: skills.id,
        name: skills.name,
        slug: skills.slug,
      })
      .from(skills)
      .where(conditions)
      .orderBy(asc(skills.name))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(skills).where(conditions),
  ]);

  return {
    skills: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSkillById(skillId) {
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

  return skill ?? null;
}
